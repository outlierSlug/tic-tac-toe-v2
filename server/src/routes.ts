import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core"

// Type checking for request body
type SafeRequest = Request<ParamsDictionary, {}, Record<string, unknown>>;
type SafeResponse = Response;

// Game types
type GameState = { history: unknown[], currentMove: number};
type GameSettings = { gridSize: number, gameMode: string, opponent: string, player: string, difficulty: string }

// Mapping from sessionId to GameStates
const gameSessions: Map<string, GameState> = new Map();
const settingsSessions: Map<string, GameSettings> = new Map();

// In-memory storage for the current game state. Persists until server restarts.
// history: array of board snapshots
// currentMove: index into history (pointer to that board position)
const DEFAULT_GAME_STATE: GameState = { history: [Array(9).fill(null)], currentMove: 0 };

// In-memory storage for the current settings. 
const DEFAULT_SETTINGS: GameSettings = { gridSize: 3, gameMode: "classic", opponent: "local", player: "X", difficulty: "easy" };

// Validation constants (for game types)
const VALID_GRID_SIZES = [3, 4, 5];
const VALID_GAME_MODES = ["classic", "endless"];
const VALID_OPPONENTS = ["local", "computer"];
const VALID_PLAYERS = ["X", "O"];
const VALID_DIFFICULTIES = ["easy", "hard"];

/**
 * GET /game
 * Returns the current game state as JSON. 
 * Called by the client on page load/refresh.
 * 
 * @param req - request object
 * @param res - response object that sends gameState as JSON
 */
export const getGameState = (req: SafeRequest, res: SafeResponse): void => {
  const sessionId = getSessionId(req, res);
  if (!sessionId) {
    return;
  }

  const gameState = getSession(gameSessions, sessionId, DEFAULT_GAME_STATE)
  res.json(gameState);
}
/**
 * POST /game
 * Updates the in-memory gameState with the client's current state.
 * Called by the client after every state change (click, undo, redo, reset).
 * 
 * @param req - request object containing the new game state in req.body
 * @param res - response object, sends 200 OK on success or 400 on invalid request body
 */
export const setGameState = (req: SafeRequest, res: SafeResponse): void => {
  const sessionId = getSessionId(req, res);
  if (!sessionId) {
    return;
  }

  const history = req.body.history;
  const currentMove = req.body.currentMove;

  // Validate request before updating gameState.
  if (!Array.isArray(history) || typeof currentMove !== "number") {
    res.status(400).send("Invalid request body");
    return;
  }
  
  const gameState = getSession(gameSessions, sessionId, DEFAULT_GAME_STATE);
  gameState.history = history;
  gameState.currentMove = currentMove;
  res.status(200).send("OK");
}

/**
 * GET /settings
 * Returns the current game settings as JSON.
 * Called by the client on page load/refresh.
 * 
 * @param req - request object
 * @param res - response object that sends gameSettings as JSON
 */
export const getSettings = (req: SafeRequest, res: SafeResponse): void => {
  const sessionId = getSessionId(req, res);
  if (!sessionId) {
    return;
  }

  const gameSettings = getSession(settingsSessions, sessionId, DEFAULT_SETTINGS);
  res.json(gameSettings);
}

/**
 * POST /settings
 * 
 * @param req - request object containing the new gameSettings in req.body
 * @param res - response object, sends 200 OK on success and 400 on invalid request body
 */
export const setSettings = (req: SafeRequest, res: SafeResponse): void => {
  const sessionId = getSessionId(req, res);
  if (!sessionId) {
    return;
  }

  const { gridSize, gameMode, opponent, player, difficulty } = req.body;

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

  if (typeof player != "string" || !VALID_PLAYERS.includes(player)) {
    res.status(400).send("Invalid player");
    return;
  }

  if (typeof difficulty != "string" || !VALID_DIFFICULTIES.includes(difficulty)) {
    res.status(400).send("Invalid difficulty");
    return;
  }

  const gameSettings = getSession(settingsSessions, sessionId, DEFAULT_SETTINGS);
  gameSettings.gridSize = gridSize;
  gameSettings.gameMode = gameMode;
  gameSettings.opponent = opponent;
  gameSettings.player = player;
  gameSettings.difficulty = difficulty;
  res.status(200).send("Settings saved successfully");
}

/**
 * Helper method that gets the session object for the given sessionId.
 * If the map does not contain the sessionId, a new session mapping is created with that id.
 * 
 * @template T
 * @param map - stores session objects keyed by sessionId
 * @param sessionId - the unique identifier for the session
 * @param defaultValue - the default session value (used to create a new session mapping)
 * @returns the session object
 */
const getSession = <T>(map: Map<string, T>, sessionId: string, defaultValue: T): T => {
  if (!map.has(sessionId)) {
    map.set(sessionId, {...defaultValue});
  }
  return map.get(sessionId)!;
}

/**
 * Helper method that gets the sessionId from the request object headers.
 * 
 * @param req - the request object
 * @param res - the response object 
 * @returns the sessionId as a string, or null if there is none
 */
const getSessionId = (req: SafeRequest, res: SafeResponse): string | null => {
  const sessionId = req.headers["x-session-id"] as string;
  if (!sessionId) {
    res.status(400).send("Missing session ID");
    return null;
  }
  return sessionId;
}
