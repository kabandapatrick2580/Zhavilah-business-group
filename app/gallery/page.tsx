import type { Metadata } from "next";
import Breadcrumb from "@/components/ui/Breadcrumb";
import GalleryGrid, { type GalleryImage } from "@/components/gallery/GalleryGrid";

export const metadata: Metadata = {
  title: "Gallery │ ZHAVILAH BUSINESS GROUP Ltd",
};

const images: GalleryImage[] = [
  { src: "/assets/img/about/_S7A1737.jpg", alt: "Zhavilah Business Group" },
  { src: "/assets/img/about/_S7A1746.jpg", alt: "Zhavilah Business Group" },
  { src: "/assets/img/about/_S7A1748.jpg", alt: "Zhavilah Business Group" },
  { src: "/assets/img/about/_S7A1750.jpg", alt: "Zhavilah Business Group" },
  { src: "/assets/img/about/_S7A1754.jpg", alt: "Zhavilah Business Group" },
];

export default function GalleryPage() {
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
