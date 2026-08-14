import HomePage, { type HeroContent } from "@/components/HomePage";
import { getBanners } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";

// No `title` here on purpose: the homepage inherits the descriptive default
// from the root layout ("… - One Stop Business Solution") rather than the
// "%s │ …" template, which would have rendered a bare "Home".

export const revalidate = 60;

export default async function Page() {
  const banners = await getBanners();

  // The hero is a single band, so the first active banner is the one shown;
  // editors reorder to swap. Anything missing falls through to the component's
  // built-in defaults, so a half-filled banner cannot break the page.
  const [banner] = banners;
  const imageUrl = banner ? urlFor(banner.image, 1200, 1020) : null;

  const hero: HeroContent | undefined =
    banner && imageUrl
      ? {
          eyebrow: banner.eyebrow ?? "One stop business solutions",
          heading: banner.heading,
          subheading: banner.subheading ?? "",
          imageUrl,
          imageAlt: banner.image.alt ?? "",
          ctaLabel: banner.ctaLabel ?? "Explore our services",
          ctaHref: banner.ctaHref ?? "/industries",
        }
      : undefined;

  return <HomePage hero={hero} />;
}
