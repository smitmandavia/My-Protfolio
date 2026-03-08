"use client";

import SectionHeading from "@/components/ui/SectionHeading";
import TimelineItem from "@/components/ui/TimelineItem";
import { experience } from "@/lib/data";

export default function Experience() {
  return (
    <section id="experience" className="border-b border-[var(--border)] bg-[var(--bg-primary)]">
      <div className="relative z-10 mx-auto max-w-6xl px-6 py-24">
        <SectionHeading label="02 - Experience" title="Experience" />

        <div className="relative border-l-2 border-blue-500/30 pl-8">
          {experience.map((item, index) => (
            <div key={item.id} className="relative mb-6 last:mb-0">
              <span className="absolute -left-[37px] top-7 h-3 w-3 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(79,142,247,0.8)]" />
              <TimelineItem item={item} index={index} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
