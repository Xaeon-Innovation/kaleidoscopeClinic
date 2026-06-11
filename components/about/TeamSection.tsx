"use client";

import {
  GoldDivider,
  SectionLabel,
  staggerContainer,
  staggerItem,
} from "@/components/about/shared";
import type { TeamMemberDisplay } from "@/lib/content/mapTeam";
import { motion } from "framer-motion";
import Image from "next/image";

type TeamSectionProps = {
  members: TeamMemberDisplay[];
};

export function TeamSection({ members }: TeamSectionProps) {
  return (
    <section id="team" className="scroll-mt-20 bg-[var(--surface-warm)] py-20 sm:py-28">
      <div className="page-section-inner">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.75, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="mx-auto max-w-3xl text-center"
        >
          <SectionLabel>Our specialists</SectionLabel>
          <h2 className="mt-5 font-[var(--font-serif)] text-3xl tracking-tight text-[var(--brand-dark)] sm:text-4xl">
            Meet Sherif &amp; Sumaia
          </h2>
          <GoldDivider className="mx-auto mt-6" />
          <p className="mt-6 text-sm leading-relaxed text-[var(--brand-dark)]/80 sm:text-base">
            Dr Elsharkawy and Dr Rashed treat every patient as a shared case —
            combining structural precision with aesthetic intelligence. You
            don&apos;t choose one; you benefit from both.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="mx-auto mt-14 grid max-w-5xl gap-10 md:grid-cols-2"
        >
          {members.map((member) => (
            <motion.article
              key={member.id ?? member.name}
              variants={staggerItem}
              className="group overflow-hidden rounded-[var(--radius-card)] border border-[var(--brand-dark)]/10 bg-white shadow-[var(--shadow-soft)]"
            >
              <div className="team-photo relative aspect-[4/5] overflow-hidden bg-[var(--brand-dark)]/5">
                <Image
                  src={member.photo}
                  alt={member.name}
                  fill
                  className="object-cover object-top transition duration-600 ease-out group-hover:scale-[1.04]"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
              </div>
              <div className="p-6 sm:p-8">
                <span className="inline-block rounded-md bg-[var(--gold)] px-3 py-1 text-[10px] font-semibold tracking-wide text-[var(--ink-on-gold)] uppercase">
                  {member.badge}
                </span>
                <h3 className="mt-4 font-[var(--font-serif)] text-2xl tracking-tight text-[var(--brand-dark)]">
                  {member.name}
                </h3>
                <p className="mt-1 text-xs font-semibold tracking-wide text-[var(--gold)]">
                  {member.role}
                </p>
                {member.credentials.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {member.credentials.map((cred) => (
                      <span
                        key={cred}
                        className="rounded-full border border-[var(--brand-dark)]/15 px-3 py-1 text-[10px] font-medium text-[var(--brand-dark)]/70"
                      >
                        {cred}
                      </span>
                    ))}
                  </div>
                )}
                <p className="mt-4 text-sm leading-relaxed text-[var(--brand-dark)]/80">
                  {member.bio}
                </p>
                {member.specialties.length > 0 && (
                  <div className="mt-5 grid grid-cols-2 gap-2">
                    {member.specialties.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md border border-[var(--brand-dark)]/15 bg-[var(--section-cream)] px-2 py-2 text-center text-xs font-medium text-[var(--brand-dark)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.article>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-12 max-w-2xl rounded-[var(--radius-card)] border border-[var(--brand-dark)]/10 bg-white/60 p-6 text-center text-sm leading-relaxed text-[var(--brand-dark)]/75"
        >
          Every patient at Kaleidoscope benefits from both specialists&apos;
          expertise. Complex cases are discussed together — no patient is treated
          in isolation from the combined thinking of the team.
        </motion.p>
      </div>
    </section>
  );
}
