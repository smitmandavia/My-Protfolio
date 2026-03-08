"use client";

import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import SectionHeading from "@/components/ui/SectionHeading";
import SkillBadge from "@/components/ui/SkillBadge";
import { skills } from "@/lib/data";

export default function Skills() {
  return (
    <section id="skills" className="border-b border-[var(--border)] bg-[var(--bg-primary)]">
      <div className="relative z-10 mx-auto max-w-6xl px-6 py-24">
        <SectionHeading label="04 - Skills" title="Technical Skills" />

        <div className="space-y-5">
          {Object.entries(skills).map(([category, values], categoryIndex) => (
            <AnimateOnScroll key={category} direction="up" delay={0.1 * categoryIndex}>
              <article className="grid gap-3 rounded-xl border border-[#2A2A50] bg-[#1A1A35] p-6 backdrop-blur-sm lg:grid-cols-[180px_1fr] lg:items-start">
                <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#8888AA]">{category}</h3>
                <div className="flex flex-wrap gap-2">
                  {values.map((skill, skillIndex) => (
                    <AnimateOnScroll key={skill} direction="scale" delay={0.03 * skillIndex}>
                      <SkillBadge label={skill} />
                    </AnimateOnScroll>
                  ))}
                </div>
              </article>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
