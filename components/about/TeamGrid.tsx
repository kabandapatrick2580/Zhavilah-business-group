"use client";

import { useState } from "react";

export type TeamMember = {
  name: string;
  role: string;
  image: string;
  bio: string;
};

function Card({ member }: { member: TeamMember }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col items-center rounded-2xl border border-brand-line bg-white p-6 text-center shadow-[0_12px_32px_rgba(8,63,52,0.08)] transition hover:-translate-y-1">
      <div className="size-36 overflow-hidden rounded-full">
        <img src={member.image} alt={member.name} className="size-full object-cover" />
      </div>
      <h3 className="mt-4 font-heading text-lg font-semibold text-brand-ink">{member.name}</h3>
      <span className="mt-1 text-sm text-brand-muted">{member.role}</span>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="mt-4 rounded-full bg-brand-haze px-4 py-2 text-sm font-medium text-brand transition hover:bg-brand hover:text-white"
      >
        {open ? "Hide details" : "View details"}
      </button>
      {open && (
        <p className="mt-5 border-t border-brand-line pt-4 text-left text-sm leading-relaxed text-brand-muted">
          {member.bio}
        </p>
      )}
    </div>
  );
}

export default function TeamGrid({ members }: { members: TeamMember[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {members.map((m) => (
        <Card key={m.name} member={m} />
      ))}
    </div>
  );
}
