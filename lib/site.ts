// Central, typed source of truth for navigation, services and contact details.
// Replaces the values that were previously hard-coded across the HTML partials.

export type NavLink = {
  label: string;
  href: string;
};

export type NavItem = NavLink & {
  children?: NavLink[];
};

export const SERVICES: NavLink[] = [
  { label: "Accounting Service", href: "/accounting-services" },
  { label: "Tax Advisory Service", href: "/tax-advisory" },
  { label: "Business Advisory", href: "/business-advisory" },
  { label: "Sales of QuickBooks Online & Desktop", href: "/quickbooks-solutions" },
  { label: "Training Service", href: "/training" },
  { label: "Transport & Logistics", href: "/transport-logistics" },
  { label: "Warehousing Service", href: "/warehousing-services" },
  { label: "Customs Clearing & Forwarding", href: "/customs-clearing-forwarding" },
];

export const NAV: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Services", href: "#", children: SERVICES },
  { label: "Gallery", href: "/gallery" },
  { label: "Industries", href: "/industries" },
  { label: "Blog", href: "/blog" },
  { label: "Contact Us", href: "/contact" },
];

export const QUICK_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Industries", href: "/industries" },
  { label: "Blog", href: "/blog" },
  { label: "Contact Us", href: "/contact" },
];

// International format, digits only — the form wa.me and the WhatsApp apps expect.
const WHATSAPP_NUMBER = "250788221231";

// Pre-filled into the chat box so the visitor doesn't face an empty thread, and
// so the team can tell a website lead from a personal message at a glance.
export const WHATSAPP_MESSAGE = "Hello ZHAVILAH, I'd like to enquire about your services.";

export const CONTACT = {
  phone: "+250 788 221 231",
  phoneHref: "tel:+250788221231",
  email: "info@zhavilahbusinessgroup.com",
  emailHref: "mailto:info@zhavilahbusinessgroup.com",
  address:
    "Ikaze House, 3rd Floor, Room N° F3-22 Remera-Gisimenti KG 11 Av",
  mapHref: "https://www.google.com/maps",
  // wa.me, not web.whatsapp.com/send: the latter forces WhatsApp Web and fails
  // on mobile, where most of this traffic is. wa.me hands off to the installed
  // app and falls back to the web client on desktop.
  whatsappHref: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`,
} as const;

export type Social = {
  label: string;
  href: string;
  icon: "facebook" | "x" | "instagram" | "tiktok" | "linkedin";
};

export const SOCIALS: Social[] = [
  { label: "Facebook", href: "https://web.facebook.com/zhavilahbusinessgroup", icon: "facebook" },
  { label: "X (Twitter)", href: "https://x.com/Zhavilahltd", icon: "x" },
  { label: "Instagram", href: "https://www.instagram.com/zhavilahbusinessgroup/", icon: "instagram" },
  { label: "TikTok", href: "https://www.tiktok.com/@zhavilahbusinessgroup", icon: "tiktok" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/zhavilah-business-group-1627b4364/", icon: "linkedin" },
];
