"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
  Board,
  Difficulty,
  GameMode,
  GameResult,
  Player,
  TicTacToeActions,
  TicTacToeState,
  WinnerCheck,
} from "@/components/games/tictactoe/tictactoe.types";

const WINNING_LINES: [number, number, number][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function createBoard(): Board {
  return Array.from({ length: 9 }, () => null);
}

function checkWinner(board: Board): WinnerCheck {
  for (const [a, b, c] of WINNING_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: [a, b, c] };
    }
  }

  if (board.every((cell) => cell !== null)) {
    return { winner: "draw", line: null };
  }

  return { winner: null, line: null };
}

function getEmptyCells(board: Board): number[] {
  const cells: number[] = [];
  for (let index = 0; index < board.length; index += 1) {
    if (!board[index]) {
      cells.push(index);
    }
  }
  return cells;
}

function minimax(board: Board, depth: number, isMaximizing: boolean, alpha: number, beta: number): number {
  const winner = checkWinner(board).winner;
  if (winner === "O") {
    return 10 - depth;
  }
  if (winner === "X") {
    return depth - 10;
  }
  if (board.every((cell) => cell !== null)) {
    return 0;
  }

  if (isMaximizing) {
    let best = -Infinity;
    for (let index = 0; index < 9; index += 1) {
      if (!board[index]) {
        board[index] = "O";
        best = Math.max(best, minimax(board, depth + 1, false, alpha, beta));
        board[index] = null;
        alpha = Math.max(alpha, best);
        if (beta <= alpha) {
          break;
        }
      }
    }
    return best;
  }

  let best = Infinity;
  for (let index = 0; index < 9; index += 1) {
    if (!board[index]) {
      board[index] = "X";
      best = Math.min(best, minimax(board, depth + 1, true, alpha, beta));
      board[index] = null;
      beta = Math.min(beta, best);
      if (beta <= alpha) {
        break;
      }
    }
  }
  return best;
}

function getBestMove(board: Board): number {
  let bestScore = -Infinity;
  let bestMove = -1;

  for (let index = 0; index < 9; index += 1) {
    if (!board[index]) {
      board[index] = "O";
      const score = minimax(board, 0, false, -Infinity, Infinity);
      board[index] = null;
      if (score > bestScore) {
        bestScore = score;
        bestMove = index;
      }
    }
  }

  return bestMove;
}

function findImmediateMove(board: Board, player: Player): number {
  for (const [a, b, c] of WINNING_LINES) {
    const line = [board[a], board[b], board[c]];
    const playerCount = line.filter((cell) => cell === player).length;
    const emptyCount = line.filter((cell) => cell === null).length;

    if (playerCount === 2 && emptyCount === 1) {
      const indices = [a, b, c];
      return indices.find((index) => board[index] === null) ?? -1;
    }
  }
  return -1;
}

function getMediumMove(board: Board): number {
  const winMove = findImmediateMove(board, "O");
  if (winMove >= 0) {
    return winMove;
  }

  const blockMove = findImmediateMove(board, "X");
  if (blockMove >= 0) {
    return blockMove;
  }

  const emptyCells = getEmptyCells(board);
  if (emptyCells.length === 0) {
    return -1;
  }

  return emptyCells[Math.floor(Math.random() * emptyCells.length)] ?? -1;
}

function getEasyMove(board: Board): number {
  const emptyCells = getEmptyCells(board);
  if (emptyCells.length === 0) {
    return -1;
  }

  return emptyCells[Math.floor(Math.random() * emptyCells.length)] ?? -1;
}

function getAIMove(board: Board, difficulty: Difficulty): number {
  if (difficulty === "easy") {
    return getEasyMove(board);
  }
  if (difficulty === "medium") {
    return getMediumMove(board);
  }
  return getBestMove(board);
}

export default function useTicTacToe(): { state: TicTacToeState; actions: TicTacToeActions } {
  const aiTimerRef = useRef<number | null>(null);
  const [state, setState] = useState<TicTacToeState>({
    board: createBoard(),
    mode: null,
    difficulty: "hard",
    currentPlayer: "X",
    result: null,
    winningLine: null,
    isThinking: false,
    scores: { xWins: 0, draws: 0, oWins: 0 },
  });

  const clearAiTimer = useCallback(() => {
    if (aiTimerRef.current) {
      window.clearTimeout(aiTimerRef.current);
      aiTimerRef.current = null;
    }
  }, []);

  const applyRoundResult = useCallback((winner: GameResult, previous: TicTacToeState) => {
    if (winner === "X") {
      return {
        ...previous.scores,
        xWins: previous.scores.xWins + 1,
      };
    }
    if (winner === "O") {
      return {
        ...previous.scores,
        oWins: previous.scores.oWins + 1,
      };
    }
    if (winner === "draw") {
      return {
        ...previous.scores,
        draws: previous.scores.draws + 1,
      };
    }
    return previous.scores;
  }, []);

  const placeMark = useCallback((index: number) => {
    setState((previous) => {
      if (!previous.mode || previous.result || previous.board[index] || previous.isThinking) {
        return previous;
      }

      if (previous.mode === "vs-ai" && previous.currentPlayer === "O") {
        return previous;
      }

      const nextBoard = [...previous.board];
      nextBoard[index] = previous.currentPlayer;
      const outcome = checkWinner(nextBoard);

      if (outcome.winner) {
        return {
          ...previous,
          board: nextBoard,
          result: outcome.winner,
          winningLine: outcome.line,
          isThinking: false,
          scores: applyRoundResult(outcome.winner, previous),
        };
      }

      if (previous.mode === "vs-friend") {
        return {
          ...previous,
          board: nextBoard,
          currentPlayer: previous.currentPlayer === "X" ? "O" : "X",
        };
      }

      return {
        ...previous,
        board: nextBoard,
        currentPlayer: "O",
        isThinking: true,
      };
    });
  }, [applyRoundResult]);

  useEffect(() => {
    if (!(state.mode === "vs-ai" && state.currentPlayer === "O" && state.isThinking && !state.result)) {
      return;
    }

    clearAiTimer();
    aiTimerRef.current = window.setTimeout(() => {
      setState((previous) => {
        if (!(previous.mode === "vs-ai" && previous.currentPlayer === "O" && previous.isThinking && !previous.result)) {
          return previous;
        }

        const nextBoard = [...previous.board];
        const move = getAIMove(nextBoard, previous.difficulty);

        if (move < 0) {
          return {
            ...previous,
            isThinking: false,
            currentPlayer: "X",
          };
        }

        nextBoard[move] = "O";
        const outcome = checkWinner(nextBoard);

        if (outcome.winner) {
          return {
            ...previous,
            board: nextBoard,
            result: outcome.winner,
            winningLine: outcome.line,
            isThinking: false,
            scores: applyRoundResult(outcome.winner, previous),
          };
        }

        return {
          ...previous,
          board: nextBoard,
          currentPlayer: "X",
          isThinking: false,
        };
      });
    }, 500);

    return () => {
      clearAiTimer();
    };
  }, [applyRoundResult, clearAiTimer, state.currentPlayer, state.isThinking, state.mode, state.result]);

  useEffect(() => {
    return () => {
      clearAiTimer();
    };
  }, [clearAiTimer]);

  const actions = useMemo<TicTacToeActions>(
    () => ({
      selectMode: (mode: GameMode, difficulty?: Difficulty) => {
        clearAiTimer();
        setState((previous) => ({
          ...previous,
          mode,
          difficulty: difficulty ?? previous.difficulty,
          board: createBoard(),
          currentPlayer: "X",
          result: null,
          winningLine: null,
          isThinking: false,
        }));
      },
      setDifficulty: (difficulty: Difficulty) => {
        setState((previous) => ({ ...previous, difficulty }));
      },
      placeMark,
      newGame: () => {
        clearAiTimer();
        setState((previous) => ({
          ...previous,
          board: createBoard(),
          currentPlayer: "X",
          result: null,
          winningLine: null,
          isThinking: false,
        }));
      },
      resetScore: () => {
        clearAiTimer();
        setState((previous) => ({
          ...previous,
          board: createBoard(),
          currentPlayer: "X",
          result: null,
          winningLine: null,
          isThinking: false,
          scores: { xWins: 0, draws: 0, oWins: 0 },
        }));
      },
      switchMode: () => {
        clearAiTimer();
        setState((previous) => ({
          ...previous,
          mode: null,
          board: createBoard(),
          currentPlayer: "X",
          result: null,
          winningLine: null,
          isThinking: false,
        }));
      },
      playAgain: () => {
        clearAiTimer();
        setState((previous) => ({
          ...previous,
          board: createBoard(),
          currentPlayer: "X",
          result: null,
          winningLine: null,
          isThinking: false,
        }));
      },
    }),
    [clearAiTimer, placeMark]
  );

  return { state, actions };
}

export { checkWinner, getBestMove, minimax };
