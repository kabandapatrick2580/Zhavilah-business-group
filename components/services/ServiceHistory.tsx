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
        className="w-full rounded-xl object-cover shadow-card"
      />
    );
  }
  return (
    <div className="rounded-xl border border-line bg-white p-6 shadow-card">
      {block.eyebrow && (
        <span className="mb-2 inline-block text-sm font-semibold uppercase tracking-wide text-accent">
          {block.eyebrow}
        </span>
      )}
      <h5 className="font-heading text-xl font-semibold text-primary">{block.heading}</h5>
      <p className="mt-3 leading-relaxed text-body">{block.text}</p>
    </div>
  );
}

export default function ServiceHistory({
  columns,
}: {
  columns: [HistoryBlock[], HistoryBlock[]];
}) {
  return (
    <section className="py-20">
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
