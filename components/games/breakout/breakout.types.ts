import type { MouseEvent, RefObject, TouchEvent } from "react";

export type BreakoutState = "idle" | "playing" | "paused" | "gameover" | "won";

export interface Paddle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Ball {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
}

export interface Brick {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  row: number;
  color: string;
  hitsLeft: number;
  maxHits: number;
  points: number;
  fadeFrames: number;
  removed: boolean;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  life: number;
  maxLife: number;
  color: string;
}

export interface BreakoutSnapshot {
  score: number;
  lives: number;
  level: number;
  state: BreakoutState;
  bricksRemaining: number;
  bestScore: number;
  muted: boolean;
  isMobile: boolean;
  levelFlash: string | null;
}

export interface BreakoutControls {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  snapshot: BreakoutSnapshot;
  onMouseMove: (event: MouseEvent<HTMLCanvasElement>) => void;
  onTouchMove: (event: TouchEvent<HTMLCanvasElement>) => void;
  onCanvasPress: () => void;
  onControlPress: (direction: "left" | "right", active: boolean) => void;
  toggleMute: () => void;
  restartGame: () => void;
}
