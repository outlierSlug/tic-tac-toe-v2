import type { GameBoard } from "./types";
import { isRecord } from "./utils";

// GET /game

/**
 * Fetches the current game state from the /game endpoint on mount.
 * On success, updates the client's history and currentMove state.
 *
 * @param setHistory - React state setter function for game history
 * @param setCurrentMove - React state setter function for current move index
 */
export const getGameState = (setHistory: (history: GameBoard[]) => void, setCurrentMove: (currentMove: number) => void): void => {
  fetch("http://localhost:8080/game")
    .then((res) => doGetResp(res, setHistory, setCurrentMove))
    .catch(doGetError);
}

/**
 * Handles the HTTP response from GET /game.
 * Routes to JSON parsing on 200 OK, or error handling otherwise.
 *
 * @param res - the HTTP response from the server
 * @param setHistory - React state setter function for game history
 * @param setCurrentMove - React state setter function for current move index
 */
const doGetResp = (res: Response, setHistory: (history: GameBoard[]) => void, setCurrentMove: (currentMove: number) => void): void => {
  if (res.status === 200) {
    res.json()
      .then((data) => doGetJson(data, setHistory, setCurrentMove))
      .catch(doGetError);
  } else if (res.status === 400) {
    res.text()
      .then(doGetError)
      .catch(doGetError);
  } else {
    doGetError(`Unexpected response status: ${res.status}`);
  }
}

/**
 * Validates and processes the JSON response from GET /game.
 * The JSON response must contain a valid history array and currentMove index.
 *
 * @param data - the parsed JSON response from the server
 * @param setHistory - React state setter function for game history
 * @param setCurrentMove - React state setter function for current move index
 * @returns
 */
const doGetJson = (data: unknown, setHistory: (history: GameBoard[]) => void, setCurrentMove: (currentMove: number) => void): void => {
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

  // Ensure currentMove points to a valid index in history array.
  if (data.currentMove < 0 || data.currentMove >= ((data.history as GameBoard[]).length)) {
    doGetError("currentMove is out of bounds");
    return;
  }

  // Update client state via passed down React setter functions.
  setHistory(data.history as GameBoard[]);
  setCurrentMove(data.currentMove);
}

/**
 * Logs an errors that occur during the GET /game fetch process.
 *
 * @param err - the error that occurred
 */
const doGetError = (err: unknown): void => {
  console.error("Error fetching '/game', ", err);
}

// POST /game

/**
 * Saves the current game state to the server via POST request to the /game endpoint.
 * Called after every state change (click, undo, redo, reset).
 *
 * @param history - the current game history to persist
 * @param currentMove - the current move index t to persist
 */
export const saveGameState = (history: GameBoard[], currentMove: number): void => {
  fetch("http://localhost:8080/game", {
      method: "POST",
      body: JSON.stringify({history, currentMove}),
      headers: {"Content-Type": "application/json"}
    })
  .then(doSaveResp)
  .catch(doSaveError);
}

/**
 * Handles the HTTP response from POST /game.
 *
 * @param res - the HTTP response from the server
 */
const doSaveResp = (res: Response) => {
  if (res.status !== 200) {
    res.text()
      .then((msg) => doSaveError(`Unexpected response status: ${res.status}: ${msg}`))
      .catch(doSaveError);
  }
}

/**
 * Logs an errors that occur during the POST /game fetch process.
 *
 * @param err - the error that occurred
 */
const doSaveError = (err: unknown): void => {
  console.error("Error saving to /game: ", err);
}