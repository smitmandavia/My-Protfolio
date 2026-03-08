"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo } from "react";
import useTicTacToe from "@/components/games/tictactoe/useTicTacToe";
import type { Difficulty } from "@/components/games/tictactoe/tictactoe.types";
import { cn } from "@/lib/utils";

const difficulties: Difficulty[] = ["easy", "medium", "hard"];

function XMark() {
  return (
    <motion.svg viewBox="0 0 100 100" className="h-14 w-14 drop-shadow-[0_0_8px_#4F8EF7]" aria-hidden="true">
      <motion.line
        x1="24"
        y1="24"
        x2="76"
        y2="76"
        stroke="#4F8EF7"
        strokeWidth="5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      />
      <motion.line
        x1="76"
        y1="24"
        x2="24"
        y2="76"
        stroke="#4F8EF7"
        strokeWidth="5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.2, delay: 0.05, ease: "easeOut" }}
      />
    </motion.svg>
  );
}

function OMark() {
  return (
    <motion.svg viewBox="0 0 100 100" className="h-14 w-14 drop-shadow-[0_0_8px_#7C3AED]" aria-hidden="true">
      <motion.circle
        cx="50"
        cy="50"
        r="28"
        fill="none"
        stroke="#7C3AED"
        strokeWidth="5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      />
    </motion.svg>
  );
}

function getCenter(index: number): { x: number; y: number } {
  const row = Math.floor(index / 3);
  const col = index % 3;
  return { x: 50 + col * 100, y: 50 + row * 100 };
}

export default function TicTacToeGame() {
  const { state, actions } = useTicTacToe();

  const status = useMemo(() => {
    if (!state.mode) {
      return { text: "Choose a mode to start", className: "text-[#C8C8E8]" };
    }

    if (state.result === "X") {
      return {
        text: state.mode === "vs-ai" ? "You Win!" : "Player X Wins!",
        className: "bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent",
      };
    }

    if (state.result === "O") {
      return {
        text: state.mode === "vs-ai" ? "AI Wins!" : "Player O Wins!",
        className: "text-red-400",
      };
    }

    if (state.result === "draw") {
      return {
        text: "It's a Draw!",
        className: "text-yellow-300",
      };
    }

    if (state.mode === "vs-ai") {
      if (state.isThinking || state.currentPlayer === "O") {
        return { text: "AI is thinking", className: "text-purple-300" };
      }
      return { text: "Your turn (X)", className: "text-blue-300" };
    }

    return {
      text: state.currentPlayer === "X" ? "Player X's turn" : "Player O's turn",
      className: state.currentPlayer === "X" ? "text-blue-300" : "text-purple-300",
    };
  }, [state.currentPlayer, state.isThinking, state.mode, state.result]);

  const winningSet = useMemo(() => new Set(state.winningLine ?? []), [state.winningLine]);

  const winningCoords = useMemo(() => {
    if (!state.winningLine) {
      return null;
    }
    const [startIndex, , endIndex] = state.winningLine;
    return {
      start: getCenter(startIndex),
      end: getCenter(endIndex),
    };
  }, [state.winningLine]);

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!state.mode ? (
          <motion.div
            key="mode-selector"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid gap-4 md:grid-cols-2"
          >
            <article className="rounded-2xl border border-[#2A2A50] bg-[#1A1A35] p-5">
              <h4 className="text-lg font-bold text-white">vs AI</h4>
              <p className="mt-2 text-sm text-[#8888AA]">Choose difficulty to start instantly.</p>
              <div className="mt-4 grid gap-2">
                {difficulties.map((difficulty) => (
                  <button
                    key={difficulty}
                    type="button"
                    onClick={() => {
                      actions.setDifficulty(difficulty);
                      actions.selectMode("vs-ai", difficulty);
                    }}
                    className={cn(
                      "rounded-xl border px-4 py-2 text-sm font-semibold capitalize transition-all",
                      state.difficulty === difficulty
                        ? "border-blue-500/60 bg-gradient-to-r from-blue-600/25 to-purple-600/25 text-white"
                        : "border-[#2A2A50] bg-[#13132A] text-[#C8C8E8] hover:border-blue-500/40"
                    )}
                  >
                    {difficulty}
                  </button>
                ))}
              </div>
            </article>

            <article className="rounded-2xl border border-[#2A2A50] bg-[#1A1A35] p-5">
              <h4 className="text-lg font-bold text-white">vs Friend</h4>
              <p className="mt-2 text-sm text-[#8888AA]">Same device local multiplayer.</p>
              <button
                type="button"
                onClick={() => actions.selectMode("vs-friend")}
                className="mt-4 w-full rounded-xl border border-[#2A2A50] bg-[#13132A] px-4 py-2 text-sm font-semibold text-[#C8C8E8] transition-all hover:border-purple-500/40 hover:text-white"
              >
                Start 2 Player Game
              </button>
            </article>
          </motion.div>
        ) : (
          <motion.div
            key="game-board"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 220, damping: 18 }}
            className="flex flex-col items-center"
          >
            <motion.div
              key={`${status.text}-${state.currentPlayer}-${state.result ?? "active"}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn("mb-4 text-base font-semibold", status.className)}
            >
              {status.text}
              {state.mode === "vs-ai" && (state.isThinking || state.currentPlayer === "O") && !state.result ? (
                <span className="ml-1 inline-flex" aria-hidden="true">
                  {[0, 1, 2].map((index) => (
                    <motion.span
                      key={index}
                      className="mx-[1px]"
                      animate={{ opacity: [0.2, 1, 0.2] }}
                      transition={{ duration: 0.9, repeat: Infinity, delay: index * 0.15 }}
                    >
                      .
                    </motion.span>
                  ))}
                </span>
              ) : null}
            </motion.div>

            <div className="relative">
              <div className={cn("relative aspect-square w-[min(340px,90vw)] rounded-2xl bg-[#0D0D1A]", state.result ? "opacity-60" : "")}> 
                <div className="grid h-full w-full grid-cols-3 grid-rows-3">
                  {state.board.map((cell, index) => {
                    const isWinningCell = winningSet.has(index);
                    return (
                      <motion.button
                        key={index}
                        type="button"
                        onClick={() => actions.placeMark(index)}
                        disabled={Boolean(cell) || Boolean(state.result) || state.isThinking}
                        className={cn(
                          "relative flex items-center justify-center transition-colors",
                          !cell && !state.result ? "cursor-pointer hover:bg-[#1A1A35]" : "cursor-default",
                          isWinningCell ? "bg-[#1A1A35]/70" : ""
                        )}
                        whileTap={!cell && !state.result ? { scale: 0.92 } : undefined}
                        animate={isWinningCell ? { scale: [1, 1.05, 1] } : { scale: 1 }}
                        transition={isWinningCell ? { duration: 1, repeat: Infinity } : { type: "spring", stiffness: 300, damping: 20 }}
                      >
                        <AnimatePresence>
                          {cell ? (
                            <motion.span
                              key={`${index}-${cell}`}
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ type: "spring", stiffness: 260, damping: 18 }}
                            >
                              {cell === "X" ? <XMark /> : <OMark />}
                            </motion.span>
                          ) : null}
                        </AnimatePresence>
                      </motion.button>
                    );
                  })}
                </div>

                <svg viewBox="0 0 300 300" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
                  <motion.path
                    d="M100 12 V288"
                    stroke="#2A2A50"
                    strokeWidth="4"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.4 }}
                  />
                  <motion.path
                    d="M200 12 V288"
                    stroke="#2A2A50"
                    strokeWidth="4"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.4, delay: 0.05 }}
                  />
                  <motion.path
                    d="M12 100 H288"
                    stroke="#2A2A50"
                    strokeWidth="4"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                  />
                  <motion.path
                    d="M12 200 H288"
                    stroke="#2A2A50"
                    strokeWidth="4"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.4, delay: 0.15 }}
                  />

                  {winningCoords ? (
                    <motion.line
                      x1={winningCoords.start.x}
                      y1={winningCoords.start.y}
                      x2={winningCoords.end.x}
                      y2={winningCoords.end.y}
                      stroke="url(#winGradient)"
                      strokeWidth="6"
                      strokeLinecap="round"
                      opacity="0.85"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    />
                  ) : null}

                  <defs>
                    <linearGradient id="winGradient" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#4F8EF7" />
                      <stop offset="100%" stopColor="#7C3AED" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <AnimatePresence>
                {state.result ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center rounded-2xl bg-[#0D0D1A]/70 p-4"
                  >
                    <div className="w-full max-w-[260px] rounded-xl border border-[#2A2A50] bg-[#13132A] p-4 text-center">
                      <h5 className="text-xl font-bold text-white">{status.text}</h5>
                      <div className="mt-4 flex gap-2">
                        <button
                          type="button"
                          onClick={actions.playAgain}
                          className="flex-1 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-3 py-2 text-sm font-semibold text-white"
                        >
                          Play Again
                        </button>
                        <button
                          type="button"
                          onClick={actions.newGame}
                          className="flex-1 rounded-lg border border-[#2A2A50] bg-[#1A1A35] px-3 py-2 text-sm text-[#C8C8E8]"
                        >
                          New Game
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>

            <div className="mt-5 grid w-full max-w-[520px] grid-cols-3 gap-3">
              <div className="rounded-xl border border-[#2A2A50] bg-[#1A1A35] p-3 text-center">
                <p className="text-xs uppercase tracking-wide text-blue-300">X Wins</p>
                <motion.p key={`x-${state.scores.xWins}`} initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-xl font-bold text-white">
                  {state.scores.xWins}
                </motion.p>
              </div>
              <div className="rounded-xl border border-[#2A2A50] bg-[#1A1A35] p-3 text-center">
                <p className="text-xs uppercase tracking-wide text-slate-300">Draws</p>
                <motion.p key={`d-${state.scores.draws}`} initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-xl font-bold text-white">
                  {state.scores.draws}
                </motion.p>
              </div>
              <div className="rounded-xl border border-[#2A2A50] bg-[#1A1A35] p-3 text-center">
                <p className="text-xs uppercase tracking-wide text-purple-300">O Wins</p>
                <motion.p key={`o-${state.scores.oWins}`} initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-xl font-bold text-white">
                  {state.scores.oWins}
                </motion.p>
              </div>
            </div>

            <div className="mt-4 flex w-full max-w-[520px] flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={actions.newGame}
                className="rounded-xl border border-[#2A2A50] bg-[#1A1A35] px-4 py-2 text-sm font-medium text-[#C8C8E8] transition-colors hover:text-white"
              >
                New Game
              </button>
              <button
                type="button"
                onClick={actions.resetScore}
                className="rounded-xl border border-[#2A2A50] bg-[#1A1A35] px-4 py-2 text-sm font-medium text-[#C8C8E8] transition-colors hover:text-white"
              >
                Reset Score
              </button>
              <button
                type="button"
                onClick={actions.switchMode}
                className="rounded-xl border border-[#2A2A50] bg-[#1A1A35] px-4 py-2 text-sm font-medium text-[#C8C8E8] transition-colors hover:text-white"
              >
                Switch Mode
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
