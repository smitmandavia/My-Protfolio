"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type MouseEvent as ReactMouseEvent, type TouchEvent as ReactTouchEvent } from "react";
import type {
  Ball,
  BreakoutControls,
  BreakoutSnapshot,
  BreakoutState,
  Brick,
  Paddle,
  Particle,
} from "@/components/games/breakout/breakout.types";

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 500;
const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 12;
const PADDLE_OFFSET = 30;
const BALL_RADIUS = 8;
const INITIAL_VELOCITY = { x: 4, y: -4 };
const BASE_LIVES = 3;
const BRICK_COLUMNS = 8;
const BRICK_ROWS = 5;
const BRICK_WIDTH = 80;
const BRICK_HEIGHT = 25;
const BRICK_GAP = 8;
const BRICK_TOP_OFFSET = 60;
const MAX_LEVEL = 3;
const MAX_SPEED = 8;
const FRAME_TIME = 1000 / 60;

const BRICK_CONFIG = [
  { color: "#EF4444", hits: 3, points: 30 },
  { color: "#F97316", hits: 2, points: 20 },
  { color: "#EAB308", hits: 2, points: 15 },
  { color: "#22C55E", hits: 1, points: 10 },
  { color: "#4F8EF7", hits: 1, points: 5 },
] as const;

const BEST_SCORE_KEY = "breakout_best";

interface KeyState {
  left: boolean;
  right: boolean;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function hexToRgba(hex: string, alpha: number): string {
  const value = hex.replace("#", "");
  const normalized = value.length === 3 ? value.split("").map((v) => v + v).join("") : value;
  const numeric = Number.parseInt(normalized, 16);
  const r = (numeric >> 16) & 255;
  const g = (numeric >> 8) & 255;
  const b = numeric & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function darkenedColor(color: string): string {
  return hexToRgba(color, 0.58);
}

function createBricks(): Brick[] {
  const totalWidth = BRICK_COLUMNS * BRICK_WIDTH + (BRICK_COLUMNS - 1) * BRICK_GAP;
  const xOffset = (CANVAS_WIDTH - totalWidth) / 2;
  const bricks: Brick[] = [];

  for (let row = 0; row < BRICK_ROWS; row += 1) {
    for (let col = 0; col < BRICK_COLUMNS; col += 1) {
      const config = BRICK_CONFIG[row];
      bricks.push({
        id: `${row}-${col}`,
        x: xOffset + col * (BRICK_WIDTH + BRICK_GAP),
        y: BRICK_TOP_OFFSET + row * (BRICK_HEIGHT + BRICK_GAP),
        width: BRICK_WIDTH,
        height: BRICK_HEIGHT,
        row,
        color: config.color,
        hitsLeft: config.hits,
        maxHits: config.hits,
        points: config.points,
        fadeFrames: 0,
        removed: false,
      });
    }
  }

  return bricks;
}

function createPaddle(): Paddle {
  return {
    x: (CANVAS_WIDTH - PADDLE_WIDTH) / 2,
    y: CANVAS_HEIGHT - PADDLE_OFFSET - PADDLE_HEIGHT,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
  };
}

function createBall(levelSpeedBoost: number): Ball {
  const speed = clamp(Math.hypot(INITIAL_VELOCITY.x, INITIAL_VELOCITY.y) + levelSpeedBoost, 4, MAX_SPEED);
  const ratio = speed / Math.hypot(INITIAL_VELOCITY.x, INITIAL_VELOCITY.y);

  return {
    x: CANVAS_WIDTH / 2,
    y: CANVAS_HEIGHT - PADDLE_OFFSET - PADDLE_HEIGHT - BALL_RADIUS - 6,
    radius: BALL_RADIUS,
    vx: INITIAL_VELOCITY.x * ratio,
    vy: INITIAL_VELOCITY.y * ratio,
  };
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
): void {
  const safeRadius = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + safeRadius, y);
  ctx.lineTo(x + width - safeRadius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + safeRadius);
  ctx.lineTo(x + width, y + height - safeRadius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - safeRadius, y + height);
  ctx.lineTo(x + safeRadius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - safeRadius);
  ctx.lineTo(x, y + safeRadius);
  ctx.quadraticCurveTo(x, y, x + safeRadius, y);
  ctx.closePath();
}

function circleIntersectsRect(ball: Ball, brick: Brick): boolean {
  const closestX = clamp(ball.x, brick.x, brick.x + brick.width);
  const closestY = clamp(ball.y, brick.y, brick.y + brick.height);
  const dx = ball.x - closestX;
  const dy = ball.y - closestY;
  return dx * dx + dy * dy <= ball.radius * ball.radius;
}

function getAliveBrickCount(bricks: Brick[]): number {
  return bricks.filter((brick) => !brick.removed && brick.fadeFrames === 0).length;
}

function getRowAliveCount(bricks: Brick[], row: number): number {
  return bricks.filter((brick) => brick.row === row && !brick.removed && brick.fadeFrames === 0).length;
}

function updateBestScore(value: number): number {
  if (typeof window === "undefined") {
    return value;
  }

  const previous = Number.parseInt(window.localStorage.getItem(BEST_SCORE_KEY) ?? "0", 10);
  const safePrevious = Number.isFinite(previous) ? previous : 0;
  const nextBest = Math.max(safePrevious, value);
  window.localStorage.setItem(BEST_SCORE_KEY, String(nextBest));
  return nextBest;
}

function getStoredBestScore(): number {
  if (typeof window === "undefined") {
    return 0;
  }
  const stored = Number.parseInt(window.localStorage.getItem(BEST_SCORE_KEY) ?? "0", 10);
  return Number.isFinite(stored) ? stored : 0;
}

function getIsMobileViewport(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  return window.matchMedia("(max-width: 768px)").matches;
}

export default function useBreakout(): BreakoutControls {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const rafRef = useRef<number>(0);
  const lastFrameRef = useRef<number>(0);
  const flashTimeoutRef = useRef<number | null>(null);

  const paddleRef = useRef<Paddle>(createPaddle());
  const ballRef = useRef<Ball>(createBall(0));
  const bricksRef = useRef<Brick[]>(createBricks());
  const particlesRef = useRef<Particle[]>([]);

  const scoreRef = useRef<number>(0);
  const livesRef = useRef<number>(BASE_LIVES);
  const levelRef = useRef<number>(1);
  const bestScoreRef = useRef<number>(getStoredBestScore());
  const stateRef = useRef<BreakoutState>("idle");
  const speedMagnitudeRef = useRef<number>(Math.hypot(INITIAL_VELOCITY.x, INITIAL_VELOCITY.y));
  const levelBoostRef = useRef<number>(0);
  const rowClearedRef = useRef<boolean[]>(new Array(BRICK_ROWS).fill(false));
  const mutedRef = useRef<boolean>(false);
  const keysRef = useRef<KeyState>({ left: false, right: false });

  const [snapshot, setSnapshot] = useState<BreakoutSnapshot>({
    score: 0,
    lives: BASE_LIVES,
    level: 1,
    state: "idle",
    bricksRemaining: BRICK_COLUMNS * BRICK_ROWS,
    bestScore: getStoredBestScore(),
    muted: false,
    isMobile: getIsMobileViewport(),
    levelFlash: null,
  });

  const setSnapshotPartial = useCallback((partial: Partial<BreakoutSnapshot>) => {
    setSnapshot((previous) => ({ ...previous, ...partial }));
  }, []);

  const playSound = useCallback((type: "paddle" | "brick" | "wall" | "lose") => {
    if (mutedRef.current || typeof window === "undefined") {
      return;
    }

    const AudioCtx = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) {
      return;
    }

    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === "paddle") {
      osc.frequency.value = 220;
    } else if (type === "brick") {
      osc.frequency.value = 440;
    } else if (type === "wall") {
      osc.frequency.value = 160;
    } else {
      osc.frequency.value = 80;
    }

    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.1);

    window.setTimeout(() => {
      void ctx.close();
    }, 140);
  }, []);

  const resetBall = useCallback(() => {
    const nextBall = createBall(levelBoostRef.current);
    ballRef.current = nextBall;
    speedMagnitudeRef.current = Math.hypot(nextBall.vx, nextBall.vy);
  }, []);

  const resetRound = useCallback((state: BreakoutState) => {
    paddleRef.current = createPaddle();
    resetBall();
    bricksRef.current = createBricks();
    particlesRef.current = [];
    rowClearedRef.current = new Array(BRICK_ROWS).fill(false);

    stateRef.current = state;
    setSnapshotPartial({
      state,
      bricksRemaining: BRICK_COLUMNS * BRICK_ROWS,
      level: levelRef.current,
    });
  }, [resetBall, setSnapshotPartial]);

  const restartGame = useCallback(() => {
    scoreRef.current = 0;
    livesRef.current = BASE_LIVES;
    levelRef.current = 1;
    levelBoostRef.current = 0;
    speedMagnitudeRef.current = Math.hypot(INITIAL_VELOCITY.x, INITIAL_VELOCITY.y);

    setSnapshotPartial({
      score: 0,
      lives: BASE_LIVES,
      level: 1,
      state: "idle",
      levelFlash: null,
    });
    resetRound("idle");
  }, [resetRound, setSnapshotPartial]);

  const beginPlay = useCallback(() => {
    if (stateRef.current === "playing") {
      return;
    }

    stateRef.current = "playing";
    setSnapshotPartial({ state: "playing" });
  }, [setSnapshotPartial]);

  const pauseToggle = useCallback(() => {
    if (stateRef.current === "playing") {
      stateRef.current = "paused";
      setSnapshotPartial({ state: "paused" });
      return;
    }

    if (stateRef.current === "paused") {
      stateRef.current = "playing";
      setSnapshotPartial({ state: "playing" });
    }
  }, [setSnapshotPartial]);

  const setPaddleFromClientX = useCallback((clientX: number, target: EventTarget & HTMLCanvasElement) => {
    const rect = target.getBoundingClientRect();
    const ratio = CANVAS_WIDTH / rect.width;
    const x = (clientX - rect.left) * ratio;
    paddleRef.current.x = clamp(x - paddleRef.current.width / 2, 0, CANVAS_WIDTH - paddleRef.current.width);
  }, []);

  const onMouseMove = useCallback(
    (event: ReactMouseEvent<HTMLCanvasElement>) => {
      setPaddleFromClientX(event.clientX, event.currentTarget);
    },
    [setPaddleFromClientX]
  );

  const onTouchMove = useCallback(
    (event: ReactTouchEvent<HTMLCanvasElement>) => {
      const touch = event.touches[0];
      if (!touch) {
        return;
      }
      setPaddleFromClientX(touch.clientX, event.currentTarget);
      event.preventDefault();
    },
    [setPaddleFromClientX]
  );

  const onCanvasPress = useCallback(() => {
    if (stateRef.current === "idle") {
      beginPlay();
      return;
    }

    if (stateRef.current === "paused") {
      beginPlay();
      return;
    }

    if (stateRef.current === "gameover" || stateRef.current === "won") {
      restartGame();
      beginPlay();
    }
  }, [beginPlay, restartGame]);

  const onControlPress = useCallback((direction: "left" | "right", active: boolean) => {
    keysRef.current[direction] = active;
  }, []);

  const toggleMute = useCallback(() => {
    mutedRef.current = !mutedRef.current;
    setSnapshotPartial({ muted: mutedRef.current });
  }, [setSnapshotPartial]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
        keysRef.current.left = true;
      }

      if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
        keysRef.current.right = true;
      }

      if (event.code === "Space") {
        event.preventDefault();

        if (stateRef.current === "idle") {
          beginPlay();
          return;
        }

        if (stateRef.current === "playing" || stateRef.current === "paused") {
          pauseToggle();
          return;
        }

        if (stateRef.current === "gameover" || stateRef.current === "won") {
          restartGame();
          beginPlay();
        }
      }

      if (event.key.toLowerCase() === "p") {
        pauseToggle();
      }

      if (event.key.toLowerCase() === "r") {
        restartGame();
      }
    },
    [beginPlay, pauseToggle, restartGame]
  );

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
      keysRef.current.left = false;
    }

    if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
      keysRef.current.right = false;
    }
  }, []);

  const flashLevel = useCallback(
    (message: string) => {
      if (flashTimeoutRef.current) {
        window.clearTimeout(flashTimeoutRef.current);
      }
      setSnapshotPartial({ levelFlash: message });
      flashTimeoutRef.current = window.setTimeout(() => {
        setSnapshotPartial({ levelFlash: null });
      }, 1200);
    },
    [setSnapshotPartial]
  );

  const normalizeBallSpeed = useCallback((speed: number) => {
    const ball = ballRef.current;
    const currentSpeed = Math.hypot(ball.vx, ball.vy) || 1;
    const targetSpeed = clamp(speed, 4, MAX_SPEED);
    const ratio = targetSpeed / currentSpeed;
    ball.vx *= ratio;
    ball.vy *= ratio;
    speedMagnitudeRef.current = targetSpeed;
  }, []);

  const spawnBrickParticles = useCallback((brick: Brick) => {
    const centerX = brick.x + brick.width / 2;
    const centerY = brick.y + brick.height / 2;
    const nextParticles: Particle[] = [];

    for (let index = 0; index < 8; index += 1) {
      nextParticles.push({
        x: centerX,
        y: centerY,
        vx: Math.random() * 6 - 3,
        vy: -1 - Math.random() * 3,
        radius: 3,
        life: 30,
        maxLife: 30,
        color: brick.color,
      });
    }

    particlesRef.current.push(...nextParticles);
  }, []);

  const endRoundWithBest = useCallback((nextState: BreakoutState) => {
    const best = updateBestScore(scoreRef.current);
    bestScoreRef.current = best;
    stateRef.current = nextState;

    setSnapshotPartial({
      state: nextState,
      bestScore: best,
      score: scoreRef.current,
      lives: livesRef.current,
      level: levelRef.current,
    });
  }, [setSnapshotPartial]);

  const startNextLevel = useCallback(() => {
    if (levelRef.current >= MAX_LEVEL) {
      endRoundWithBest("won");
      return;
    }

    levelRef.current += 1;
    levelBoostRef.current += 1;

    resetRound("playing");
    normalizeBallSpeed(speedMagnitudeRef.current + 1);

    setSnapshotPartial({
      level: levelRef.current,
      state: "playing",
      bricksRemaining: BRICK_COLUMNS * BRICK_ROWS,
    });

    flashLevel(`Level ${levelRef.current}`);
  }, [endRoundWithBest, flashLevel, normalizeBallSpeed, resetRound, setSnapshotPartial]);

  const updateGame = useCallback(() => {
    const paddle = paddleRef.current;
    const ball = ballRef.current;
    const sourceBricks = bricksRef.current;
    let nextBricks = sourceBricks;

    const ensureMutableBricks = () => {
      if (nextBricks === sourceBricks) {
        nextBricks = sourceBricks.map((brick) => ({ ...brick }));
      }
    };

    if (keysRef.current.left) {
      paddle.x = clamp(paddle.x - 8, 0, CANVAS_WIDTH - paddle.width);
    }

    if (keysRef.current.right) {
      paddle.x = clamp(paddle.x + 8, 0, CANVAS_WIDTH - paddle.width);
    }

    const previousY = ball.y;

    ball.x += ball.vx;
    ball.y += ball.vy;

    if (ball.x - ball.radius <= 0 || ball.x + ball.radius >= CANVAS_WIDTH) {
      ball.vx *= -1;
      ball.x = clamp(ball.x, ball.radius, CANVAS_WIDTH - ball.radius);
      playSound("wall");
    }

    if (ball.y - ball.radius <= 0) {
      ball.vy = Math.abs(ball.vy);
      ball.y = ball.radius;
      playSound("wall");
    }

    if (
      ball.vy > 0 &&
      ball.y + ball.radius >= paddle.y &&
      ball.y - ball.radius <= paddle.y + paddle.height &&
      ball.x >= paddle.x &&
      ball.x <= paddle.x + paddle.width
    ) {
      const speed = clamp(Math.hypot(ball.vx, ball.vy), 4, MAX_SPEED);
      const hitPos = (ball.x - paddle.x) / paddle.width;
      const angle = (hitPos - 0.5) * Math.PI * 0.75;
      ball.vx = Math.sin(angle) * speed;
      ball.vy = -Math.abs(Math.cos(angle) * speed);
      ball.y = paddle.y - ball.radius - 1;
      playSound("paddle");
    }

    if (ball.y - ball.radius > CANVAS_HEIGHT) {
      livesRef.current -= 1;
      playSound("lose");
      setSnapshotPartial({ lives: livesRef.current });

      if (livesRef.current <= 0) {
        endRoundWithBest("gameover");
        return;
      }

      resetBall();
      paddleRef.current = createPaddle();
      return;
    }

    for (let index = 0; index < sourceBricks.length; index += 1) {
      const brick = nextBricks[index];
      if (brick.removed) {
        continue;
      }

      if (!circleIntersectsRect(ball, brick)) {
        continue;
      }

      if (previousY + ball.radius <= brick.y || previousY - ball.radius >= brick.y + brick.height) {
        ball.vy *= -1;
      } else {
        ball.vx *= -1;
      }

      if (brick.hitsLeft > 1) {
        ensureMutableBricks();
        nextBricks[index] = {
          ...nextBricks[index],
          hitsLeft: nextBricks[index].hitsLeft - 1,
        };
      } else if (brick.fadeFrames === 0) {
        ensureMutableBricks();
        nextBricks[index] = {
          ...nextBricks[index],
          fadeFrames: 5,
        };
        scoreRef.current += brick.points;
        setSnapshotPartial({ score: scoreRef.current });
        spawnBrickParticles(brick);
        playSound("brick");
      }
      break;
    }

    for (let index = 0; index < nextBricks.length; index += 1) {
      const brick = nextBricks[index];
      if (brick.fadeFrames > 0) {
        ensureMutableBricks();
        const remainingFrames = brick.fadeFrames - 1;
        nextBricks[index] = {
          ...brick,
          fadeFrames: remainingFrames,
          removed: remainingFrames === 0 ? true : brick.removed,
        };
      }
    }

    particlesRef.current = particlesRef.current
      .map((particle) => ({
        ...particle,
        x: particle.x + particle.vx,
        y: particle.y + particle.vy,
        vy: particle.vy + 0.15,
        life: particle.life - 1,
      }))
      .filter((particle) => particle.life > 0);

    for (let row = 0; row < BRICK_ROWS; row += 1) {
      if (rowClearedRef.current[row]) {
        continue;
      }
      if (getRowAliveCount(nextBricks, row) === 0) {
        rowClearedRef.current[row] = true;
        normalizeBallSpeed(speedMagnitudeRef.current + 0.3);
      }
    }

    if (nextBricks !== sourceBricks) {
      bricksRef.current = nextBricks;
    }

    const bricksRemaining = getAliveBrickCount(nextBricks);
    if (snapshot.bricksRemaining !== bricksRemaining) {
      setSnapshotPartial({ bricksRemaining });
    }

    if (bricksRemaining === 0) {
      startNextLevel();
    }
  }, [
    endRoundWithBest,
    normalizeBallSpeed,
    playSound,
    resetBall,
    setSnapshotPartial,
    snapshot.bricksRemaining,
    spawnBrickParticles,
    startNextLevel,
  ]);

  const drawScene = useCallback(() => {
    const ctx = contextRef.current;
    if (!ctx) {
      return;
    }

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.fillStyle = "#0D0D1A";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    for (const brick of bricksRef.current) {
      if (brick.removed) {
        continue;
      }

      const alpha = brick.fadeFrames > 0 ? brick.fadeFrames / 5 : 1;
      const color = brick.hitsLeft < brick.maxHits ? darkenedColor(brick.color) : brick.color;
      ctx.fillStyle = alpha < 1 ? hexToRgba(brick.color, alpha) : color;
      drawRoundedRect(ctx, brick.x, brick.y, brick.width, brick.height, 6);
      ctx.fill();
    }

    const paddle = paddleRef.current;
    const gradient = ctx.createLinearGradient(paddle.x, paddle.y, paddle.x + paddle.width, paddle.y);
    gradient.addColorStop(0, "#4F8EF7");
    gradient.addColorStop(1, "#7C3AED");
    ctx.fillStyle = gradient;
    drawRoundedRect(ctx, paddle.x, paddle.y, paddle.width, paddle.height, 6);
    ctx.fill();

    const ball = ballRef.current;
    ctx.save();
    ctx.beginPath();
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#4F8EF7";
    ctx.fillStyle = "#FFFFFF";
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    for (const particle of particlesRef.current) {
      ctx.beginPath();
      ctx.fillStyle = hexToRgba(particle.color, particle.life / particle.maxLife);
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    contextRef.current = canvas.getContext("2d");

    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const updateMobile = () => setSnapshotPartial({ isMobile: mediaQuery.matches });
    mediaQuery.addEventListener("change", updateMobile);

    const loop = (timestamp: number) => {
      if (!lastFrameRef.current) {
        lastFrameRef.current = timestamp;
      }

      const elapsed = timestamp - lastFrameRef.current;
      if (elapsed >= FRAME_TIME) {
        if (stateRef.current === "playing") {
          updateGame();
        }
        drawScene();
        lastFrameRef.current = timestamp;
      }

      rafRef.current = window.requestAnimationFrame(loop);
    };

    rafRef.current = window.requestAnimationFrame(loop);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.cancelAnimationFrame(rafRef.current);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      mediaQuery.removeEventListener("change", updateMobile);
      if (flashTimeoutRef.current) {
        window.clearTimeout(flashTimeoutRef.current);
      }
    };
  }, [drawScene, handleKeyDown, handleKeyUp, setSnapshotPartial, updateGame]);

  const controls = useMemo<BreakoutControls>(
    () => ({
      canvasRef,
      snapshot,
      onMouseMove,
      onTouchMove,
      onCanvasPress,
      onControlPress,
      toggleMute,
      restartGame,
    }),
    [onCanvasPress, onControlPress, onMouseMove, onTouchMove, restartGame, snapshot, toggleMute]
  );

  return controls;
}
