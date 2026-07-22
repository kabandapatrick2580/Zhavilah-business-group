import Link from "next/link";
import { ChevronsRight, Mail, MapPin, Phone } from "lucide-react";
import { CONTACT, QUICK_LINKS, SERVICES, SOCIALS } from "@/lib/site";
import { SocialIcon } from "@/components/icons";

export default function Footer() {
  return (
    <footer>
      {/* Subscribe band */}
      <div className="bg-primary">
        <div className="mx-auto max-w-3xl px-6 py-16 text-center">
          <h2 className="font-heading text-3xl font-semibold text-white sm:text-4xl">
            Stay Connected! Subscribe For <span className="text-sky">The Latest Updates</span>
          </h2>
          <form
            action="https://formspree.io/f/xwplbggj"
            method="POST"
            className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row"
          >
            <input type="hidden" name="_subject" value="New Subscription Request" />
            <input
              type="email"
              name="email"
              required
              placeholder="Enter Your Email"
              className="w-full rounded-md border border-white/20 bg-white px-4 py-3 text-body outline-none focus:border-accent"
            />
            <button
              type="submit"
              className="shrink-0 rounded-md bg-accent px-6 py-3 font-semibold text-white transition hover:bg-white hover:text-primary"
            >
              Subscribe now
            </button>
          </form>
        </div>
      </div>

      {/* Main footer */}
      <div className="bg-mint text-primary">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <img src="/assets/img/logo-2.png" alt="ZHAVILAH BUSINESS GROUP" className="h-11 w-auto" />
            <p className="mt-5 font-semibold leading-relaxed">
              One Stop Solution of Choice to Every Business
            </p>
            <div className="mt-5 flex gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="flex size-9 items-center justify-center rounded-full bg-white text-primary transition hover:bg-primary hover:text-white"
                >
                  <SocialIcon name={s.icon} className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <FooterColumn title="Our Services" links={SERVICES} />
          <FooterColumn title="Quick Link" links={QUICK_LINKS} />

          <div>
            <h5 className="mb-5 font-heading text-lg font-semibold">Contact</h5>
            <ul className="space-y-4 text-sm">
              <ContactItem icon={<Phone className="size-5" />} label="Phone" value={CONTACT.phone} href={CONTACT.phoneHref} />
              <ContactItem icon={<Mail className="size-5" />} label="Email" value={CONTACT.email} href={CONTACT.emailHref} />
              <ContactItem icon={<MapPin className="size-5" />} label="Address" value={CONTACT.address} href={CONTACT.mapHref} />
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-primary">
        <div className="mx-auto max-w-7xl px-6 py-5 text-sm text-white">
          <p>
            © Copyright 2025 - All Rights Reserved by Zhavilah Business Group Ltd. Developed By{" "}
            <a href="https://www.valtok.rw/" target="_blank" rel="noreferrer" className="underline">
              Valtok
            </a>
          </p>
        </div>
      </div>

      {/* Floating contact buttons */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        <a
          href={CONTACT.whatsappHref}
          target="_blank"
          rel="noreferrer"
          aria-label="WhatsApp Us"
          className="flex size-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-float transition hover:scale-105"
        >
          <i className="ri-whatsapp-line text-2xl" />
        </a>
        <a
          href={CONTACT.phoneHref}
          aria-label="Call Us"
          className="flex size-12 items-center justify-center rounded-full bg-primary text-white shadow-float transition hover:scale-105"
        >
          <Phone className="size-5" />
        </a>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h5 className="mb-5 font-heading text-lg font-semibold">{title}</h5>
      <ul className="space-y-3 text-sm">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="flex items-center gap-2 transition hover:opacity-70">
              <ChevronsRight className="size-4 shrink-0" />
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ContactItem({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
}) {
  return (
    <li className="flex gap-3">
      <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-white">
        {icon}
      </span>
      <span className="flex flex-col">
        <span className="font-semibold">{label}</span>
        <a href={href} className="transition hover:opacity-70">
          {value}
        </a>
      </span>
    </li>
  );
}
