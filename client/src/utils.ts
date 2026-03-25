import type { Player, GameBoard, GameResult } from "./types";

/**
 * Determines whether the given value is a record.
 * @param val the value in question
 * @return true if the value is a record and false otherwise
 */
export const isRecord = (val: unknown): val is Record<string, unknown> => {
  return val !== null && typeof val === "object";
}

/**
 * Helper function to calculate whether there is a winner in the current board state.
 * Returns a GameResult that contains the winner annd the winning squares.
 */
export const calculateWinner = (board: GameBoard): GameResult => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  // Check if a player has three in a row. 
  // If they do, return the winner and the winning combination.
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if(board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a] as Player, winningSquares: [a, b, c] };
    }
  }

  // If the board is full, we have a draw.
  if (board.every((cell) => cell !== null)) {
    return { winner: "Draw", winningSquares: [] };
  }

  // Otherwise, there is no winner yet.
  return { winner: null, winningSquares: []};
}
