import type { Metadata } from "next";
import { ChevronRight, Mail, MapPin, Phone } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import SectionHeading from "@/components/ui/SectionHeading";
import { CONTACT } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us │ ZHAVILAH BUSINESS GROUP Ltd",
};

const inputClass =
  "w-full rounded-lg border border-brand-line bg-[#f7faff] px-4 py-3.5 text-brand-ink outline-none transition focus:border-brand";

export default function ContactPage() {
  return (
    <main>
      <Breadcrumb title="Contact Us" trail={[{ label: "Contact Us" }]} />

      <section className="bg-brand-haze py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-6 lg:grid-cols-[1.4fr_1fr]">
          {/* Form */}
          <div className="rounded-3xl bg-white p-8 shadow-[0_18px_55px_rgba(11,38,74,0.07)] sm:p-12">
            <SectionHeading eyebrow="Start a Conversation" title="Get in Touch Now" />
            <p className="mt-3 text-brand-muted">
              Need personalized advice? Our dedicated team is here to assist you. Reach out today for expert
              support and tailored solutions to meet your needs.
            </p>

            <form
              action="https://formspree.io/f/xwplbgjj"
              method="POST"
              className="mt-8 space-y-4"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <input type="text" name="name" placeholder="Your Name" required className={inputClass} />
                <input type="email" name="email" placeholder="Your E-mail" required className={inputClass} />
                <input type="tel" name="phone" placeholder="Phone Number" required className={inputClass} />
                <input type="text" name="subject" placeholder="Subject" required className={inputClass} />
              </div>
              <textarea
                name="message"
                placeholder="Your Message"
                required
                className={`${inputClass} h-40 resize-none`}
              />
              <input type="hidden" name="_subject" value="New Contact Form Submission" />
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-7 py-4 text-sm font-semibold text-white transition hover:bg-brand-dark"
              >
                Submit Now <ChevronRight className="size-4" />
              </button>
            </form>
          </div>

          {/* Info cards */}
          <div className="grid gap-4">
            <InfoCard icon={<Mail className="size-6" />} title="Email Address">
              <a href={CONTACT.emailHref} className="transition hover:text-brand">
                {CONTACT.email}
              </a>
            </InfoCard>
            <InfoCard icon={<Phone className="size-6" />} title="Phone Number">
              <a href={CONTACT.phoneHref} className="transition hover:text-brand">
                {CONTACT.phone}
              </a>
            </InfoCard>
            <InfoCard icon={<MapPin className="size-6" />} title="Office Location">
              {CONTACT.address}
            </InfoCard>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="bg-brand-haze pb-24">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl px-6">
          <iframe
            title="ZHAVILAH Business Group office location"
            src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d321.6450753695493!2d30.110260168053433!3d-1.9587996999999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sikaze%20house!5e1!3m2!1sen!2srw!4v1741867250681!5m2!1sen!2srw"
            className="block h-[400px] w-full rounded-3xl border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </main>
  );
}

function InfoCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4 rounded-2xl border border-brand-line bg-white p-6">
      <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-brand-sky text-brand">
        {icon}
      </span>
      <div>
        <h3 className="font-heading text-lg font-extrabold text-brand-ink">{title}</h3>
        <div className="mt-1 text-sm text-brand-muted">{children}</div>
      </div>
    </div>
  );
}
