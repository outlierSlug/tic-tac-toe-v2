import type { Player, GameBoard, GameResult } from "./types";

/**
 * Determines whether the given value is a record.
 * 
 * @param val - the value to check
 * @return true if the value is a record and false otherwise
 */
export const isRecord = (val: unknown): val is Record<string, unknown> => {
  return val !== null && typeof val === "object";
}

/**
 * Determines whether the given value is a valid option from a list. 
 * Used to validate select input values against their allowed types.
 * 
 * @param val - the value to check
 * @param options - the list of valid options
 * @returns true if the val is in options, false otherwise
 */
export const isValidOption = <T>(val: unknown, options: readonly T[]): val is T => {
  return options.includes(val as T);
}

/**
 * Determines the result of the current board state.
 * Checks all possible winning combinations (three in a row).
 * 
 * @param board - the current game board
 * @returns a GameResult containing the winner and winning square indices, if any.
 */
export const calculateWinner = (board: GameBoard): GameResult => {
  // All 8 possible winning combinations (rows, columns, diagonals)
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

  // Otherwise, there is no winner yet. Game is still in progress.
  return { winner: null, winningSquares: []};
}

/**
 * Get the index of the square that will be removed from the board on this move (in endless mode).
 * 
 * Endless Mode Invariant: 
 * Each move changes exactly one square, and tokens expire exactly 6 moves after they are placed.
 * The token that must be removed on currentMove is the placement that occurred on currentMove - 6, which 
 * can be uniquely identified by a null -> Player diff from history[currentMove - 6] and history[currentMove - 5].
 * 
 * @param history - the full game history
 * @param currentMove - the current move index
 * @returns the index of the expering square, or null if no removal yet
 */
export const getExpiringSquare = (history: GameBoard[], currentMove: number): number | null => {
  // The first possible expiring square on a 3x3 grid is on turn 7 (X's fourth move, currentMove = 6).
  if (currentMove < 6) {
    return null;
  }

  // Find where the current player's oldest token was placed. 
  // The difference between the history board 6 indices ago and 5 indices ago was 
  // the oldest move played by the current player.
  const index = currentMove - 6;
  const prev = history[index];
  const curr = history[index + 1];

  // Find the index where the previous board had null and the current board has a token.
  // This was the index of the move that was played on that turn.
  return curr.findIndex((cell, i) => prev[i] === null && cell !== prev[i]);
}

/**
 * Removes the expiring square from the board in endless mode.
 * Mutates the board in place. NEVER call this on state directly, call on a copy.
 * 
 * @param currentSquares 
 * @param expiringSquare 
 */
export const removeExpiringSquare = (currentSquares: GameBoard, expiringSquare: number | null): void => {
  if (expiringSquare !== null) {
    currentSquares[expiringSquare] = null;
  }
}

/**
 * Returns the index of a random empty square from the game board.
 * If the board is full, returns null.
 * 
 * @param board - the current game board
 * @returns the index of the randomly chosen empty square. 
 */
export const getRandomSquare = (board: GameBoard): number | null  => {
  const emptyIndices: number[] = [];

  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) {
      emptyIndices.push(i);
    }
  }

  // If there are no empty squares (board is full), return null.
  if (emptyIndices.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * emptyIndices.length);
  return emptyIndices[randomIndex];
}

/**
 * Determines if it is the human player's turn at a given move index
 * when facing the computer.
 * 
 * @param move - the move index to check
 * @param playerSide - the side the human is playing as
 * @returns true if it is the human's turn at the given move index
 */
export const isHumanTurn = (move: number, playerSide: Player): boolean => {
    if (playerSide === "X"){
      return move % 2 === 0;
    } else {
      return move % 2 === 1;
    }
  }
