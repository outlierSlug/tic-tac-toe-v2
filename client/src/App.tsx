import { useEffect, useState } from "react";

import type { GameBoard, GameResult } from "./types";

import Board from "./components/Board";
import Status from "./components/Status";
import Controls from "./components/Controls";
import { isRecord, calculateWinner } from "./utils";

import "./App.css";

export default function App() {
  // State to track the history of moves (an array of GameBoards) and the current move index
  const [currentMove, setCurrentMove] = useState(0);
  const [history, setHistory] = useState<GameBoard[]>([Array(9).fill(null)]);

  // Determine the current turn and game state.
  const xIsNext: boolean = currentMove % 2 === 0;
  const currentSquares: GameBoard = history[currentMove];

  // Check for a potential winner and the winning squares.
  const gameResult: GameResult = calculateWinner(currentSquares);
  const winner = gameResult.winner;
  const winningSquares = gameResult.winningSquares;

  // GET /game
  // Fetch the current game state from the /game server endpoint.
  const getGameState = (): void => {
    fetch("http://localhost:8080/game")
      .then(doGetResp)
      .catch(doGetError);
  }

  // Process server response. 
  const doGetResp = (res: Response): void => {
    if (res.status === 200) {
      res.json()
        .then(doGetJson)
        .catch(doGetError);
    } else if (res.status === 400) {
      res.text()
        .then(doGetError)
        .catch(doGetError);
    } else {
      doGetError(`Unexpected response status: ${res.status}`);
    }
  }

  // If server reponded with 200 OK, process JSON response and update state.
  const doGetJson = (data: unknown): void => {
    if (!isRecord(data)) {
      doGetError(`Data is not a record: ${typeof data}`);
      return;
    }

    if (!Array.isArray(data.history)) {
      doGetError(`data.history is not an array: ${typeof data.history}`);
      return;
    }

    if (typeof data.currentMove !== "number") {
      doGetError(`data.currentMove is not a number: ${typeof data.currentMove}`);
      return;
    }

    if ( data.currentMove < 0 || data.currentMove >= ((data.history as GameBoard[]).length)) {
      doGetError("currentMove is out of bounds");
      return;
    }

    setHistory(data.history as GameBoard[]);
    setCurrentMove(data.currentMove);
  }

  // Handle any getGameState errors during fetch process.
  const doGetError = (err: unknown): void => {
    console.error("Error fetching '/game', ", err);
  }

  // POST /game
  const saveGameState = (history: GameBoard[], currentMove: number): void => {
    fetch("http://localhost:8080/game", {
        method: "POST",
        body: JSON.stringify({history, currentMove}),
        headers: {"Content-Type": "application/json"}
      })
    .then(doSaveResp)
    .catch(doSaveError);
  }

  // Process server response. If server responded with 200 OK, all is good.
  const doSaveResp = (res: Response) => {
    if (res.status !== 200) {
      res.text()
        .then((msg) => doSaveError(`Unexpected response status: ${res.status}: ${msg}`))
        .catch(doSaveError);
    }
  }

  // Handle any saveGameState errors during fetch process.
  const doSaveError = (err: unknown): void => {
    console.error("Error saving to /game: ", err);
  }

  const handleClick = (index: number): void => {
    // A square cannot be clicked on twice, and none can be clicked if the game is over.
    if (currentSquares[index] || winner) {
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

    // Update server state
    saveGameState(nextHistory, nextHistory.length - 1);

    // Update local state
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  const handleUndo = (): void => {
    if (currentMove > 0) {
      saveGameState(history, currentMove - 1);
      setCurrentMove(currentMove - 1);
    }
  }

  const handleRedo = (): void => {
    if (currentMove < history.length - 1) {
      saveGameState(history, currentMove + 1);
      setCurrentMove(currentMove + 1);
    }
  }

  const handleReset = (): void => {
    saveGameState([Array(9).fill(null)], 0);
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  // Get current game state on mount
  useEffect(() => {getGameState()}, []);

  return (
    <div className="game">
      <h1 className="game-title">Tic-Tac-Toe</h1>
      <Status xIsNext={xIsNext} winner={winner} />
      <Board board={currentSquares} onClick={handleClick} winningSquares={winningSquares}/>
      <Controls onUndo={handleUndo}
                onRedo={handleRedo}
                onReset={handleReset}
                isUndoDisabled={currentMove === 0}
                isRedoDisabled={currentMove === history.length - 1}
                isResetDisabled={history.length === 1 && currentMove === 0}/>
    </div>
  );
}
