"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import GlowButton from "@/components/ui/GlowButton";
import { copy, personal } from "@/lib/data";

const ParticleField = dynamic(() => import("@/components/three/ParticleField"), { ssr: false });

const roles = [
  "Python Developer",
  "Backend Engineer",
  "Full-Stack Developer",
  "FastAPI Specialist",
  "React Developer",
];

export default function Hero() {
  const [currentRole, setCurrentRole] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const role = roles[currentRole];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(role.substring(0, displayText.length + 1));
        if (displayText.length === role.length) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        setDisplayText(role.substring(0, displayText.length - 1));
        if (displayText.length === 0) {
          setIsDeleting(false);
          setCurrentRole((prev) => (prev + 1) % roles.length);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentRole]);

  return (
    <section id="hero" className="relative flex h-screen items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <ParticleField />
      </div>

      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-transparent via-[#0D0D1A]/20 to-[#0D0D1A]/60" />

      <div className="relative z-[2] mx-auto w-full max-w-6xl px-6">
        <div className="max-w-4xl">
          <motion.p
            className="inline-flex items-center rounded-full border border-[#2A2A50] bg-[#13132A]/85 px-4 py-2 text-sm text-[#C8C8E8]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className="mr-2">&#128075;</span>
            {personal.availabilityLabel}
          </motion.p>

          <motion.h1
            className="mt-5 text-6xl font-black tracking-tight md:text-8xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-300 bg-clip-text text-transparent">
              Smit
            </span>
            <br />
            <span className="text-white">Mandavia</span>
          </motion.h1>

          <motion.div
            className="mt-4 flex min-h-9 items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <span className="text-2xl font-semibold text-blue-400 md:text-3xl">{displayText}</span>
            <span className="h-7 w-0.5 animate-pulse bg-blue-400" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1 }}
            className="mt-6 max-w-2xl text-base leading-relaxed text-[#C8C8E8]"
          >
            {personal.bio}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.1 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <GlowButton label={personal.ctaViewWork} href="#projects" variant="primary" />
            <GlowButton label={personal.ctaDownloadResume} href={copy.resumePath} variant="ghost" download />
          </motion.div>
        </div>
      </div>

      <a
        href="#about"
        className="absolute bottom-8 left-1/2 z-[2] -translate-x-1/2 rounded-full border border-[#2A2A50] bg-[#13132A]/90 p-2 text-[#C8C8E8] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          className="block"
        >
          <ChevronDown className="h-5 w-5" aria-hidden="true" />
          <span className="sr-only">Scroll down</span>
        </motion.span>
      </a>
    </section>
  );
}
