"use client";

import { ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { ProjectItem } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: ProjectItem;
  featured?: boolean;
}

const categoryStyle: Record<string, string> = {
  "Backend + Full-Stack": "bg-blue-500/15 text-blue-300 border-blue-500/40",
  "Real-Time Systems": "bg-cyan-500/15 text-cyan-300 border-cyan-500/40",
  "Full-Stack": "bg-violet-500/15 text-violet-300 border-violet-500/40",
  "Desktop Application": "bg-emerald-500/15 text-emerald-300 border-emerald-500/40",
  Automation: "bg-amber-500/15 text-amber-300 border-amber-500/40",
};

export default function ProjectCard({
  project,
  featured = false,
}: ProjectCardProps) {
  return (
    <motion.article
      layout
      className={cn(
        "group relative flex h-full cursor-pointer flex-col rounded-2xl border border-[#2A2A50] bg-[#1A1A35] p-6 backdrop-blur-sm transition-all duration-300",
        "hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(79,142,247,0.15)]"
      )}
    >
      <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
        <span
          className={cn(
            "rounded-full border px-3 py-1 text-xs",
            categoryStyle[project.category] ?? "border-[#2A2A50] text-[#C8C8E8]"
          )}
        >
          {project.category}
        </span>
      </div>

      <h3 className="mb-3 text-xl font-bold text-white">{project.title}</h3>
      <p className="mb-5 text-sm leading-relaxed text-[#C8C8E8]">
        {featured ? project.longDescription : project.description}
      </p>

      <div className="mb-5 flex flex-wrap gap-2">
        {project.tech.map((tech) => (
          <span
            key={tech}
            className="rounded-lg border border-[#2A2A50] bg-[#13132A] px-3 py-1 font-mono text-xs text-[#C8C8E8]"
          >
            {tech}
          </span>
        ))}
      </div>

      <div className="mt-auto flex items-center gap-3 pt-5">
        {project.live ? (
          <a
            href={project.live}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#2A2A50] text-[#C8C8E8] transition-colors hover:border-blue-500 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">Live demo</span>
          </a>
        ) : (
          <span
            className="inline-flex h-9 w-9 cursor-not-allowed items-center justify-center rounded-full border border-[#2A2A50] text-[#8888AA]"
            title="Live link unavailable"
          >
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </span>
        )}
      </div>
    </motion.article>
  );
}
