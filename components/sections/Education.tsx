"use client";

import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import SectionHeading from "@/components/ui/SectionHeading";
import { education } from "@/lib/data";

export default function Education() {
  return (
    <section id="education" className="border-b border-[var(--border)] bg-[var(--bg-primary)]">
      <div className="relative z-10 mx-auto max-w-6xl px-6 py-24">
        <SectionHeading label="05 - Education" title="Education" />

        <div className="grid gap-5 md:grid-cols-2">
          {education.map((item, index) => (
            <AnimateOnScroll key={`${item.school}-${item.year}`} direction={index === 0 ? "left" : "right"} delay={index === 0 ? 0 : 0.2}>
              <article className="rounded-xl border border-[#2A2A50] bg-[#1A1A35] p-6 backdrop-blur-sm transition-all duration-300 hover:border-blue-500/40">
                <div className="mb-4 h-1 w-full rounded-full bg-gradient-to-r from-blue-500 to-purple-600" />
                <h3 className="text-lg font-bold text-white">{item.degree}</h3>
                <p className="mt-1 text-sm text-[#C8C8E8]">{item.field}</p>
                <p className="mt-3 text-sm text-[#8888AA]">
                  {item.school} | {item.location} | {item.year}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.courses.map((course) => (
                    <span key={course} className="rounded-lg border border-[#2A2A50] bg-[#13132A] px-3 py-1 text-xs text-[#C8C8E8]">
                      {course}
                    </span>
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
