export type Player = "X" | "O";
export type Winner = Player | "Draw" | null;
export type Cell = Player | null;
export type GameBoard = Cell[];
export type GameResult = { winner: Winner, winningSquares: number[]} ;