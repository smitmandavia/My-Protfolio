export type Player = "X" | "O";
export type CellValue = Player | null;
export type Board = CellValue[];
export type GameMode = "vs-ai" | "vs-friend";
export type Difficulty = "easy" | "medium" | "hard";
export type GameResult = Player | "draw" | null;

export interface Scores {
  xWins: number;
  draws: number;
  oWins: number;
}

export interface WinnerCheck {
  winner: GameResult;
  line: [number, number, number] | null;
}

export interface TicTacToeState {
  board: Board;
  mode: GameMode | null;
  difficulty: Difficulty;
  currentPlayer: Player;
  result: GameResult;
  winningLine: [number, number, number] | null;
  isThinking: boolean;
  scores: Scores;
}

export interface TicTacToeActions {
  selectMode: (mode: GameMode, difficulty?: Difficulty) => void;
  setDifficulty: (difficulty: Difficulty) => void;
  placeMark: (index: number) => void;
  newGame: () => void;
  resetScore: () => void;
  switchMode: () => void;
  playAgain: () => void;
}
