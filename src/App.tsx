import { useState } from "react";

import type { GameBoard, Winner } from "./types";

import Board from "./components/Board";
import Status from "./components/Status";
import Controls from "./components/Controls";

import "./App.css";

export default function App() {
  // State to track the history of moves (an array of GameBoards) and the current move index
  const [currentMove, setCurrentMove] = useState(0);
  const [history, setHistory] = useState<GameBoard[]>([Array(9).fill(null)]);

  // Determine the current turn and game state.
  const xIsNext: boolean = currentMove % 2 === 0;
  const currentSquares: GameBoard = history[currentMove];

  // Check for a winner.
  const winner: Winner = calculateWinner(currentSquares);

  const handleClick = (index: number): void => {
    // A square cannot be clicked on twice, and none can be clicked if the game is over.
    if (currentSquares[index] || calculateWinner(currentSquares)) {
      return;
    }

    // Set the square to the the current player's token.
    const nextSquares: GameBoard = currentSquares.slice();
    if (xIsNext) {
      nextSquares[index]= "X";
    } else {
      nextSquares[index] = "O";
    }

    // Update the history of moves and move index.
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  const handleUndo = () : void => {
    if (currentMove > 0) {
      setCurrentMove(currentMove - 1);
    }
  }

  const handleReset = () : void => {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  return (
    <div className="game">
      <h1 className="game-title">Tic-Tac-Toe</h1>
      <Status xIsNext={xIsNext} winner={winner} />
      <Board board={currentSquares} onClick={handleClick}/>
      <Controls onUndo={handleUndo} onReset={handleReset}/>
    </div>
  );
}

// Helper function to calculate whether there is a winner in the current board state.
function calculateWinner(board: GameBoard): Winner {
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
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if(board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  // If the board is full, we have a draw.
  if (board.every((cell) => cell !== null)) {
    return "Draw";
  }

  // Otherwise, there is no winner yet.
  return null;
}