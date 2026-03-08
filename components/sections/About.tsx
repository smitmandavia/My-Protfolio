"use client";

import Image from "next/image";
import { Atom, Code2, Cpu, Database, FileCode2, Rocket } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ComponentType } from "react";
import { useInView } from "framer-motion";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import SectionHeading from "@/components/ui/SectionHeading";
import { aboutStats, topSkills, personal } from "@/lib/data";

const skillIcons: Record<string, ComponentType<{ className?: string }>> = {
  Python: Code2,
  FastAPI: Cpu,
  React: Atom,
  TypeScript: FileCode2,
  Go: Rocket,
  PostgreSQL: Database,
};

interface CountUpProps {
  to: number;
  start: boolean;
  suffix: string;
}

function CountUp({ to, start, suffix }: CountUpProps) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) {
      return;
    }

    let frame = 0;
    const duration = 900;
    const startTime = performance.now();

    const tick = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - progress) * (1 - progress);
      setValue(Math.round(eased * to));

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
    };
  }, [start, to]);

  return (
    <span className="text-3xl font-black text-blue-400">
      {value}
      {suffix}
    </span>
  );
}

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const [profileSrc, setProfileSrc] = useState("/IMG_4812.jpg");
  const skillsWithIcons = useMemo(() => topSkills.map((skill) => ({ skill, Icon: skillIcons[skill] })), []);

  return (
    <section id="about" ref={sectionRef} className="border-b border-[var(--border)] bg-[var(--bg-secondary)]">
      <div className="relative z-10 mx-auto max-w-6xl px-6 py-24">
        <SectionHeading label="01 - About" title="About Me" />

        <div className="grid gap-10 lg:grid-cols-[300px_1fr] lg:items-center">
          <AnimateOnScroll direction="left">
            <div className="mx-auto">
              <div className="relative h-[280px] w-[280px]">
                <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_30deg,#4F8EF7,#7C3AED,#4F8EF7)] p-[3px]">
                  <div className="h-full w-full rounded-full bg-transparent" />
                </div>
                <div className="absolute inset-[6px] overflow-hidden rounded-full border border-[#2A2A50] shadow-[0_0_40px_var(--accent-glow)]">
                  <Image
                    src={profileSrc}
                    alt={personal.profileAlt}
                    width={280}
                    height={280}
                    priority
                    onError={() => setProfileSrc("/profile.jpg")}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll direction="right" delay={0.2}>
            <div className="space-y-6">
              <h3 className="text-4xl font-bold text-white">{personal.aboutHeading}</h3>
              {personal.aboutParagraphs.map((paragraph) => (
                <p key={paragraph} className="text-base leading-relaxed text-[#C8C8E8]">
                  {paragraph}
                </p>
              ))}

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {aboutStats.map((stat, index) => (
                  <AnimateOnScroll key={stat.label} direction="up" delay={0.1 * index}>
                    <div className="rounded-xl border border-[#2A2A50] bg-[#1A1A35] p-5 text-center backdrop-blur-sm transition-all duration-300 hover:border-blue-500/40">
                      <div className="text-3xl font-black text-blue-400">
                        <CountUp to={stat.value} start={isInView} suffix={stat.suffix} />
                      </div>
                      <div className="mt-1 text-sm text-[#8888AA]">{stat.label}</div>
                    </div>
                  </AnimateOnScroll>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                {skillsWithIcons.map(({ skill, Icon }, index) => (
                  <AnimateOnScroll key={skill} direction="scale" delay={0.03 * index}>
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#2A2A50] bg-[#1A1A35] px-3 py-1.5 text-sm text-[#C8C8E8]">
                      {Icon ? <Icon className="h-3.5 w-3.5 text-blue-400" aria-hidden="true" /> : null}
                      {skill}
                    </span>
                  </AnimateOnScroll>
                ))}
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
