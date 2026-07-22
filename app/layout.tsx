import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", display: "swap" });

const SITE_DESCRIPTION =
  "ZHAVILAH BUSINESS GROUP Ltd is a global consulting firm providing business advisory services in accounting, bookkeeping, taxation, auditing, customs clearing, warehousing, transport and logistics, and professional training in Rwanda.";

export const metadata: Metadata = {
  metadataBase: new URL("https://zhavilahbusinessgroup.com"),
  title: {
    default: "ZHAVILAH BUSINESS GROUP Ltd - One Stop Business Solution",
    template: "%s",
  },
  description: SITE_DESCRIPTION,
  keywords:
    "business consulting, accounting services, tax advisory, rwanda business, bookkeeping, auditing, customs clearing, forwarding, bonded warehousing, transport, logistics, business training, business registration",
  authors: [{ name: "ZHAVILAH BUSINESS GROUP Ltd" }],
  icons: {
    icon: "/assets/img/favicon-1.png",
    apple: "/assets/img/favicon-1.png",
  },
  alternates: { canonical: "https://zhavilahbusinessgroup.com/" },
  openGraph: {
    title: "ZHAVILAH BUSINESS GROUP Ltd - One Stop Solution of Choice to Every Business",
    description:
      "Global consulting firm offering accounting, taxation, auditing, business advisory, customs clearing, warehousing, logistics and training services in Rwanda.",
    type: "website",
    url: "https://zhavilahbusinessgroup.com/",
    images: ["/assets/img/logo-2.png"],
  },
};

// NOTE: the legacy Cosion/Bootstrap stylesheets are imported via app/globals.css
// (into a low-priority `legacy` cascade layer) rather than linked here, so that
// Tailwind utilities reliably override them. See globals.css for the rationale.

// Legacy jQuery libraries, in original load order. Retired as their features
// are replaced by React equivalents on migrated pages.
const LEGACY_SCRIPTS = [
  "/assets/js/jquery-3.7.1.min.js",
  "/assets/js/bootstrap.min.js",
  "/assets/js/jquery.counterup.min.js",
  "/assets/js/popper.min.js",
  "/assets/js/progressbar.min.js",
  "/assets/js/jquery.magnific-popup.min.js",
  "/assets/js/swiper-bundle.min.js",
  "/assets/js/slick.min.js",
  "/assets/js/isotope.pkgd.min.js",
  "/assets/js/jquery.fancybox.min.js",
  "/assets/js/jquery.waypoints.min.js",
  "/assets/js/main.js",
  "/assets/js/zbg-init.js",
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <head>
        {/* remixicon supplies the .ri-* icons used by legacy pages + the footer
            WhatsApp button. Its classes don't collide with Tailwind, so a plain
            link is fine. */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css"
          precedence="app"
        />
      </head>
      <body className="font-body text-body antialiased">
        <Header />
        {children}
        <Footer />
        {LEGACY_SCRIPTS.map((src) => (
          <script key={src} src={src} async={false} />
        ))}
      </body>
    </html>
  );
}
