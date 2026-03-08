"use client";

import { ExperienceItem } from "@/lib/types";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";

interface TimelineItemProps {
  item: ExperienceItem;
  index: number;
}

export default function TimelineItem({ item, index }: TimelineItemProps) {
  return (
    <AnimateOnScroll direction="left" delay={0.15 * index}>
      <article className="rounded-xl border border-[#2A2A50] bg-[#1A1A35] p-6 backdrop-blur-sm transition-all duration-300 hover:border-blue-500/30">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <h3 className="text-xl font-bold text-white">{item.company}</h3>
          <span className="rounded-full border border-[#2A2A50] bg-[#13132A] px-3 py-1 text-xs text-[#C8C8E8]">
            {item.role}
          </span>
        </div>

        <p className="mb-4 text-sm text-[#8888AA]">
          {item.location} | {item.duration} | {item.type}
        </p>

        <div className="mb-5 flex flex-wrap gap-2">
          {item.tech.map((tech) => (
            <span
              key={tech}
              className="rounded-lg border border-[#2A2A50] bg-[#13132A] px-3 py-1 font-mono text-xs text-[#C8C8E8]"
            >
              {tech}
            </span>
          ))}
        </div>

        <ul className="space-y-2">
          {item.bullets.map((bullet, i) => (
            <AnimateOnScroll key={bullet} direction="left" delay={0.08 * i}>
              <li className="flex gap-3 text-[#C8C8E8]">
                <span className="mt-1 shrink-0 text-blue-400">&gt;</span>
                {bullet}
              </li>
            </AnimateOnScroll>
          ))}
        </ul>
      </article>
    </AnimateOnScroll>
  );
}
