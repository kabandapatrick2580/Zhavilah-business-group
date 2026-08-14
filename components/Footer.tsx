import Image from "next/image";
import Link from "next/link";
import { ChevronsRight, Mail, MapPin, Phone } from "lucide-react";
import { CONTACT, QUICK_LINKS, SERVICES, SOCIALS } from "@/lib/site";
import { SocialIcon } from "@/components/icons";
import SubscribeForm from "@/components/SubscribeForm";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/primitives";
import { toQrSvg } from "@/lib/qr";

export default async function Footer() {
  const currentYear = new Date().getFullYear();
  // Generated during the build, not in the browser: the QR encodes a constant
  // URL, so there is nothing for the client to compute and no reason to ship a
  // QR library to it.
  const whatsappQr = await toQrSvg(CONTACT.whatsappHref);

  return (
    <footer className="zbg-site-footer">
      {/* Subscribe band */}
      <div className="bg-primary">
        <Reveal className="mx-auto max-w-3xl px-6 py-16 text-center" blur>
          <h2 className="font-heading text-3xl font-extrabold text-white sm:text-4xl">
            Stay Connected! Subscribe For <span className="text-sky">The Latest Updates</span>
          </h2>
          <SubscribeForm />
        </Reveal>
      </div>

      {/* Main footer */}
      <div className="bg-mint text-primary">
        <Stagger className="mx-auto grid max-w-7xl gap-10 px-6 py-16 sm:grid-cols-2 lg:grid-cols-4">
          <StaggerItem>
            <Image
              src="/assets/img/logo-2.png"
              alt="ZHAVILAH BUSINESS GROUP"
              width={500}
              height={186}
              className="h-11 w-auto"
            />
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
          </StaggerItem>

          <FooterColumn title="Our Services" links={SERVICES} />
          <FooterColumn title="Quick Link" links={QUICK_LINKS} />

          <StaggerItem>
            <h5 className="mb-5 font-heading text-lg font-extrabold">Contact</h5>
            <ul className="space-y-4 text-sm">
              <ContactItem icon={<Phone className="size-5" />} label="Phone" value={CONTACT.phone} href={CONTACT.phoneHref} />
              <ContactItem icon={<Mail className="size-5" />} label="Email" value={CONTACT.email} href={CONTACT.emailHref} />
              <ContactItem icon={<MapPin className="size-5" />} label="Address" value={CONTACT.address} href={CONTACT.mapHref} />
            </ul>
          </StaggerItem>
        </Stagger>
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
        <WhatsAppWidget href={CONTACT.whatsappHref} qrSvg={whatsappQr} />
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
    <StaggerItem>
      <h5 className="mb-5 font-heading text-lg font-extrabold">{title}</h5>
      <ul className="space-y-3 text-sm">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="group flex items-center gap-2 transition hover:translate-x-1 hover:opacity-70"
            >
              <ChevronsRight className="size-4 shrink-0 transition group-hover:translate-x-0.5" />
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </StaggerItem>
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
