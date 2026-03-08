"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Fragment, useEffect, useMemo, useState } from "react";
import useScrollSpy from "@/hooks/useScrollSpy";
import { copy, navLinks, personal } from "@/lib/data";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const sectionIds = useMemo(() => navLinks.map((link) => link.id), []);
  const activeId = useScrollSpy(["hero", ...sectionIds]);
  const gamesActive = pathname === "/games";

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav
        className={cn(
          "mx-auto flex h-16 w-full max-w-6xl items-center justify-between border-b border-transparent px-6 transition-all duration-300",
          isScrolled ? "border-[#2A2A50] bg-[#0D0D1A]/85 backdrop-blur-md" : "bg-transparent"
        )}
        aria-label="Primary"
      >
        <a
          href="#hero"
          className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-2xl font-bold text-transparent"
        >
          SM
        </a>

        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => {
            const active = activeId === link.id;
            return (
              <Fragment key={link.id}>
                <a
                  href={link.href}
                  className={cn(
                    "relative py-1 text-sm text-[#C8C8E8] transition-colors hover:text-white",
                    active ? "text-[#4F8EF7]" : ""
                  )}
                >
                  {link.label}
                  <span
                    className={cn(
                      "absolute -bottom-2 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[#4F8EF7] transition-opacity duration-300",
                      active ? "opacity-100" : "opacity-0"
                    )}
                  />
                </a>
                {link.id === "projects" ? (
                  <Link
                    href="/games"
                    className={cn(
                      "relative py-1 text-sm text-[#C8C8E8] transition-colors hover:text-white",
                      gamesActive ? "text-[#4F8EF7]" : ""
                    )}
                  >
                    Games 🎮
                    <span
                      className={cn(
                        "absolute -bottom-2 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[#4F8EF7] transition-opacity duration-300",
                        gamesActive ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </Link>
                ) : null}
              </Fragment>
            );
          })}
        </div>

        <a
          href={copy.resumePath}
          download
          className="hidden rounded-full border border-[#2A2A50] bg-[#13132A] px-4 py-2 text-sm text-white transition-colors hover:border-blue-500 md:inline-flex"
        >
          {personal.ctaDownloadResume}
        </a>

        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#2A2A50] bg-[#13132A] text-white md:hidden"
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="w-full border-b border-[#2A2A50] bg-[#13132A]/95 px-6 pb-4 pt-2 backdrop-blur-md md:hidden"
          >
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Fragment key={link.id}>
                  <a
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "rounded-lg px-3 py-2 text-sm text-[#C8C8E8] transition-colors hover:bg-[#1A1A35] hover:text-white",
                      activeId === link.id ? "text-[#4F8EF7]" : ""
                    )}
                  >
                    {link.label}
                  </a>
                  {link.id === "projects" ? (
                    <Link
                      href="/games"
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "rounded-lg px-3 py-2 text-sm text-[#C8C8E8] transition-colors hover:bg-[#1A1A35] hover:text-white",
                        gamesActive ? "text-[#4F8EF7]" : ""
                      )}
                    >
                      Games 🎮
                    </Link>
                  ) : null}
                </Fragment>
              ))}
              <a
                href={copy.resumePath}
                download
                onClick={() => setIsOpen(false)}
                className="mt-1 inline-flex h-10 items-center justify-center rounded-full border border-[#2A2A50] bg-[#1A1A35] px-4 text-sm text-white"
              >
                {personal.ctaDownloadResume}
              </a>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
