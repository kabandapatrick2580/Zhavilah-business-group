"use client";

// Cloudflare Turnstile widget.
//
// The script is loaded on demand rather than from the app shell, so pages
// without a form pay nothing for it. Rendering is explicit (`render=explicit`)
// so the widget appears exactly where this component sits instead of Cloudflare
// hunting the DOM for something to attach to.

import { useEffect, useRef } from "react";

type TurnstileApi = {
  render: (el: HTMLElement, options: Record<string, unknown>) => string;
  reset: (widgetId?: string) => void;
  remove: (widgetId?: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

// Module-level so two forms on one page share a single script load.
let scriptPromise: Promise<void> | null = null;

function loadScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => {
      // Cleared so a later mount can retry rather than inheriting the failure.
      scriptPromise = null;
      reject(new Error("Turnstile script failed to load"));
    };
    document.head.appendChild(script);
  });

  return scriptPromise;
}

export const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

export default function Turnstile({
  onToken,
  resetSignal = 0,
  theme = "light",
  className,
}: {
  /** Called with a fresh token, or "" when it expires, errors, or is reset. */
  onToken: (token: string) => void;
  /** Increment to discard the current token and issue a new one. */
  resetSignal?: number;
  theme?: "light" | "dark" | "auto";
  className?: string;
}) {
  const container = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);

  // Held in a ref so a changing callback identity doesn't re-render the widget,
  // which would discard a token the visitor has already solved for.
  const onTokenRef = useRef(onToken);
  onTokenRef.current = onToken;

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY || !container.current) return;
    let cancelled = false;

    loadScript()
      .then(() => {
        if (cancelled || widgetId.current || !container.current || !window.turnstile) return;
        widgetId.current = window.turnstile.render(container.current, {
          sitekey: TURNSTILE_SITE_KEY,
          theme,
          // Tokens are single-use and expire after ~5 minutes. Without this, a
          // visitor who opens the page, gets distracted, then submits would be
          // told they failed a check they actually passed.
          "refresh-expired": "auto",
          callback: (token: string) => onTokenRef.current(token),
          "expired-callback": () => onTokenRef.current(""),
          "error-callback": () => onTokenRef.current(""),
        });
      })
      .catch(() => {
        // Script blocked or offline. The submit handler treats an absent token
        // as "not verified" and says so, rather than failing silently.
        onTokenRef.current("");
      });

    return () => {
      cancelled = true;
      if (widgetId.current && window.turnstile) {
        window.turnstile.remove(widgetId.current);
        widgetId.current = null;
      }
    };
  }, [theme]);

  useEffect(() => {
    if (!resetSignal || !widgetId.current || !window.turnstile) return;
    window.turnstile.reset(widgetId.current);
    onTokenRef.current("");
  }, [resetSignal]);

  // Nothing to show before the keys exist; the server fails open to match.
  if (!TURNSTILE_SITE_KEY) return null;

  return <div ref={container} className={className} />;
}
