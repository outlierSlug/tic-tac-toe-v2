import { GAME_MODES, GRID_SIZES, OPPONENTS, type GameBoard, type GameSettings } from "./types";
import { isRecord, isValidOption } from "./utils";

// GET methods

/**
 * Fetches the current game state from the /game endpoint on mount.
 * On success, updates the client's history and currentMove state.
 *
 * @param setHistory - React state setter function for game history
 * @param setCurrentMove - React state setter function for current move index
 */
export const getGameState = (setHistory: (history: GameBoard[]) => void, setCurrentMove: (currentMove: number) => void): void => {
  fetch("http://localhost:8080/game")
    .then((res) => doGetGameStateResp(res, setHistory, setCurrentMove))
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
const doGetGameStateResp = (res: Response, setHistory: (history: GameBoard[]) => void, setCurrentMove: (currentMove: number) => void): void => {
  if (res.status === 200) {
    res.json()
      .then((data) => doGetGameStateJson(data, setHistory, setCurrentMove))
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
const doGetGameStateJson = (data: unknown, setHistory: (history: GameBoard[]) => void, setCurrentMove: (currentMove: number) => void): void => {
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

// GET /settings
/**
 * Fetches the current game settings from the /settings endpoint on mount.
 * On success, updates the client settings state.
 * 
 * @param setSettings 
 */
export const getSettings = (setSettings: (settings: GameSettings) => void): void => {
  fetch("http://localhost:8080/settings")
    .then((res) => doGetSettingsResp(res, setSettings))
    .catch(doGetError)
}

/**
 * Handles the HTTP response from GET /settings.
 * Routes to JSON parsing on 200 OK, or error handling otherwise.
 * 
 * @param res - the HTTP response from the server
 * @param setSettings - React state setter function for settings
 */
const doGetSettingsResp = (res: Response, setSettings: (settings: GameSettings) => void): void => {
  if (res.status === 200) {
    res.json()
      .then((data) => doGetSettingsJson(data, setSettings))
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
 * Validates and processes the JSON response from GET /settings.
 * The JSON response must contain a valid GameSettings object with valid fields.
 * 
 * @param data - the the parsed JSON response from the server
 * @param setSettings - React state setter function for settings
 * @returns 
 */
const doGetSettingsJson = (data: unknown, setSettings: (settings: GameSettings) => void): void => {
  if (!isRecord(data)) {
    doGetError(`Data is not a record: ${typeof data}`);
    return;
  }

  if (!isValidOption(data.gridSize, GRID_SIZES)) {
    doGetError(`data.gridSize is not valid: ${data.gridSize}`);
    return;
  }

  if (!isValidOption(data.gameMode, GAME_MODES)) {
    doGetError(`data.gameMode is not valid: ${data.gameMode}`);
    return;
  }

  if (!isValidOption(data.opponent, OPPONENTS)) {
    doGetError(`data.opponent is not valid: ${data.opponent}`);
    return;
  }

  // Update client state
  setSettings({gridSize: data.gridSize, gameMode: data.gameMode, opponent: data.opponent});
}

/**
 * Logs an errors that occur during the GET fetch process.
 *
 * @param err - the error that occurred
 */
const doGetError = (err: unknown): void => {
  console.error("Error during GET request: ", err);
}

// POST methods

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

// POST /settings
export const saveSettings = (gameSettings: GameSettings): void => {
  fetch("http://localhost:8080/settings", {
      method: "POST",
      body: JSON.stringify(gameSettings),
      headers: {"Content-Type": "application/json"}
  })
  .then(doSaveResp)
  .catch(doSaveError);
}

/**
 * Handles the HTTP response from a POST request.
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
 * Logs an errors that occur during the POST fetch process.
 *
 * @param err - the error that occurred
 */
const doSaveError = (err: unknown): void => {
  console.error("Error during POST request: ", err);
}
