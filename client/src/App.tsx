import { useEffect, useState } from "react";

import { AI_LEVELS, GAME_MODES, GRID_SIZES, OPPONENTS, PLAYERS, type GameBoard, type GameResult, type GameSettings, type Player } from "./types";

import Board from "./components/Board";
import Status from "./components/Status";
import Controls from "./components/Controls";
import Settings from "./components/Settings";

import { getGameState, saveGameState, getSettings, saveSettings } from "./api";
import { calculateWinner, getExpiringSquare, getMiniMaxMove, getRandomSquare, isHumanTurn, isValidOption, removeExpiringSquare } from "./utils";

import "./App.css";

// Global constants
const DEFAULT_SETTINGS: GameSettings = { gridSize: 3, gameMode: "classic", opponent: "local", player: "X", difficulty: "easy"};
const DEFAULT_HISTORY: GameBoard[] = [Array(DEFAULT_SETTINGS.gridSize * DEFAULT_SETTINGS.gridSize).fill(null)];
const COMPUTER_MOVE_DELAY_MS = 1000;

export default function App() {
  // State to track the history of moves (an array of GameBoards) and the current move index
  const [currentMove, setCurrentMove] = useState(0);
  const [history, setHistory] = useState<GameBoard[]>(DEFAULT_HISTORY);

  // Game settings, configurable before the game starts.
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);

  // Flag for computer move delay
  const [isComputerThinking, setIsComputerThinking] = useState(false);
  const computerToken: Player = settings.player === "X" ? "O" : "X";

  // Determine the current turn and game state.
  const xIsNext: boolean = currentMove % 2 === 0;
  const currentSquares: GameBoard = history[currentMove];

  // Check for a potential winner and the winning squares.
  const gameResult: GameResult = calculateWinner(currentSquares);
  const winner = gameResult.winner;
  const winningSquares = gameResult.winningSquares;

  // Check for an expiring square (only for endless mode).
  const expiringSquare: number | null = 
    settings.gameMode === "endless" ? getExpiringSquare(history, currentMove) : null;

  // Checks if the game has started. Settings are locked once a game begins.
  const hasGameStarted: boolean = 
    currentMove > 0 || history.length > 1 || (settings.opponent === "computer" && settings.player === "O");

  // GET current game state and settings on mount
  useEffect(() => {
    getGameState(setHistory, setCurrentMove); 
    getSettings(setSettings)
  }, []);

  /**
   * Triggers a computer move after a delay. Sets isComputerThinking to true while the computer is "thinking",
   * then calls doComputerMove after COMPUTER_MOVE_DELAY_MS milliseconds.
   * 
   * @param currentHistory - the current game history to pass to the computer
   * @param currentMoveIndex - the current move index to pass to the computer
   * @param token - the computer's token
   */
  const handleComputerMove = (currentHistory: GameBoard[], currentMoveIndex: number, token: Player): void => {
    setIsComputerThinking(true);
    setTimeout(() => {
      doComputerMove(currentHistory, currentMoveIndex, token);
      setIsComputerThinking(false);
    }, COMPUTER_MOVE_DELAY_MS);
  }

  /**
   * Processes a computer move. 
   * 
   * @param currentHistory - the current state of history
   * @param currentMoveIndex - the current move index
   * @param computerToken - the opposite of the player token
   */
  const doComputerMove = (currentHistory: GameBoard[], currentMoveIndex: number, computerToken: Player): void => {
    const board = [...currentHistory[currentMoveIndex]];

    if (calculateWinner(board).winner) {
      return;
    }

    // Get index based on difficulty (hard -> minimax, easy -> random)
    const computerIndex = settings.difficulty === "hard" 
      ? getMiniMaxMove(board, computerToken, settings.player)
      : getRandomSquare(board);

    if (computerIndex === null) {
      return;
    }

    const computerSquares = board.slice();
    computerSquares[computerIndex] = computerToken;

    if (settings.gameMode === "endless") {
      const computerExpiringSquare = getExpiringSquare(currentHistory, currentMoveIndex);
      removeExpiringSquare(computerSquares, computerExpiringSquare);
    }

    const nextHistory = [...currentHistory.slice(0, currentMoveIndex + 1), computerSquares];
    saveGameState(nextHistory, nextHistory.length - 1);
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  /**
   * Handles a game square (cell) clicked on by a player.
   * Ignores clicks on already-filled squares, if the computer is moving, or after the game has ended.
   * Updates server and client state on click.
   *
   * @param index - the index of the clicked square
   */
  const handleClick = (index: number): void => {
    if (currentSquares[index] || winner || isComputerThinking) {
      return;
    }

    // Set the square to the the current player's token.
    const nextSquares: GameBoard = currentSquares.slice();
    if (xIsNext) {
      nextSquares[index]= "X";
    } else {
      nextSquares[index] = "O";
    }

    // In endless mode, remove the current player's oldest token.
    if (settings.gameMode === "endless") {
      removeExpiringSquare(nextSquares, expiringSquare);
    }

    // Update the history of moves and move index.
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];

    // Update server state
    saveGameState(nextHistory, nextHistory.length - 1);

    // Update local state
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);

    // If playing against computer, trigger computer move
    if (settings.opponent === "computer" && !calculateWinner(nextSquares).winner) {
      handleComputerMove(nextHistory, nextHistory.length - 1, computerToken);
    }
  }

  /**
   * Handles undo button click.
   * Moves currentMove pointer one index back in history during local play.
   * Moves currentMove pointer back to the latest user move when playing against the computer.
   * 
   */
  const handleUndo = (): void => {
    if (currentMove > 0) {
      let newMove: number;
      if (settings.opponent === "computer") {
        newMove = currentMove - 1;
        while (!isHumanTurn(newMove, settings.player) && newMove > 0) {
          if (calculateWinner(history[newMove]).winner) {
            break;
          }
          newMove--;
        }

        // If we landed on move 0 and human is O, trigger computer first move again
        if (newMove === 0 && settings.player === "O") {
          handleComputerMove(history, 0, "X");
        }
      } else {
        newMove = currentMove - 1;
      }
      saveGameState(history, newMove);
      setCurrentMove(newMove);
    }
  }

  /**
   * Handles redo button click.
   * Moves currentMove pointer one index forward in history during local play.
   * Moves currentMove pointer forward to the next user move when playing against the computer.
   */
  const handleRedo = (): void => {
    if (currentMove < history.length - 1) {
      let newMove: number;
      if (settings.opponent === "computer") {
        newMove = currentMove + 1;
        while (!isHumanTurn(newMove, settings.player) && newMove < history.length - 1) {
          if (calculateWinner(history[newMove]).winner) {
            break;
          }
          newMove++;
        }
      } else {
        newMove = currentMove + 1;
      }
      saveGameState(history, newMove);
      setCurrentMove(newMove);
    }
  }

  /**
   * Handles reset button click.
   * Clears all history and sets currentMove back to 0. 
   * Also resets user player to "X" if playing against the computer.
   */
  const handleReset = (): void => {
    const newHistory: GameBoard[] = [Array(settings.gridSize * settings.gridSize).fill(null)];
    saveSettings({...settings, player: "X"});
    setSettings({...settings, player: "X"});
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
 * Handles player change. Only renders when opponent is selected as "computer".
 * If the user changes to "O", the game will start and the computer will make the first move automatically.
 * 
 * @param evt - the change event from the <select> element
 */
  const handlePlayerChange = (evt: React.ChangeEvent<HTMLSelectElement>): void => {
    const newPlayer = evt.target.value;
    if (isValidOption(newPlayer, PLAYERS)) {
      saveSettings({...settings, player: newPlayer});
      setSettings({...settings, player: newPlayer});

      if (newPlayer === "O") {
        handleComputerMove(history, currentMove, "X");
      }
    }
  }

  /**
   * Handles difficulty change. Only renders when opponent is selected as "computer".
   * 
   * @param evt - the change event from the <select> element.
   */
  const handleDifficultyChange = (evt: React.ChangeEvent<HTMLSelectElement>): void => {
    const newDifficulty = evt.target.value;
    if (isValidOption(newDifficulty, AI_LEVELS)) {
      saveSettings({...settings, difficulty: newDifficulty});
      setSettings({...settings, difficulty: newDifficulty});
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
      <Board board={currentSquares} 
             onClick={handleClick} 
             winningSquares={winningSquares}
             expiringSquare={expiringSquare}/>
      <Controls onUndo={handleUndo}
                onRedo={handleRedo}
                onReset={handleReset}
                isUndoDisabled={currentMove === 0 || isComputerThinking}
                isRedoDisabled={currentMove === history.length - 1 || isComputerThinking}
                isResetDisabled={history.length === 1 && currentMove === 0 || isComputerThinking}/>
      <Settings gameStarted={hasGameStarted}
                gameSettings={settings} 
                onChangeGridSize={handleGridSizeChange}
                onChangeMode={handleModeChange}
                onChangeOpponent={handleOpponentChange}
                onChangePlayer={handlePlayerChange}
                onChangeDifficulty={handleDifficultyChange}
                onRestoreDefaults={handleRestoreDefaults}/>
    </div>
  );
}
