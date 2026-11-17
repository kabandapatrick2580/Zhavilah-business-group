"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight, BadgeCheck, Calculator, Check, ChevronDown, CircleDollarSign,
  FileCheck2, Globe2, GraduationCap, Truck, UsersRound,
} from "lucide-react";
import { EASE, Reveal, Stagger, StaggerItem } from "@/components/motion/primitives";

// `featured` promotes a card to a full-width band across the top of the grid —
// used for a newly launched service. `image` is optional: without one the card
// falls back to its indigo panel, which is how a service reads before its
// photography has been shot.
const services: {
  title: string;
  copy: string;
  href: string;
  icon: React.ElementType;
  image?: string;
  featured?: boolean;
}[] = [
  { title: "QuickBooks Solutions", copy: "Certified QuickBooks ProAdvisors — licensing, setup, data migration, training and ongoing support for QuickBooks Online and Desktop.", href: "/quickbooks-solutions", icon: BadgeCheck, featured: true },
  { title: "Accounting Services", copy: "Bookkeeping, financial statements and day-to-day accounting set up around how your business runs.", href: "/accounting-services", icon: Calculator, image: "/assets/img/service/service-1.jpg" },
  { title: "Tax Advisory Services", copy: "Tax planning and compliance for corporate and personal income tax, VAT and payroll.", href: "/tax-advisory", icon: CircleDollarSign, image: "/assets/img/service/service-2.jpg" },
  { title: "Audit & Assurance", copy: "Independent review of your books and controls.", href: "/auditing-assurance", icon: FileCheck2, image: "/assets/img/service/service-3.jpg" },
  { title: "Customs Clearing & Forwarding", copy: "Clearing, forwarding and paperwork for goods moving across borders.", href: "/customs-clearing-forwarding", icon: Globe2, image: "/assets/img/service/service-4.jpg" },
  { title: "Transport & Logistics", copy: "Road, air and sea cargo.", href: "/transport-logistics", icon: Truck, image: "/assets/img/service/service-5.jpg" },
  { title: "Professional Training", copy: "Courses in accounting, tax and QuickBooks.", href: "/training", icon: GraduationCap, image: "/assets/img/about/4.jpeg" },
];

const faqs = [
  ["What services does Zhavilah Business Group offer?", "We provide accounting, bookkeeping, taxation, auditing, business advisory, customs clearing and forwarding, bonded warehousing, transport and logistics, and professional training services."],
  ["What tax services do you provide?", "Our tax advisory covers corporate and personal income tax, VAT, payroll taxes, RSSB contributions, withholding tax, district taxes and compliance support."],
  ["What business advisory services do you offer?", "We support company registration, annual returns, amendments, business plans, beneficial ownership registration, investment certificates and business closure processes."],
  ["What training programs does Zhavilah offer?", "Zhavilah Training Center offers practical accounting, tax preparation, QuickBooks, financial analysis and reporting through flexible classroom, online and one-on-one sessions."],
];

const testimonials = [
  ["Ingabire Belyse", "Zhavilah offered thoughtful, professional support and made our business processes much clearer."],
  ["Utuje Clemence", "The team is approachable, knowledgeable and truly focused on delivering results."],
  ["Alex", "Their practical guidance helped us make confident decisions for the next stage of our business."],
];

/**
 * The homepage hero, supplied by the CMS. Every field is optional at the call
 * site: without a `banner` document the component falls back to DEFAULT_HERO
 * below, which reproduces the original hand-written hero exactly. That keeps
 * the live site intact until an editor publishes a banner.
 */
export type HeroContent = {
  heading: string;
  subheading: string;
  imageUrl: string;
  imageAlt: string;
  ctaLabel: string;
  ctaHref: string;
};

const DEFAULT_HERO: HeroContent = {
  heading: "Build a stronger business with *trusted expertise.*",
  subheading:
    "Zhavilah Business Group Ltd is a Rwanda-registered global consulting firm providing the expert support businesses need to grow sustainably.",
  imageUrl: "/assets/img/about/_S7A1750.jpg",
  imageAlt: "Zhavilah Business Group consultants",
  ctaLabel: "Explore our services",
  ctaHref: "/industries",
};

type HeadlineToken = { text: string; highlight: boolean };

/**
 * Splits a headline into the units that animate independently.
 *
 * Plain text breaks into single words; a phrase wrapped in *asterisks* stays
 * whole so it rises as one blue block, which is how the original headline
 * treated "trusted expertise."
 */
function parseHeadline(raw: string): HeadlineToken[] {
  const tokens: HeadlineToken[] = [];

  for (const part of raw.split(/(\*[^*]+\*)/g)) {
    if (!part) continue;
    if (part.length > 2 && part.startsWith("*") && part.endsWith("*")) {
      tokens.push({ text: part.slice(1, -1), highlight: true });
    } else {
      for (const word of part.split(/\s+/)) {
        if (word) tokens.push({ text: word, highlight: false });
      }
    }
  }

  return tokens;
}

const TYPE_START_MS = 450;
const TYPE_STEP_MS = 42;
const TYPE_PAUSE_MS = 220; // extra beat after punctuation

/**
 * Types the headline out one character at a time.
 *
 * The full text is always laid out (the untyped remainder is `visibility:
 * hidden`), so nothing reflows as it types and the lines break where they will
 * finally land. Assistive tech reads the finished sentence from a screen-reader
 * copy instead of hearing it assembled letter by letter. With reduced motion the
 * headline is simply present. `onDone` lets the rest of the hero follow it in.
 */
function TypedHeadline({ heading, onDone }: { heading: string; onDone: () => void }) {
  const reduce = useReducedMotion();
  const words = parseHeadline(heading).flatMap((token) =>
    token.text.split(/\s+/).filter(Boolean).map((text) => ({ text, highlight: token.highlight })),
  );
  const total = words.reduce((n, w) => n + w.text.length + 1, 0) - 1;
  const plain = words.map((w) => w.text).join(" ");

  const [count, setCount] = useState(0);
  const [caret, setCaret] = useState(true);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    if (reduce) {
      setCount(total);
      setCaret(false);
      doneRef.current();
      return;
    }

    let n = 0;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      n += 1;
      setCount(n);
      if (n >= total) {
        doneRef.current();
        timer = setTimeout(() => setCaret(false), 2400);
        return;
      }
      const typed = plain[n - 1];
      timer = setTimeout(tick, /[.,;:!?]/.test(typed) ? TYPE_STEP_MS + TYPE_PAUSE_MS : TYPE_STEP_MS);
    };
    timer = setTimeout(tick, TYPE_START_MS);
    return () => clearTimeout(timer);
  }, [reduce, total, plain]);

  let offset = 0;
  return (
    <h1>
      <span className="sr-only">{plain}</span>
      <span aria-hidden="true">
        {words.map((word, i) => {
          const start = offset;
          offset += word.text.length + 1;
          const typed = Math.min(Math.max(count - start, 0), word.text.length);
          const here = caret && count >= start && count <= start + word.text.length;
          const Tag = word.highlight ? "em" : "span";
          return (
            <Fragment key={`${word.text}-${i}`}>
              <Tag className="inline-block">
                {word.text.slice(0, typed)}
                {here && <span className="zbg-caret" data-idle={count >= total ? "" : undefined} />}
                <span className="invisible">{word.text.slice(typed)}</span>
              </Tag>
              {i < words.length - 1 && " "}
            </Fragment>
          );
        })}
      </span>
    </h1>
  );
}

export default function HomePage({ hero = DEFAULT_HERO }: { hero?: HeroContent }) {
  const reduce = useReducedMotion();
  const [openFaq, setOpenFaq] = useState(0);
  const [typed, setTyped] = useState(false);

  // Entrance timing for the hero column, which animates on load rather than
  // on scroll because it is already in view.
  // The supporting copy follows the headline: it waits for the typing to
  // finish, then rises in once.
  const enter = (delay: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 16 },
    animate: typed ? { opacity: 1, y: 0 } : { opacity: 0, y: reduce ? 0 : 16 },
    transition: { duration: 0.6, delay, ease: EASE },
  });

  return (
    <main className="zbg-home">
      <section className="zbg-hero">
        <div className="zbg-shell zbg-hero-grid">
          <div className="zbg-hero-copy">

            <TypedHeadline heading={hero.heading} onDone={() => setTyped(true)} />

            <motion.p {...enter(0.05)}>{hero.subheading}</motion.p>

            <motion.div className="zbg-hero-actions" {...enter(0.18)}>
              <motion.div whileHover={reduce ? undefined : { y: -3 }} whileTap={{ scale: 0.97 }}>
                <Link href={hero.ctaHref} className="zbg-button">
                  {hero.ctaLabel} <ArrowRight />
                </Link>
              </motion.div>
              <a href="tel:+250788221231" className="zbg-call">
                <span>
                  <UsersRound />
                </span>
                <small>
                  Talk to our team<strong>+250 788 221 231</strong>
                </small>
              </a>
            </motion.div>
          </div>

          <motion.div
            className="zbg-hero-visual"
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: EASE }}
          >

            <Image
              src={hero.imageUrl}
              alt={hero.imageAlt}
              fill
              priority
              sizes="(max-width: 900px) 85vw, (max-width: 1099px) 590px, 60vw"
              className="object-cover"
            />
          </motion.div>
        </div>
      </section>

      <section className="zbg-intro zbg-shell">
        <Reveal>
          <h2>Accounting, tax, audit, customs and logistics under one roof.</h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p>
            One team handles your books, your tax filings and your shipments, so you deal with one firm instead of five.
          </p>
        </Reveal>
      </section>

      <section className="zbg-service-area">
        <div className="zbg-shell">
          <Stagger className="zbg-service-grid">
            {services.map(({ title, copy, href, icon: Icon, image, featured }) => (
              <StaggerItem
                as="article"
                className={`zbg-service-card${featured ? " zbg-service-card--wide" : ""}`}
                key={title}
                lift
              >
                <div className="zbg-service-icon">
                  <Icon />
                </div>
                {image && (
                  <Image
                    src={image}
                    alt=""
                    fill
                    sizes="(max-width: 580px) 100vw, (max-width: 900px) 50vw, 380px"
                    className="object-cover"
                  />
                )}
                <div>
                  {featured && <span className="zbg-new-pill">New service</span>}
                  <h3>{title}</h3>
                  <p>{copy}</p>
                  <Link href={href}>
                    Learn more <ArrowRight />
                  </Link>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
          <Reveal className="zbg-center" delay={0.1}>
            <Link href="/industries" className="zbg-outline-button">
              View all services <ArrowRight />
            </Link>
          </Reveal>
        </div>
      </section>
      <section className="zbg-about zbg-shell">
        <Reveal className="zbg-about-image" direction="right" duration={0.9}>
          <Image
            src="/assets/img/about/_S7A1754.jpg"
            alt="Zhavilah Business Group"
            width={900}
            height={500}
            sizes="(max-width: 900px) 92vw, 550px"
          />
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, rotate: -3 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, delay: 0.35, ease: EASE }}
          >
            <span>Our vision</span>
            <strong>One-stop solution of choice to every business.</strong>
          </motion.div>
        </Reveal>

        <Reveal className="zbg-about-copy" direction="left" delay={0.1}>
          <h2>About Zhavilah Business Group</h2>
          <p>
            Our mission is to empower businesses through a one-stop center for expert consulting, fostering
            innovation and positive transformation across every part of their operations.
          </p>
          <Stagger as="ul" step={0.11}>
            {[
              "Professionalism in every engagement",
              "Integrity in every decision",
              "Confidentiality you can rely on",
            ].map((item) => (
              <StaggerItem as="li" key={item} direction="left">
                <Check /> {item}
              </StaggerItem>
            ))}
          </Stagger>
          <motion.span className="inline-block" whileHover={reduce ? undefined : { y: -3 }} whileTap={{ scale: 0.97 }}>
            <Link href="/about" className="zbg-button">
              More about us <ArrowRight />
            </Link>
          </motion.span>
        </Reveal>
      </section>

      <section className="zbg-training">
        <div className="zbg-shell zbg-training-wrap">
          <Reveal direction="right">
            <h2>Learn accounting, tax and QuickBooks with us.</h2>
            <p>
              Classroom, online and one-on-one sessions in accounting, taxation, QuickBooks and financial reporting.
            </p>
            <motion.span className="inline-block" whileHover={reduce ? undefined : { y: -3 }} whileTap={{ scale: 0.97 }}>
              <Link href="/training" className="zbg-button">
                Visit the training center <ArrowRight />
              </Link>
            </motion.span>
          </Reveal>

          <Reveal className="zbg-training-image" direction="left" delay={0.1} duration={0.9}>
            <Image
              src="/assets/img/about/4.jpeg"
              alt="Training at Zhavilah"
              fill
              sizes="(max-width: 900px) 92vw, 600px"
              className="object-cover"
            />
          </Reveal>
        </div>
      </section>

      <section className="zbg-faq zbg-shell">
        <Reveal className="zbg-faq-heading" direction="right">
          <h2>Questions about our services</h2>
          <p>Not answered here? Talk to our team.</p>
          <Link href="/contact" className="zbg-text-link">
            Contact our team <ArrowRight />
          </Link>
        </Reveal>

        <Stagger className="zbg-accordion" step={0.07}>
          {faqs.map(([question, answer], index) => {
            const isOpen = openFaq === index;
            return (
              <StaggerItem key={question} className={`zbg-faq-item ${isOpen ? "is-open" : ""}`}>
                <button onClick={() => setOpenFaq(isOpen ? -1 : index)} aria-expanded={isOpen}>
                  {question}
                  <ChevronDown />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: reduce ? 0.15 : 0.35, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <p>{answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </StaggerItem>
            );
          })}
        </Stagger>
      </section>

      <section className="zbg-testimonials">
        <div className="zbg-shell">
          <Reveal className="zbg-section-center">
            <h2>What clients say</h2>
          </Reveal>

          <Stagger className="zbg-testimonial-grid">
            {testimonials.map(([name, quote]) => (
              <StaggerItem as="article" key={name} lift>
                <p>{quote}</p>
                <div className="zbg-person">
                  <strong>
                    {name}
                    <small>Zhavilah client</small>
                  </strong>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </main>
  );
}
