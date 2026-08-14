// Renders the Studio's rich text into the site's typography.
//
// Every block type is mapped explicitly — nothing falls through to raw HTML —
// so an editor cannot inject markup through the CMS.

import Image from "next/image";
import Link from "next/link";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/react";
import { urlFor } from "@/lib/sanity/image";
import type { SanityImage } from "@/lib/sanity/types";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="mt-5 leading-[1.85] text-brand-muted">{children}</p>,
    h2: ({ children }) => (
      <h2 className="mt-12 font-heading text-2xl font-extrabold tracking-tight text-brand-ink sm:text-3xl">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-9 font-heading text-xl font-extrabold tracking-tight text-brand-ink">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="mt-8 border-l-4 border-brand-sky bg-brand-haze px-6 py-5 text-lg italic leading-relaxed text-brand-ink">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mt-5 space-y-2.5 pl-5 text-brand-muted [&>li]:list-disc [&>li]:marker:text-brand-sky">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mt-5 space-y-2.5 pl-5 text-brand-muted [&>li]:list-decimal [&>li]:marker:text-brand">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-[1.8]">{children}</li>,
    number: ({ children }) => <li className="leading-[1.8]">{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-brand-ink">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ children, value }) => {
      const href: string = value?.href ?? "#";
      // Internal links keep client-side navigation; external ones open safely.
      if (href.startsWith("/")) {
        return (
          <Link href={href} className="font-medium text-brand underline underline-offset-4 hover:text-accent">
            {children}
          </Link>
        );
      }
      return (
        <a
          href={href}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel={href.startsWith("http") ? "noreferrer noopener" : undefined}
          className="font-medium text-brand underline underline-offset-4 hover:text-accent"
        >
          {children}
        </a>
      );
    },
  },
  types: {
    image: ({ value }: { value: SanityImage }) => {
      const src = urlFor(value, 1400);
      if (!src) return null;
      return (
        <figure className="mt-10">
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
            <Image
              src={src}
              alt={value.alt ?? ""}
              fill
              sizes="(max-width: 768px) 100vw, 800px"
              className="object-cover"
            />
          </div>
          {value.caption && (
            <figcaption className="mt-3 text-center text-sm text-brand-muted">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
};

export default function PortableBody({ value }: { value: PortableTextBlock[] }) {
  return <PortableText value={value} components={components} />;
}
