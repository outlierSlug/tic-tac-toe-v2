import { useEffect, useState } from "react";

import { GAME_MODES, GRID_SIZES, OPPONENTS, type GameBoard, type GameResult, type GameSettings } from "./types";

import Board from "./components/Board";
import Status from "./components/Status";
import Controls from "./components/Controls";
import Settings from "./components/Settings";

import { getGameState, saveGameState, getSettings, saveSettings } from "./api";
import { calculateWinner, isValidOption } from "./utils";

import "./App.css";

const DEFAULT_SETTINGS: GameSettings = { gridSize: 3, gameMode: "classic", opponent: "local"};
const DEFAULT_HISTORY: GameBoard[] = [Array(DEFAULT_SETTINGS.gridSize * DEFAULT_SETTINGS.gridSize).fill(null)];

export default function App() {
  // State to track the history of moves (an array of GameBoards) and the current move index
  const [currentMove, setCurrentMove] = useState(0);
  const [history, setHistory] = useState<GameBoard[]>(DEFAULT_HISTORY);

  // Game settings, configurable before the game starts.
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);

  // Determine the current turn and game state.
  const xIsNext: boolean = currentMove % 2 === 0;
  const currentSquares: GameBoard = history[currentMove];

  // Check for a potential winner and the winning squares.
  const gameResult: GameResult = calculateWinner(currentSquares);
  const winner = gameResult.winner;
  const winningSquares = gameResult.winningSquares;

  // Checks if the game has started. Settings are locked once a game begins.
  const hasGameStarted = currentMove > 0 || history.length > 1;

  // GET current game state and settings on mount
  useEffect(() => {
    getGameState(setHistory, setCurrentMove); 
    getSettings(setSettings)
  }, []);

  /**
   * Handles a game square (cell) clicked on by a player.
   * Ignores clicks on already-filled squares or after the game has ended.
   * Updates server and client state on click.
   *
   * @param index - the index of the clicked square
   */
  const handleClick = (index: number): void => {
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

  /**
   * Handles undo button click.
   * Moves currentMove pointer one index back in history.
   */
  const handleUndo = (): void => {
    if (currentMove > 0) {
      saveGameState(history, currentMove - 1);
      setCurrentMove(currentMove - 1);
    }
  }

  /**
   * Handles redo button click.
   * Moves currentMove pointer one index forward in history.
   */
  const handleRedo = (): void => {
    if (currentMove < history.length - 1) {
      saveGameState(history, currentMove + 1);
      setCurrentMove(currentMove + 1);
    }
  }

  /**
   * Handles reset button click.
   * Clears all history and sets currentMove back to 0.
   */
  const handleReset = (): void => {
    const newHistory: GameBoard[] = [Array(settings.gridSize * settings.gridSize).fill(null)];
    saveGameState(newHistory, 0);
    setHistory(newHistory);
    setCurrentMove(0);
  }

  /**
   * Handles grid size select change.
   * 
   * @param evt - the change event from the <select> element
   */
  const handleGridSizeChange = (evt: React.ChangeEvent<HTMLSelectElement>): void => {
    const newGridSize = Number(evt.target.value);
    if (isValidOption(newGridSize, GRID_SIZES)) {
      saveSettings({...settings, gridSize: newGridSize});
      setSettings({...settings, gridSize: newGridSize});
    }
  }

  /**
   * Handles game mode select change.
   * 
   * @param evt - the change event from the <select> element
   */
  const handleModeChange = (evt: React.ChangeEvent<HTMLSelectElement>): void => {
    const newGameMode = evt.target.value;
    if (isValidOption(newGameMode, GAME_MODES)) {
      saveSettings({...settings, gameMode: newGameMode});
      setSettings({...settings, gameMode: newGameMode});
    }
  }

  /**
   * Handles opponent change.
   * 
   * @param evt - the change event from the <select> element
   */
  const handleOpponentChange = (evt: React.ChangeEvent<HTMLSelectElement>): void => {
    const newOpponent = evt.target.value;
    if (isValidOption(newOpponent, OPPONENTS)) {
      saveSettings({...settings, opponent: newOpponent});
      setSettings({...settings, opponent: newOpponent});
    }
  }

  /**
   * Handles button click that restores settings to default.
   */
  const handleRestoreDefaults = (): void => {
    saveSettings(DEFAULT_SETTINGS);
    setSettings(DEFAULT_SETTINGS);
  }

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
      <Settings gameStarted={hasGameStarted}
                gameSettings={settings} 
                onChangeGridSize={handleGridSizeChange}
                onChangeMode={handleModeChange}
                onChangeOpponent={handleOpponentChange}
                onRestoreDefaults={handleRestoreDefaults}/>
    </div>
  );
}
