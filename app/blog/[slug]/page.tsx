import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarDays, UserRound } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import PortableBody from "@/components/blog/PortableBody";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/primitives";
import { getPost, getPostSlugs, getRelatedPosts } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";
import { formatPostDate } from "@/lib/format";

export const revalidate = 60;

// Posts published after the last build are rendered on first request and then
// cached, rather than 404ing until the next deploy.
export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Article not found" };

  const ogImage = urlFor(post.coverImage, 1200, 630);

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: `/blog/${post.slug}`,
      publishedTime: post.publishedAt,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  const related = await getRelatedPosts(slug);
  const hero = urlFor(post.coverImage, 1600, 900);

  return (
    <main>
      <Breadcrumb
        title={post.title}
        trail={[{ label: "Blog", href: "/blog" }, { label: post.title }]}
        image={hero ?? undefined}
      />

      <article className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-6">
          <Reveal>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-brand-line pb-6 text-sm text-brand-muted">
              <span className="flex items-center gap-2">
                <CalendarDays className="size-4 text-brand" />
                {formatPostDate(post.publishedAt)}
              </span>
              {post.author && (
                <span className="flex items-center gap-2">
                  <UserRound className="size-4 text-brand" />
                  {post.author}
                </span>
              )}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mt-8 text-lg font-medium leading-relaxed text-brand-ink">
              {post.excerpt}
            </p>
          </Reveal>

          <div className="mt-2">
            <PortableBody value={post.body} />
          </div>

          <div className="mt-14 border-t border-brand-line pt-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand transition hover:text-accent"
            >
              <ArrowLeft className="size-4" /> Back to all articles
            </Link>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="bg-brand-haze py-16">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="font-heading text-2xl font-extrabold tracking-tight text-brand-ink">
              More insights
            </h2>
            <Stagger className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" step={0.07}>
              {related.map((item) => {
                const cover = urlFor(item.coverImage, 600, 400);
                return (
                  <StaggerItem key={item._id} lift as="article">
                    <Link
                      href={`/blog/${item.slug}`}
                      className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0_18px_55px_rgba(11,38,74,0.07)] transition hover:shadow-card"
                    >
                      <div className="relative h-40 w-full bg-brand-tint">
                        {cover && (
                          <Image
                            src={cover}
                            alt={item.coverImage.alt ?? item.title}
                            fill
                            sizes="(max-width: 640px) 100vw, 320px"
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="flex flex-1 flex-col p-6">
                        <span className="text-xs font-semibold uppercase tracking-[0.1em] text-brand">
                          {formatPostDate(item.publishedAt)}
                        </span>
                        <h3 className="mt-2 font-heading text-lg font-extrabold leading-snug text-brand-ink">
                          {item.title}
                        </h3>
                        <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand">
                          Read <ArrowRight className="size-4" />
                        </span>
                      </div>
                    </Link>
                  </StaggerItem>
                );
              })}
            </Stagger>
          </div>
        </section>
      )}
    </main>
  );
}
