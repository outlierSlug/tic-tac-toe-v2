// The two players in the game.
export type Player = "X" | "O";

// The value of a single square (cell) on the board.
// Can be owned by either player or null if not yet selected.
export type Cell = Player | null;

// The game board represented as a flat array of cells.
export type GameBoard = Cell[];

// The "winner" of the game. Can be either player, a draw, or null if the game is still ongoing.
export type Winner = Player | "Draw" | null;

// The result of the game. Contains a record of the winner and the winning squares, if any.
export type GameResult = { winner: Winner, winningSquares: number[]};