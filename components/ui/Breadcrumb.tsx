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
      className="relative bg-cover bg-center py-24"
      style={{ backgroundImage: `url(${image})` }}
    >
      <div className="absolute inset-0 bg-primary/80" />
      <div className="relative mx-auto max-w-7xl px-6 text-white">
        <h1 className="font-heading text-4xl font-semibold sm:text-5xl">{title}</h1>
        <nav className="mt-4 flex items-center gap-2 text-sm">
          <Link href="/" className="flex items-center gap-1.5 opacity-90 hover:opacity-100">
            <Home className="size-4" /> Home
          </Link>
          {trail.map((c) => (
            <span key={c.label} className="flex items-center gap-2">
              <ChevronRight className="size-4 opacity-70" />
              {c.href ? (
                <Link href={c.href} className="opacity-90 hover:opacity-100">
                  {c.label}
                </Link>
              ) : (
                <span className="opacity-90">{c.label}</span>
              )}
            </span>
          ))}
        </nav>
      </div>
    </section>
  );
}
