"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Heart, RotateCcw, Volume2, VolumeX } from "lucide-react";
import useBreakout from "@/components/games/breakout/useBreakout";

const BRICK_EMOJI = "\u{1F9F1}";
const PARTY_EMOJI = "\u{1F389}";

export default function BreakoutGame() {
  const { canvasRef, snapshot, onMouseMove, onTouchMove, onCanvasPress, onControlPress, toggleMute, restartGame } = useBreakout();

  const isOverlayVisible = snapshot.state !== "playing";

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-[#2A2A50] bg-[#0D0D1A] px-4 py-3">
        <p className="font-mono text-sm font-semibold text-blue-400">SCORE: {snapshot.score}</p>
        <p className="text-xs text-[#8888AA]">Bricks: {snapshot.bricksRemaining}</p>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1" aria-label={`${snapshot.lives} lives`}>
            {snapshot.lives > 0 ? (
              Array.from({ length: snapshot.lives }).map((_, index) => (
                <Heart key={index} className="h-4 w-4 fill-red-500 text-red-500" aria-hidden="true" />
              ))
            ) : (
              <span className="text-sm text-[#8888AA]">0</span>
            )}
          </div>
          <button
            type="button"
            onClick={toggleMute}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#2A2A50] bg-[#1A1A35] text-[#C8C8E8] transition-colors hover:border-blue-500/60 hover:text-white"
            aria-label={snapshot.muted ? "Unmute sounds" : "Mute sounds"}
          >
            {snapshot.muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-[800px]">
        <canvas
          ref={canvasRef}
          width={800}
          height={500}
          onMouseMove={onMouseMove}
          onTouchMove={onTouchMove}
          onClick={onCanvasPress}
          onTouchStart={onCanvasPress}
          className="h-auto w-full rounded-xl border border-[#2A2A50] bg-[#0D0D1A]"
          aria-label="Breakout game area"
        />

        <AnimatePresence>
          {snapshot.levelFlash ? (
            <motion.div
              key={snapshot.levelFlash}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.06 }}
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
            >
              <span className="rounded-full border border-blue-500/40 bg-[#0D0D1A]/80 px-6 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
                {snapshot.levelFlash}
              </span>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <AnimatePresence>
          {isOverlayVisible ? (
            <motion.div
              key={snapshot.state}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-[#0D0D1A]/80 px-6 text-center"
            >
              {snapshot.state === "idle" ? (
                <div className="max-w-md space-y-3">
                  <span className="text-5xl">{BRICK_EMOJI}</span>
                  <h4 className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-3xl font-black text-transparent">BREAKOUT</h4>
                  <p className="text-sm text-[#C8C8E8]">Use mouse, touch, arrow keys, or A/D to control the paddle.</p>
                  <p className="animate-pulse text-sm font-semibold text-blue-300">
                    Press SPACE or {snapshot.isMobile ? "Touch" : "Click"} to Start
                  </p>
                </div>
              ) : null}

              {snapshot.state === "paused" ? (
                <div className="space-y-3">
                  <h4 className="text-3xl font-black text-white">PAUSED</h4>
                  <p className="text-sm text-[#C8C8E8]">Press P, SPACE, or click to resume.</p>
                </div>
              ) : null}

              {snapshot.state === "gameover" ? (
                <div className="space-y-4">
                  <h4 className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-4xl font-black text-transparent">
                    GAME OVER
                  </h4>
                  <p className="text-[#C8C8E8]">Score: {snapshot.score}</p>
                  <p className="text-sm text-[#8888AA]">Best: {snapshot.bestScore}</p>
                  <button
                    type="button"
                    onClick={onCanvasPress}
                    className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-semibold text-white transition-transform hover:scale-[1.03]"
                  >
                    Play Again
                  </button>
                </div>
              ) : null}

              {snapshot.state === "won" ? (
                <div className="space-y-4">
                  <h4 className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-4xl font-black text-transparent">
                    {PARTY_EMOJI} YOU WIN!
                  </h4>
                  <p className="text-[#C8C8E8]">Score: {snapshot.score}</p>
                  <p className="text-sm text-[#8888AA]">Best: {snapshot.bestScore}</p>
                  <button
                    type="button"
                    onClick={onCanvasPress}
                    className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-semibold text-white transition-transform hover:scale-[1.03]"
                  >
                    Play Again
                  </button>
                </div>
              ) : null}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <div className="mt-4 flex items-center justify-center gap-3 md:hidden">
        <button
          type="button"
          className="rounded-xl border border-[#2A2A50] bg-[#1A1A35] px-5 py-2 text-lg text-white"
          onPointerDown={() => onControlPress("left", true)}
          onPointerUp={() => onControlPress("left", false)}
          onPointerLeave={() => onControlPress("left", false)}
          onPointerCancel={() => onControlPress("left", false)}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          className="rounded-xl border border-[#2A2A50] bg-[#1A1A35] px-5 py-2 text-lg text-white"
          onPointerDown={() => onControlPress("right", true)}
          onPointerUp={() => onControlPress("right", false)}
          onPointerLeave={() => onControlPress("right", false)}
          onPointerCancel={() => onControlPress("right", false)}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-4 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={restartGame}
          className="inline-flex items-center gap-2 rounded-xl border border-[#2A2A50] bg-[#1A1A35] px-4 py-2 text-sm text-[#C8C8E8] transition-colors hover:border-blue-500/40 hover:text-white"
        >
          <RotateCcw className="h-4 w-4" />
          Restart (R)
        </button>
      </div>
    </div>
  );
}
