// The eyebrow + heading pair used at the top of most content sections
// (originally the theme's `.subtitle-one` + `<h2>` markup).

export default function SectionHeading({
  eyebrow,
  title,
  center = false,
  className = "",
}: {
  eyebrow?: string;
  title: string;
  center?: boolean;
  className?: string;
}) {
  return (
    <div className={`${center ? "text-center" : ""} ${className}`}>
      {eyebrow && (
        <span
          className={`inline-flex items-center gap-2.5 text-xs font-extrabold uppercase tracking-[0.12em] text-brand ${
            center ? "justify-center" : ""
          }`}
        >
          <span className="h-0.5 w-7 bg-brand" />
          {eyebrow}
        </span>
      )}
      <h2 className="mt-3 font-heading text-3xl font-bold leading-[1.1] tracking-tight text-brand-ink sm:text-4xl lg:text-[2.7rem]">
        {title}
      </h2>
    </div>
  );
}
