import Header from "@/components/Header";
import Footer from "@/components/Footer";

const SITE_DESCRIPTION =
  "ZHAVILAH BUSINESS GROUP Ltd is a global consulting firm providing business advisory services in accounting, bookkeeping, taxation, auditing, customs clearing, warehousing, transport and logistics, and professional training in Rwanda.";

export const metadata = {
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
    title:
      "ZHAVILAH BUSINESS GROUP Ltd - One Stop Solution of Choice to Every Business",
    description:
      "Global consulting firm offering accounting, taxation, auditing, business advisory, customs clearing, warehousing, logistics and training services in Rwanda.",
    type: "website",
    url: "https://zhavilahbusinessgroup.com/",
    images: ["/assets/img/logo-2.png"],
  },
};

// Stylesheets — kept as external links (served from /public/assets) so their
// relative url() references to fonts/images resolve exactly as in the original.
const STYLESHEETS = [
  "/assets/css/bootstrap.min.css",
  "/assets/css/fontawesome.css",
  "/assets/webfonts/flat-icon/flaticon_bantec.css",
  "/assets/css/animate.css",
  "/assets/css/swiper-bundle.min.css",
  "/assets/css/slick.css",
  "/assets/css/magnific-popup.css",
  "/assets/sass/style.css",
];

// Library scripts, in the exact order the original loaded them at end of <body>.
// zbg-init.js carries the small inline behaviours (forms, dropdown, details).
const SCRIPTS = [
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

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {STYLESHEETS.map((href) => (
          <link key={href} rel="stylesheet" href={href} precedence="app" />
        ))}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css"
          precedence="app"
        />
      </head>
      <body>
        <Header />
        {children}
        <Footer />
        {SCRIPTS.map((src) => (
          <script key={src} src={src} async={false} />
        ))}
      </body>
    </html>
  );
}
