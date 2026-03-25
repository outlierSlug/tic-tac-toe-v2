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
export type GameResult = { winner: Winner, winningSquares: number[]};