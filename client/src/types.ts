/** One of the two players in the game. */
export type Player = "X" | "O";

/**
 * The value of a single cell on the board. 
 * null indicates the cell has not been claimed by either
 */
export type Cell = Player | null;

/**
 * The game board represented as a flat array of cells,
 * indexed left-to-right, top-to-bottom.
 */
export type GameBoard = Cell[];

/**
 * The outcome of a finished game.
 * null indicates the game is still in progress.
 */
export type Winner = Player | "Draw" | null;

/**
 * The result of the game as a record with the winner
 * and the indices of the three winning cells, or an empty 
 * array if there is no winner yet or if the game is a draw.
 */
export type GameResult = {
  winner: Winner,
  winningSquares: number[]
};

/** 
 * Valid options for each setting: used for runtime validation via isValidOption.
 * Types are derived from these arrays. To update types, ONLY modify these arrays.
 */
export const GRID_SIZES = [3, 4, 5] as const;
export const GAME_MODES = ["classic", "endless"] as const;
export const OPPONENTS = ["local", "computer"] as const;
export const PLAYERS = ["X", "O"] as const;
export const AI_LEVELS = ["easy", "hard"] as const;

/** Grid sizes for the game board, e.g. 3x3, 4x4 */
export type GridSize = typeof GRID_SIZES[number];

/** Game modes, e.g. classic, endless */
export type GameMode = typeof GAME_MODES[number];

/** Opponent, i.e. are you playing against a friend locally, or against the computer */
export type Opponent = typeof OPPONENTS[number];

/** AI opponent difficulty (can be easy or hard) */
export type Difficulty = typeof AI_LEVELS[number];

/** All configurable settings for a game session. */
export type GameSettings = {
  gridSize: GridSize,
  gameMode: GameMode,
  opponent: Opponent,
  player: Player,
  difficulty: Difficulty
};
