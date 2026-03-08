"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import GameCard from "@/components/games/GameCard";
import BreakoutGame from "@/components/games/breakout/BreakoutGame";
import TicTacToeGame from "@/components/games/tictactoe/TicTacToeGame";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { cn } from "@/lib/utils";

const BRICK_EMOJI = "\u{1F9F1}";
const GAMEPAD_EMOJI = "\u{1F3AE}";
const tabs = [`${BRICK_EMOJI} Breakout`, `${GAMEPAD_EMOJI} Tic Tac Toe`] as const;

export default function GamesLayout() {
  const [activeGame, setActiveGame] = useState(0);

  return (
    <main id="main-content" className="min-h-screen bg-[#0D0D1A] px-6 py-12">
      <div className="mx-auto w-full max-w-6xl">
        <Link
          href="/"
          className="group mb-12 inline-flex items-center gap-2 text-[#8888AA] transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Portfolio
        </Link>

        <AnimateOnScroll direction="up">
          <div className="mb-12 text-center">
            <span className="mb-3 block text-sm font-mono uppercase tracking-widest text-blue-400">Just for fun</span>
            <h1 className="mb-4 text-5xl font-black text-white md:text-6xl">
              Mini <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Games</span>
            </h1>
            <p className="mx-auto max-w-xl text-lg text-[#8888AA]">Built with React, Canvas API &amp; Minimax Algorithm</p>
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll direction="up" delay={0.1}>
          <div className="mb-10 flex flex-wrap justify-center gap-3">
            {tabs.map((tab, index) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveGame(index)}
                className={cn(
                  "rounded-xl px-6 py-3 font-semibold transition-all duration-300",
                  activeGame === index
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/20"
                    : "border border-[#2A2A50] bg-[#1A1A35] text-[#8888AA] hover:border-blue-500/40 hover:text-white"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </AnimateOnScroll>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeGame}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeGame === 0 ? (
              <GameCard
                emoji={BRICK_EMOJI}
                title="Breakout"
                subtitle="Break all bricks to win - 3 levels"
                tags={["Canvas API", "requestAnimationFrame", "Web Audio API", "TypeScript"]}
              >
                <BreakoutGame />
              </GameCard>
            ) : (
              <GameCard
                emoji={GAMEPAD_EMOJI}
                title="Tic Tac Toe"
                subtitle="Play against an unbeatable AI"
                tags={["Minimax Algorithm", "Alpha-Beta Pruning", "SVG Animations", "React Hooks"]}
              >
                <TicTacToeGame />
              </GameCard>
            )}
          </motion.div>
        </AnimatePresence>

        <p className="mt-12 text-center text-sm text-[#50507A]">More games coming soon...</p>
      </div>
    </main>
  );
}
