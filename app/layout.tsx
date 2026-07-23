import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import ScrollProgress from "@/components/motion/ScrollProgress";
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

// Paints the mobile browser chrome in brand navy.
export const viewport: Viewport = {
  themeColor: "#103a6b",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <head>
        {/* Framer Motion serialises its `initial` state into the server HTML,
            which would leave the page invisible if scripts never run. Without
            JavaScript, reset exactly those inline styles so all content stays
            readable. */}
        <noscript>
          <style>{`[style*="opacity:0"]{opacity:1!important;filter:none!important;transform:none!important}[style*="clip-path"]{clip-path:none!important}`}</style>
        </noscript>
      </head>
      <body className="font-body text-body antialiased">
        <ScrollProgress />
        <Header />
        {children}
        <Footer />
        <CookieConsent />
      </body>
    </html>
  );
}
