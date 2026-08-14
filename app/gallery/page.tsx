import type { Metadata } from "next";
import Breadcrumb from "@/components/ui/Breadcrumb";
import GalleryGrid, { type GalleryImage } from "@/components/gallery/GalleryGrid";
import { getGalleryImages } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";

export const metadata: Metadata = {
  title: "Gallery",
};

export const revalidate = 60;

/**
 * Shown until an editor uploads gallery images in the Studio. Without this the
 * live gallery would empty out the moment the CMS went in and stay empty until
 * the Client populated it.
 */
const FALLBACK_IMAGES: GalleryImage[] = [
  { src: "/assets/img/about/_S7A1737.jpg", alt: "Zhavilah Business Group" },
  { src: "/assets/img/about/_S7A1746.jpg", alt: "Zhavilah Business Group" },
  { src: "/assets/img/about/_S7A1748.jpg", alt: "Zhavilah Business Group" },
  { src: "/assets/img/about/_S7A1750.jpg", alt: "Zhavilah Business Group" },
  { src: "/assets/img/about/_S7A1754.jpg", alt: "Zhavilah Business Group" },
];

export default async function GalleryPage() {
  const items = await getGalleryImages();

  // Two sizes per image: a cropped tile for the grid and a larger original for
  // the lightbox, which would otherwise upscale the thumbnail to 80vh.
  const fromCms = items.flatMap<GalleryImage>((item) => {
    const src = urlFor(item.image, 800, 600);
    if (!src) return [];
    return [{ src, alt: item.alt, fullSrc: urlFor(item.image, 2000) ?? src }];
  });

  const images = fromCms.length > 0 ? fromCms : FALLBACK_IMAGES;

  return (
    <main>
      <Breadcrumb
        title="Our Gallery"
        trail={[{ label: "Gallery" }]}
        image="/assets/img/about/_S7A1754.jpg"
      />
      <section className="bg-brand-haze py-20">
        <div className="mx-auto max-w-7xl px-6">
          <GalleryGrid images={images} />
        </div>
      </section>
    </main>
  );
}
