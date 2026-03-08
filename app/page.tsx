"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import Skills from "@/components/sections/Skills";
import Education from "@/components/sections/Education";
import Contact from "@/components/sections/Contact";
import GamesTeaser from "@/components/sections/GamesTeaser";
import useReducedMotion from "@/hooks/useReducedMotion";

export default function Home() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <>
      <Navbar />
      <motion.main
        id="main-content"
        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Education />
        <Contact />
        <GamesTeaser />
      </motion.main>
      <Footer />
    </>
  );
}
