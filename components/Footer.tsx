import Link from "next/link";
import { ChevronsRight, Mail, MapPin, Phone } from "lucide-react";
import { CONTACT, QUICK_LINKS, SERVICES, SOCIALS } from "@/lib/site";
import { SocialIcon } from "@/components/icons";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="zbg-site-footer">
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
            © Copyright {currentYear} - All Rights Reserved by Zhavilah Business Group Ltd. Developed By{" "}
            <a href="https://www.techandus.com/" target="_blank" rel="noreferrer" className="underline">
              Tech & Us
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
          <svg viewBox="0 0 24 24" fill="currentColor" className="size-6" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
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
