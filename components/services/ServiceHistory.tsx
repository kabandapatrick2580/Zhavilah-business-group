// Renders the alternating image / content-card layout used by the service
// pages (originally the theme's "company-history" section), now driven by
// typed data instead of hard-coded markup.

export type HistoryImage = { kind: "image"; src: string; alt: string };
export type HistoryCard = {
  kind: "card";
  eyebrow?: string;
  heading: string;
  text: string;
};
export type HistoryBlock = HistoryImage | HistoryCard;

function Block({ block }: { block: HistoryBlock }) {
  if (block.kind === "image") {
    return (
      <img
        src={block.src}
        alt={block.alt}
        className="h-72 w-full rounded-2xl object-cover shadow-[0_18px_55px_rgba(8,63,52,0.1)]"
      />
    );
  }
  return (
    <div className="rounded-2xl border border-brand-line bg-white p-8 shadow-[0_18px_55px_rgba(8,63,52,0.06)]">
      {block.eyebrow && (
        <span className="mb-2 inline-block text-xs font-extrabold uppercase tracking-[0.12em] text-brand">
          {block.eyebrow}
        </span>
      )}
      <h3 className="font-heading text-2xl font-semibold text-brand-ink">{block.heading}</h3>
      <p className="mt-3 leading-relaxed text-brand-muted">{block.text}</p>
    </div>
  );
}

export default function ServiceHistory({
  columns,
}: {
  columns: [HistoryBlock[], HistoryBlock[]];
}) {
  return (
    <section className="bg-brand-haze py-20">
      <div className="mx-auto grid max-w-7xl gap-6 px-6 lg:grid-cols-2">
        {columns.map((col, i) => (
          <div key={i} className="flex flex-col gap-6">
            {col.map((block, j) => (
              <Block key={j} block={block} />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
