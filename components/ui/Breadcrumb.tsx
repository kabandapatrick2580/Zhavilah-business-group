import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

type Crumb = { label: string; href?: string };

export default function Breadcrumb({
  title,
  trail,
  image = "/assets/img/video/video.jpg",
}: {
  title: string;
  trail: Crumb[];
  image?: string;
}) {
  return (
    <section
      className="relative isolate flex min-h-[300px] items-center bg-cover bg-center"
      style={{ backgroundImage: `url(${image})` }}
    >
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-brand-dark/95 to-brand-dark/70" />
      <div className="mx-auto w-full max-w-7xl px-6 py-16 text-white">
        <h1 className="font-heading text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-[3.5rem]">
          {title}
        </h1>
        <nav className="mt-4 flex flex-wrap items-center gap-2 text-sm text-white/80">
          <Link href="/" className="flex items-center gap-1.5 transition hover:text-white">
            <Home className="size-4" /> Home
          </Link>
          {trail.map((c) => (
            <span key={c.label} className="flex items-center gap-2">
              <ChevronRight className="size-4 text-brand-lime" />
              {c.href ? (
                <Link href={c.href} className="transition hover:text-white">
                  {c.label}
                </Link>
              ) : (
                <span>{c.label}</span>
              )}
            </span>
          ))}
        </nav>
      </div>
    </section>
  );
}
