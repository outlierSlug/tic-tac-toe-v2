import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core"

// Type checking for request body
type SafeRequest = Request<ParamsDictionary, {}, Record<string, unknown>>;
type SafeResponse = Response;

// In-memory storage for the current game state. Persists until server restarts.
// history: array of board snapshots
// currentMove: index into history (pointer to that board position)
const gameState = {history: [Array(9).fill(null)], currentMove: 0};

// In-memory storage for the current settings. 
const gameSettings = {gridSize: 3, gameMode: "classic", opponent: "local"};

const VALID_GRID_SIZES = [3, 4, 5];
const VALID_GAME_MODES = ["classic", "endless"];
const VALID_OPPONENTS = ["local", "computer"];

/**
 * GET /game
 * Returns the current game state as JSON. 
 * Called by the client on page load/refresh.
 * 
 * @param _req - unused request object
 * @param res - response object that sends gameState as JSON
 */
export const getGameState = (_req: SafeRequest, res: SafeResponse): void => {
  res.json(gameState);
}
/**
 * POST /game
 * Updates the in-memory gameState with the client's current state.
 * Called by the client after every state change (click, undo, redo, reset).
 * 
 * @param req - request object containing the new game state in req.body
 * @param res - response object, sends 200 OK on success or 400 on invalid request body
 * @returns 
 */
export const setGameState = (req: SafeRequest, res: SafeResponse): void => {
  const history = req.body.history;
  const currentMove = req.body.currentMove;

  // Validate request before updating gameState.
  if (!Array.isArray(history) || typeof currentMove !== "number") {
    res.status(400).send("Invalid request body");
    return;
  }
  gameState.history = history;
  gameState.currentMove = currentMove;
  res.status(200).send("OK");
}

// GET /settings
export const getSettings = (_req: SafeRequest, res: SafeResponse): void => {
  res.json(gameSettings);
}


// POST /settings
export const setSettings = (req: SafeRequest, res: SafeResponse): void => {
  const { gridSize, gameMode, opponent } = req.body;

  if (typeof gridSize !== "number" || !VALID_GRID_SIZES.includes(gridSize)) {
    res.status(400).send("Invalid gridSize");
    return;
  }

  if (typeof gameMode !== "string" || !VALID_GAME_MODES.includes(gameMode)) {
    res.status(400).send("Invalid gameMode");
    return;
  }

  if (typeof opponent !== "string" || !VALID_OPPONENTS.includes(opponent)) {
    res.status(400).send("Invalid opponent");
    return;
  }

  gameSettings.gridSize = gridSize;
  gameSettings.gameMode = gameMode;
  gameSettings.opponent = opponent;
  res.status(200).send("Settings saved successfully");
}
