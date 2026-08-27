import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import SectionHeading from "@/components/ui/SectionHeading";
import { Stagger, StaggerItem } from "@/components/motion/primitives";
import { getPosts } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";
import { formatPostDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Insights & News",
  description:
    "Accounting, taxation, logistics and business advisory insights from the team at ZHAVILAH BUSINESS GROUP Ltd.",
};

// Rebuild at most once a minute, so published edits appear without a redeploy.
export const revalidate = 60;

export default async function BlogIndexPage() {
  const posts = await getPosts();

  return (
    <main>
      <Breadcrumb title="Insights & News" trail={[{ label: "Blog" }]} />

      <section className="bg-brand-haze py-20">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            center
            eyebrow="From Our Desk"
            title="Guidance for Growing Businesses"
          />

          {posts.length === 0 ? (
            <p className="mx-auto mt-12 max-w-lg rounded-2xl border border-dashed border-brand-line bg-white px-8 py-14 text-center text-brand-muted">
              There are no articles yet. New insights will appear here as soon as they
              are published.
            </p>
          ) : (
            <Stagger className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3" step={0.07}>
              {posts.map((post) => {
                const cover = urlFor(post.coverImage, 800, 520);
                return (
                  <StaggerItem key={post._id} lift as="article">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-[0_18px_55px_rgba(25,20,65,0.07)] transition hover:shadow-card"
                    >
                      <div className="relative h-56 w-full overflow-hidden bg-brand-tint">
                        {cover && (
                          <Image
                            src={cover}
                            alt={post.coverImage.alt ?? post.title}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
                            className="object-cover transition-transform duration-500 hover:scale-105"
                          />
                        )}
                      </div>

                      <div className="flex flex-1 flex-col p-7">
                        <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-brand">
                          <CalendarDays className="size-4" />
                          {formatPostDate(post.publishedAt)}
                        </span>
                        <h2 className="mt-3 font-heading text-xl font-extrabold leading-snug tracking-tight text-brand-ink">
                          {post.title}
                        </h2>
                        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-brand-muted">
                          {post.excerpt}
                        </p>
                        <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand">
                          Read article <ArrowRight className="size-4" />
                        </span>
                      </div>
                    </Link>
                  </StaggerItem>
                );
              })}
            </Stagger>
          )}
        </div>
      </section>
    </main>
  );
}
