"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";

const breakoutTags = ["Canvas API", "Physics", "Web Audio"];
const tictactoeTags = ["Minimax AI", "Alpha-Beta", "SVG Animations"];
const BRICK_EMOJI = "\u{1F9F1}";
const GAMEPAD_EMOJI = "\u{1F3AE}";

export default function GamesTeaser() {
  return (
    <section
      className="relative overflow-hidden border-b border-t border-[#2A2A50] bg-[radial-gradient(ellipse_at_center,_#1A1A35_0%,_#0D0D1A_70%)] px-6 py-28"
      aria-label="Games teaser"
    >
      <div
        className="pointer-events-none absolute inset-0 [background-image:linear-gradient(#2A2A5015_1px,transparent_1px),linear-gradient(90deg,#2A2A5015_1px,transparent_1px)] [background-size:40px_40px]"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-4xl">
        <AnimateOnScroll direction="up" delay={0}>
          <span className="mb-4 block text-center text-sm font-mono uppercase tracking-widest text-blue-400">Take a break</span>
        </AnimateOnScroll>

        <AnimateOnScroll direction="up" delay={0.1}>
          <h2 className="text-center text-4xl font-black text-white md:text-5xl">
            Feeling bored?
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              I built something fun.
            </span>
          </h2>
        </AnimateOnScroll>

        <AnimateOnScroll direction="up" delay={0.2}>
          <p className="mx-auto mb-10 mt-4 max-w-xl text-center text-lg leading-relaxed text-[#8888AA]">
            Not everything has to be serious. I built two fully playable browser games - a Canvas-based Breakout game
            with physics and an unbeatable Tic Tac Toe AI powered by the Minimax algorithm. No installs. Just click
            and play.
          </p>
        </AnimateOnScroll>

        <div className="mx-auto mb-12 grid max-w-2xl grid-cols-1 items-stretch gap-6 md:grid-cols-2">
          <AnimateOnScroll direction="left" delay={0.3} className="h-full">
            <motion.div
              whileHover={{ y: -4 }}
              className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-[#2A2A50] bg-[#13132A] p-6 text-center transition-all duration-300 hover:border-blue-500/50 hover:shadow-[0_0_40px_rgba(79,142,247,0.12)]"
            >
              <div className="absolute inset-0 rounded-2xl bg-blue-600/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="relative z-10 text-5xl">
                <span className="mb-4 inline-block group-hover:animate-bounce">{BRICK_EMOJI}</span>
              </div>

              <h3 className="relative z-10 mb-2 text-xl font-bold text-white">Breakout</h3>
              <p className="relative z-10 mb-5 text-sm leading-relaxed text-[#8888AA]">
                Classic brick breaker with canvas physics, particle effects, and 3 progressive levels.
              </p>

              <div className="relative z-10 mb-5 flex flex-wrap justify-center gap-2">
                {breakoutTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md border border-[#2A2A50] bg-[#1A1A35] px-2 py-1 text-xs text-[#8888AA]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="relative z-10 mt-auto flex items-center justify-center gap-2 text-xs text-[#50507A]">
                <span>Difficulty:</span>
                <div className="flex gap-1" aria-hidden="true">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <div className="h-2 w-2 rounded-full bg-yellow-500" />
                  <div className="h-2 w-2 rounded-full bg-[#2A2A50]" />
                </div>
                <span>Medium</span>
              </div>
            </motion.div>
          </AnimateOnScroll>

          <AnimateOnScroll direction="right" delay={0.4} className="h-full">
            <motion.div
              whileHover={{ y: -4 }}
              className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-[#2A2A50] bg-[#13132A] p-6 text-center transition-all duration-300 hover:border-purple-500/50 hover:shadow-[0_0_40px_rgba(124,58,237,0.12)]"
            >
              <div className="absolute inset-0 rounded-2xl bg-purple-600/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="relative z-10 text-5xl">
                <span className="mb-4 inline-block group-hover:animate-bounce">{GAMEPAD_EMOJI}</span>
              </div>

              <h3 className="relative z-10 mb-2 text-xl font-bold text-white">Tic Tac Toe</h3>
              <p className="relative z-10 mb-5 text-sm leading-relaxed text-[#8888AA]">
                Play against an AI you literally cannot beat. Built with the Minimax algorithm and alpha-beta pruning.
              </p>

              <div className="relative z-10 mb-5 flex flex-wrap justify-center gap-2">
                {tictactoeTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md border border-[#2A2A50] bg-[#1A1A35] px-2 py-1 text-xs text-[#8888AA]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="relative z-10 mt-auto flex items-center justify-center gap-2 text-xs text-[#50507A]">
                <span>Difficulty:</span>
                <div className="flex gap-1" aria-hidden="true">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <div className="h-2 w-2 rounded-full bg-yellow-500" />
                  <div className="h-2 w-2 rounded-full bg-red-500" />
                </div>
                <span>Hard</span>
              </div>
            </motion.div>
          </AnimateOnScroll>
        </div>

        <AnimateOnScroll direction="up" delay={0.5}>
          <div className="text-center">
            <Link
              href="/games"
              className="group relative inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-10 py-4 text-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:from-blue-500 hover:to-purple-500 hover:shadow-[0_0_50px_rgba(79,142,247,0.35)] active:scale-[0.98]"
            >
              <span className="absolute inset-0 overflow-hidden rounded-2xl">
                <span className="absolute inset-0 -translate-x-[100%] skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-[100%]" />
              </span>
              <span className="relative z-10">{GAMEPAD_EMOJI}</span>
              <span className="relative z-10">Play Now</span>
              <ArrowRight className="relative z-10 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>

            <p className="mt-4 text-sm text-[#50507A]">No sign up. No install. Just play.</p>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
