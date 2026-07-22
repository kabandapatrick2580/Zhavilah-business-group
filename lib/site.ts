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
  { label: "Accounting Services", href: "/accounting-services" },
  { label: "Auditing & Assurance", href: "/auditing-assurance" },
  { label: "Tax Advisory", href: "/tax-advisory" },
  { label: "Business Advisory", href: "/business-advisory" },
  { label: "Customs Clearing & Forwarding", href: "/customs-clearing-forwarding" },
  { label: "Warehousing Services", href: "/warehousing-services" },
  { label: "Transport & Logistics", href: "/transport-logistics" },
  { label: "Training Services", href: "/training" },
];

export const NAV: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Services", href: "#", children: SERVICES },
  { label: "Gallery", href: "/gallery" },
  { label: "Industries", href: "/industries" },
  { label: "Contact Us", href: "/contact" },
];

export const QUICK_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Industries", href: "/industries" },
  { label: "Contact Us", href: "/contact" },
];

export const CONTACT = {
  phone: "+250 788 221 231",
  phoneHref: "tel:+250788221231",
  email: "info@zhavilahbusinessgroup.com",
  emailHref: "mailto:info@zhavilahbusinessgroup.com",
  address:
    "Ikaze House, 3rd Floor, Room N° F3-22 Remera-Gisimenti KG 11 Av",
  mapHref: "https://www.google.com/maps",
  whatsappHref: "https://web.whatsapp.com/send?phone=250788221231",
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
