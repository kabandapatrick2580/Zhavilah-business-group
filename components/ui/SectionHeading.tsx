// The heading used at the top of most content sections. The heading carries
// its own weight; there is no label above it.

import { Reveal } from "@/components/motion/primitives";

export default function SectionHeading({
  title,
  center = false,
  className = "",
}: {
  title: string;
  center?: boolean;
  className?: string;
}) {
  return (
    <Reveal className={`${center ? "text-center" : ""} ${className}`}>
      <h2 className="font-heading text-3xl font-extrabold leading-[1.1] tracking-tight text-brand-ink sm:text-4xl lg:text-[2.7rem]">
        {title}
      </h2>
    </Reveal>
  );
}
