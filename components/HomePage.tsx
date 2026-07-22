"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight, BadgeCheck, BarChart3, BookOpen, BriefcaseBusiness, Calculator,
  Check, ChevronDown, CircleDollarSign, FileCheck2, Globe2, GraduationCap,
  Handshake, Play, ShieldCheck, Truck, UsersRound,
} from "lucide-react";

const services = [
  { title: "Accounting Services", copy: "Reliable, tailored accounting solutions to help you navigate financial complexities and grow with confidence.", href: "/accounting-services", icon: Calculator, image: "/assets/img/service/service-1.jpg" },
  { title: "Tax Advisory Services", copy: "Expert tax planning and compliance guidance that keeps your business prepared and efficient.", href: "/tax-advisory", icon: CircleDollarSign, image: "/assets/img/service/service-2.jpg" },
  { title: "Audit & Assurance", copy: "Clear, credible insight for sound and transparent financial operations.", href: "/auditing-assurance", icon: FileCheck2, image: "/assets/img/service/service-3.jpg" },
  { title: "Customs Clearing & Forwarding", copy: "Seamless support for international shipping and customs requirements.", href: "/customs-clearing-forwarding", icon: Globe2, image: "/assets/img/service/service-4.jpg" },
  { title: "Transport & Logistics", copy: "Practical road, air and sea cargo solutions for every movement.", href: "/transport-logistics", icon: Truck, image: "/assets/img/service/service-5.jpg" },
  { title: "Professional Training", copy: "Practical training that equips teams with relevant business skills.", href: "/training", icon: GraduationCap, image: "/assets/img/about/4.jpeg" },
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

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState(0);
  return (
    <main className="zbg-home">
      <section className="zbg-hero">
        <div className="zbg-shell zbg-hero-grid">
          <div className="zbg-hero-copy">
            <span className="zbg-eyebrow"><span /> One stop business solutions</span>
            <h1>Build a stronger business with <em>trusted expertise.</em></h1>
            <p>Zhavilah Business Group Ltd is a Rwanda-registered global consulting firm providing the expert support businesses need to grow sustainably.</p>
            <div className="zbg-hero-actions">
              <Link href="/industries" className="zbg-button">Explore our services <ArrowRight /></Link>
              <a href="tel:+250788221231" className="zbg-call"><span><UsersRound /></span><small>Talk to our team<strong>+250 788 221 231</strong></small></a>
            </div>
            <div className="zbg-hero-proof"><div className="zbg-avatars"><img src="/assets/img/about/_S7A1746.jpg" alt="" /><img src="/assets/img/about/_S7A1748.jpg" alt="" /><img src="/assets/img/about/_S7A1750.jpg" alt="" /></div><span><b>Business-first</b><br />solutions for every stage</span></div>
          </div>
          <div className="zbg-hero-visual">
            <div className="zbg-orbit zbg-orbit-one" /><div className="zbg-orbit zbg-orbit-two" />
            <img src="/assets/img/about/_S7A1750.jpg" alt="Zhavilah Business Group consultants" />
            <div className="zbg-float-card zbg-float-top"><BadgeCheck /><span><b>Professional</b> expertise</span></div>
            <div className="zbg-float-card zbg-float-bottom"><strong>8+</strong><span>service<br />categories</span></div>
          </div>
        </div>
      </section>

      <section className="zbg-intro zbg-shell">
        <div><span className="zbg-eyebrow"><span /> What we do</span><h2>Everything your business needs to move forward.</h2></div>
        <p>From day-to-day financial clarity to cross-border movement, our specialists turn complex obligations into practical progress.</p>
      </section>

      <section className="zbg-service-area"><div className="zbg-shell">
        <div className="zbg-service-grid">{services.map(({ title, copy, href, icon: Icon, image }) => <article className="zbg-service-card" key={title}>
          <div className="zbg-service-icon"><Icon /></div><img src={image} alt="" /><div><h3>{title}</h3><p>{copy}</p><Link href={href}>Discover service <ArrowRight /></Link></div>
        </article>)}</div>
        <div className="zbg-center"><Link href="/industries" className="zbg-outline-button">View all services <ArrowRight /></Link></div>
      </div></section>

      <section className="zbg-stats"><div className="zbg-shell zbg-stats-grid">
        <div><strong>8<span>+</span></strong><p>Service categories</p></div><div><strong>1<span>×</span></strong><p>One-stop business partner</p></div><div><strong>360<span>°</span></strong><p>Business support approach</p></div><div><strong>100<span>%</span></strong><p>Client-focused service</p></div>
      </div></section>

      <section className="zbg-about zbg-shell">
        <div className="zbg-about-image"><img src="/assets/img/about/_S7A1754.jpg" alt="Zhavilah Business Group" /><div><span>Our vision</span><strong>One-stop solution of choice to every business.</strong></div></div>
        <div className="zbg-about-copy"><span className="zbg-eyebrow"><span /> About Zhavilah</span><h2>Business guidance that feels clear, capable and close at hand.</h2><p>Our mission is to empower businesses through a one-stop center for expert consulting, fostering innovation and positive transformation across every part of their operations.</p>
          <ul><li><Check /> Professionalism in every engagement</li><li><Check /> Integrity in every decision</li><li><Check /> Confidentiality you can rely on</li></ul><Link href="/about" className="zbg-button">More about us <ArrowRight /></Link>
        </div>
      </section>

      <section className="zbg-training"><div className="zbg-shell zbg-training-wrap"><div><span className="zbg-eyebrow"><span /> Learn with us</span><h2>Practical skills for confident decisions.</h2><p>Visit our training center for hands-on, business-focused learning in accounting, taxation, software and financial reporting.</p><Link href="/training" className="zbg-button">Visit training center <ArrowRight /></Link></div><div className="zbg-training-image"><img src="/assets/img/about/4.jpeg" alt="Training at Zhavilah" /><button aria-label="Learn about Zhavilah training"><Play /></button></div></div></section>

      <section className="zbg-faq zbg-shell"><div className="zbg-faq-heading"><span className="zbg-eyebrow"><span /> Need to know</span><h2>Common questions about our services.</h2><p>Find a quick answer or speak with a member of our team about your specific requirements.</p><Link href="/contact" className="zbg-text-link">Contact our team <ArrowRight /></Link></div><div className="zbg-accordion">{faqs.map(([question, answer], index) => <div className={`zbg-faq-item ${openFaq === index ? "is-open" : ""}`} key={question}><button onClick={() => setOpenFaq(openFaq === index ? -1 : index)}><span>0{index + 1}</span>{question}<ChevronDown /></button>{openFaq === index && <p>{answer}</p>}</div>)}</div></section>

      <section className="zbg-testimonials"><div className="zbg-shell"><div className="zbg-section-center"><span className="zbg-eyebrow"><span /> Inspiring journeys</span><h2>Trusted by businesses who want to go further.</h2></div><div className="zbg-testimonial-grid">{testimonials.map(([name, quote], i) => <article key={name}><div className="zbg-quote">“</div><p>{quote}</p><div className="zbg-person"><img src={["/assets/img/about/_S7A1746.jpg", "/assets/img/about/_S7A1748.jpg", "/assets/img/about/_S7A1737.jpg"][i]} alt="" /><strong>{name}<small>Zhavilah client</small></strong></div></article>)}</div></div></section>
    </main>
  );
}
