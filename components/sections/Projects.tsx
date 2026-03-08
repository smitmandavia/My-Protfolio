"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import ProjectCard from "@/components/ui/ProjectCard";
import SectionHeading from "@/components/ui/SectionHeading";
import { copy, projects } from "@/lib/data";
import { ProjectFilterId } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState<ProjectFilterId>("all");

  const filteredProjects = useMemo(() => {
    if (activeFilter === "all") {
      return projects;
    }

    return projects.filter((project) => project.filters.includes(activeFilter));
  }, [activeFilter]);

  const featuredProjects = filteredProjects.filter((project) => project.featured);
  const otherProjects = filteredProjects.filter((project) => !project.featured);
  const allOrdered = [...featuredProjects, ...otherProjects];

  return (
    <section id="projects" className="border-b border-[var(--border)] bg-[var(--bg-secondary)]">
      <div className="relative z-10 mx-auto max-w-6xl px-6 py-24">
        <SectionHeading label="03 - Projects" title="Projects" />

        <AnimateOnScroll direction="up" delay={0.1}>
          <div className="mb-8 flex snap-x gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {copy.projectFilters.map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() => setActiveFilter(filter.id)}
                className={cn(
                  "shrink-0 snap-start rounded-full border border-[#2A2A50] bg-[#1A1A35] px-4 py-2 text-sm text-[#C8C8E8] transition-all duration-200",
                  "hover:border-blue-500/60 hover:text-blue-300",
                  activeFilter === filter.id ? "border-blue-500/70 text-blue-300" : ""
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </AnimateOnScroll>

        <AnimatePresence mode="wait">
          <motion.div key={activeFilter} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
            {featuredProjects.length > 0 ? (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                {featuredProjects.map((project, index) => (
                  <AnimateOnScroll
                    key={project.id}
                    direction="up"
                    delay={0.1 * index}
                    className={cn(
                      index === 0 ? "md:col-span-2 xl:row-span-2 xl:col-span-2" : "md:col-span-2 xl:col-span-2",
                      index === 2 ? "xl:col-span-4" : ""
                    )}
                  >
                    <ProjectCard project={project} featured />
                  </AnimateOnScroll>
                ))}
              </div>
            ) : null}

            {otherProjects.length > 0 ? (
              <div className="grid auto-rows-fr gap-5 md:grid-cols-2 xl:grid-cols-3">
                {otherProjects.map((project, index) => (
                  <AnimateOnScroll key={project.id} direction="up" delay={0.1 * (featuredProjects.length + index)}>
                    <ProjectCard project={project} />
                  </AnimateOnScroll>
                ))}
              </div>
            ) : null}

            {allOrdered.length === 0 ? (
              <p className="rounded-xl border border-[#2A2A50] bg-[#1A1A35] p-6 text-sm text-[#C8C8E8]">No projects found for this filter.</p>
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
