// QR generation, run on the server at build time.
//
// The codes are produced here rather than fetched from a QR image service: the
// widget then costs no runtime request, survives the service disappearing, and
// keeps the phone number out of a third party's logs. It also means no external
// origin to whitelist when the CSP lands (see docs/CMS-IMPLEMENTATION.md §2.4).

import QRCode from "qrcode";

/**
 * Renders `value` as an inline SVG string.
 *
 * Colours are fixed dark-on-white regardless of surrounding design. Scanners
 * threshold on luminance and expect a light background with a dark pattern;
 * inverting or tinting one is the usual reason a code looks fine and refuses to
 * scan. The navy is dark enough to keep the contrast a scanner needs while
 * still reading as brand rather than default black.
 */
export function toQrSvg(value: string): Promise<string> {
  return QRCode.toString(value, {
    type: "svg",
    // Medium recovers ~15% damage — enough for a screen, and it keeps the
    // module count low so the code stays legible at widget size.
    errorCorrectionLevel: "M",
    // The quiet zone the spec requires. Below ~2 modules, scanners start
    // failing against busy backgrounds.
    margin: 2,
    color: { dark: "#0c1e38", light: "#ffffff" },
  });
}
