"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight, BadgeCheck, Calculator, Check, ChevronDown, CircleDollarSign,
  FileCheck2, Globe2, GraduationCap, Play, Truck, UsersRound,
} from "lucide-react";
import { Counter, EASE, Reveal, Stagger, StaggerItem } from "@/components/motion/primitives";

const services = [
  { title: "Accounting Services", copy: "Reliable, tailored accounting solutions to help you navigate financial complexities and grow with confidence.", href: "/accounting-services", icon: Calculator, image: "/assets/img/service/service-1.jpg" },
  { title: "Tax Advisory Services", copy: "Expert tax planning and compliance guidance that keeps your business prepared and efficient.", href: "/tax-advisory", icon: CircleDollarSign, image: "/assets/img/service/service-2.jpg" },
  { title: "Audit & Assurance", copy: "Clear, credible insight for sound and transparent financial operations.", href: "/auditing-assurance", icon: FileCheck2, image: "/assets/img/service/service-3.jpg" },
  { title: "Customs Clearing & Forwarding", copy: "Seamless support for international shipping and customs requirements.", href: "/customs-clearing-forwarding", icon: Globe2, image: "/assets/img/service/service-4.jpg" },
  { title: "Transport & Logistics", copy: "Practical road, air and sea cargo solutions for every movement.", href: "/transport-logistics", icon: Truck, image: "/assets/img/service/service-5.jpg" },
  { title: "Professional Training", copy: "Practical training that equips teams with relevant business skills.", href: "/training", icon: GraduationCap, image: "/assets/img/about/4.jpeg" },
];

const stats: { value: number; suffix: string; label: string }[] = [
  { value: 8, suffix: "+", label: "Service categories" },
  { value: 1, suffix: "×", label: "One-stop business partner" },
  { value: 360, suffix: "°", label: "Business support approach" },
  { value: 100, suffix: "%", label: "Client-focused service" },
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

/** Headline words rise and sharpen one after another rather than as a block. */
function AnimatedHeadline() {
  const reduce = useReducedMotion();
  const words = ["Build", "a", "stronger", "business", "with"];

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: reduce ? 0 : 0.07, delayChildren: 0.15 } },
  };
  const word = {
    hidden: { opacity: 0, y: reduce ? 0 : 26, filter: reduce ? "blur(0px)" : "blur(8px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)" },
  };

  return (
    <motion.h1 variants={container} initial="hidden" animate="visible">
      {words.map((w) => (
        <motion.span key={w} variants={word} transition={{ duration: 0.7, ease: EASE }} className="inline-block">
          {w}&nbsp;
        </motion.span>
      ))}
      <motion.em variants={word} transition={{ duration: 0.7, ease: EASE }} className="inline-block">
        trusted expertise.
      </motion.em>
    </motion.h1>
  );
}

export default function HomePage() {
  const reduce = useReducedMotion();
  const [openFaq, setOpenFaq] = useState(0);

  // Entrance timing for the hero column, which animates on load rather than
  // on scroll because it is already in view.
  const enter = (delay: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 22 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease: EASE },
  });

  return (
    <main className="zbg-home">
      <section className="zbg-hero">
        <div className="zbg-shell zbg-hero-grid">
          <div className="zbg-hero-copy">
            <motion.span className="zbg-eyebrow" {...enter(0)}>
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
                style={{ transformOrigin: "left" }}
              />{" "}
              One stop business solutions
            </motion.span>

            <AnimatedHeadline />

            <motion.p {...enter(0.55)}>
              Zhavilah Business Group Ltd is a Rwanda-registered global consulting firm providing the expert
              support businesses need to grow sustainably.
            </motion.p>

            <motion.div className="zbg-hero-actions" {...enter(0.68)}>
              <motion.div whileHover={reduce ? undefined : { y: -3 }} whileTap={{ scale: 0.97 }}>
                <Link href="/industries" className="zbg-button">
                  Explore our services <ArrowRight />
                </Link>
              </motion.div>
              <a href="tel:+250788221231" className="zbg-call">
                <motion.span
                  animate={reduce ? undefined : { boxShadow: ["0 0 0 0 rgba(16,58,107,0.28)", "0 0 0 14px rgba(16,58,107,0)"] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
                >
                  <UsersRound />
                </motion.span>
                <small>
                  Talk to our team<strong>+250 788 221 231</strong>
                </small>
              </a>
            </motion.div>

            <motion.div className="zbg-hero-proof" {...enter(0.8)}>
              <div className="zbg-avatars">
                {["_S7A1746", "_S7A1748", "_S7A1750"].map((name) => (
                  <Image key={name} src={`/assets/img/about/${name}.jpg`} alt="" width={34} height={34} />
                ))}
              </div>
              <span>
                <b>Business-first</b>
                <br />
                solutions for every stage
              </span>
            </motion.div>
          </div>

          <motion.div
            className="zbg-hero-visual"
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: EASE }}
          >
            {/* Radar rings — a slow, continuous pulse that keeps the navy
                panel alive without pulling attention from the copy. */}
            {[0, 0.8].map((delay, i) => (
              <motion.div
                key={delay}
                className={`zbg-orbit ${i === 0 ? "zbg-orbit-one" : "zbg-orbit-two"}`}
                animate={reduce ? undefined : { scale: [1, 1.07, 1], opacity: [0.45, 0.9, 0.45] }}
                transition={{ duration: 5.5, delay, repeat: Infinity, ease: "easeInOut" }}
              />
            ))}

            <Image
              src="/assets/img/about/_S7A1750.jpg"
              alt="Zhavilah Business Group consultants"
              fill
              priority
              sizes="(max-width: 900px) 85vw, 590px"
              className="object-cover"
            />

            <motion.div
              className="zbg-float-card zbg-float-top"
              initial={reduce ? { opacity: 0 } : { opacity: 0, x: -30, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.9, ease: EASE }}
            >
              <motion.div
                animate={reduce ? undefined : { y: [0, -7, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                className="flex items-center gap-[11px]"
              >
                <BadgeCheck />
                <span>
                  <b>Professional</b> expertise
                </span>
              </motion.div>
            </motion.div>

            <motion.div
              className="zbg-float-card zbg-float-bottom"
              initial={reduce ? { opacity: 0 } : { opacity: 0, x: 30, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.7, delay: 1.05, ease: EASE }}
            >
              <motion.div
                animate={reduce ? undefined : { y: [0, 8, 0] }}
                transition={{ duration: 5.2, delay: 0.6, repeat: Infinity, ease: "easeInOut" }}
                className="flex items-center gap-[11px]"
              >
                <strong>8+</strong>
                <span>
                  service
                  <br />
                  categories
                </span>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="zbg-intro zbg-shell">
        <Reveal>
          <span className="zbg-eyebrow">
            <span /> What we do
          </span>
          <h2>Everything your business needs to move forward.</h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p>
            From day-to-day financial clarity to cross-border movement, our specialists turn complex obligations
            into practical progress.
          </p>
        </Reveal>
      </section>

      <section className="zbg-service-area">
        <div className="zbg-shell">
          <Stagger className="zbg-service-grid">
            {services.map(({ title, copy, href, icon: Icon, image }) => (
              <StaggerItem as="article" className="zbg-service-card" key={title} lift>
                <div className="zbg-service-icon">
                  <Icon />
                </div>
                <Image
                  src={image}
                  alt=""
                  fill
                  sizes="(max-width: 580px) 100vw, (max-width: 900px) 50vw, 380px"
                  className="object-cover"
                />
                <div>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                  <Link href={href}>
                    Discover service <ArrowRight />
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

      <section className="zbg-stats">
        <Stagger className="zbg-shell zbg-stats-grid" step={0.1}>
          {stats.map((stat) => (
            <StaggerItem key={stat.label}>
              <strong>
                <Counter value={stat.value} suffix={stat.suffix} suffixClassName="zbg-stat-suffix" />
              </strong>
              <p>{stat.label}</p>
            </StaggerItem>
          ))}
        </Stagger>
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
          <span className="zbg-eyebrow">
            <span /> About Zhavilah
          </span>
          <h2>Business guidance that feels clear, capable and close at hand.</h2>
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
            <span className="zbg-eyebrow">
              <span /> Learn with us
            </span>
            <h2>Practical skills for confident decisions.</h2>
            <p>
              Visit our training center for hands-on, business-focused learning in accounting, taxation, software
              and financial reporting.
            </p>
            <motion.span className="inline-block" whileHover={reduce ? undefined : { y: -3 }} whileTap={{ scale: 0.97 }}>
              <Link href="/training" className="zbg-button">
                Visit training center <ArrowRight />
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
            <motion.button
              aria-label="Learn about Zhavilah training"
              whileHover={reduce ? undefined : { scale: 1.1 }}
              whileTap={{ scale: 0.94 }}
              animate={
                reduce
                  ? undefined
                  : { boxShadow: ["0 0 0 0 rgba(124,192,245,0.6)", "0 0 0 22px rgba(124,192,245,0)"] }
              }
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            >
              <Play />
            </motion.button>
          </Reveal>
        </div>
      </section>

      <section className="zbg-faq zbg-shell">
        <Reveal className="zbg-faq-heading" direction="right">
          <span className="zbg-eyebrow">
            <span /> Need to know
          </span>
          <h2>Common questions about our services.</h2>
          <p>Find a quick answer or speak with a member of our team about your specific requirements.</p>
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
                  <span>0{index + 1}</span>
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
          <Reveal className="zbg-section-center" blur>
            <span className="zbg-eyebrow">
              <span /> Inspiring journeys
            </span>
            <h2>Trusted by businesses who want to go further.</h2>
          </Reveal>

          <Stagger className="zbg-testimonial-grid">
            {testimonials.map(([name, quote], i) => (
              <StaggerItem as="article" key={name} lift>
                <div className="zbg-quote">“</div>
                <p>{quote}</p>
                <div className="zbg-person">
                  <Image
                    src={["/assets/img/about/_S7A1746.jpg", "/assets/img/about/_S7A1748.jpg", "/assets/img/about/_S7A1737.jpg"][i]}
                    alt=""
                    width={40}
                    height={40}
                  />
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
