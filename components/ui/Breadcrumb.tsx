import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/primitives";

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
    <section className="relative isolate flex min-h-[300px] items-center overflow-hidden">
      {/* The banner photograph is an optimised, priority-loaded image rather
          than a CSS background, so it is sized per viewport. */}
      <Image src={image} alt="" fill priority sizes="100vw" className="-z-20 object-cover" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-brand-dark/95 via-brand-dark/85 to-brand/60" />

      <div className="mx-auto w-full max-w-7xl px-6 py-16 text-white">
        <Reveal blur duration={0.8}>
          <h1 className="font-heading text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-[3.5rem]">
            {title}
          </h1>
        </Reveal>
        <Stagger
          as="div"
          className="mt-4 flex flex-wrap items-center gap-2 text-sm text-white/80"
          delay={0.15}
        >
          <StaggerItem as="span" direction="right">
            <Link href="/" className="flex items-center gap-1.5 transition hover:text-white">
              <Home className="size-4" /> Home
            </Link>
          </StaggerItem>
          {trail.map((c) => (
            <StaggerItem
              as="span"
              key={c.label}
              direction="right"
              className="flex items-center gap-2"
            >
              <ChevronRight className="size-4 text-brand-sky" />
              {c.href ? (
                <Link href={c.href} className="transition hover:text-white">
                  {c.label}
                </Link>
              ) : (
                <span>{c.label}</span>
              )}
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
