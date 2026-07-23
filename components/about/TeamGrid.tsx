"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { EASE, Stagger, StaggerItem } from "@/components/motion/primitives";

export type TeamMember = {
  name: string;
  role: string;
  image: string;
  bio: string;
};

function Card({ member }: { member: TeamMember }) {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);

  return (
    <StaggerItem
      className="flex h-fit flex-col items-center rounded-2xl border border-brand-line bg-white p-6 text-center shadow-[0_12px_32px_rgba(11,38,74,0.08)]"
      lift
    >
      <motion.div
        className="relative size-36 overflow-hidden rounded-full ring-4 ring-brand-tint"
        whileHover={reduce ? undefined : { scale: 1.04 }}
        transition={{ type: "spring", stiffness: 300, damping: 18 }}
      >
        <Image src={member.image} alt={member.name} fill sizes="144px" className="object-cover" />
      </motion.div>

      <h3 className="mt-4 font-heading text-lg font-extrabold text-brand-ink">{member.name}</h3>
      <span className="mt-1 text-sm text-brand-muted">{member.role}</span>

      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        whileTap={{ scale: 0.96 }}
        className="mt-4 rounded-full bg-brand-haze px-4 py-2 text-sm font-medium text-brand transition hover:bg-brand hover:text-white"
      >
        {open ? "Hide details" : "View details"}
      </motion.button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduce ? 0.15 : 0.4, ease: EASE }}
            className="w-full overflow-hidden"
          >
            <p className="mt-5 border-t border-brand-line pt-4 text-left text-sm leading-relaxed text-brand-muted">
              {member.bio}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </StaggerItem>
  );
}

export default function TeamGrid({ members }: { members: TeamMember[] }) {
  return (
    <Stagger className="grid items-start gap-6 md:grid-cols-2 lg:grid-cols-3">
      {members.map((m) => (
        <Card key={m.name} member={m} />
      ))}
    </Stagger>
  );
}
