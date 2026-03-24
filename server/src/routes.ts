import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core"

// Type checking for request body
type SafeRequest = Request<ParamsDictionary, {}, Record<string, unknown>>;
type SafeResponse = Response;

const gameState = {history: [Array(9).fill(null)], currentMove: 0};

export const getGameState = (_req: SafeRequest, res: SafeResponse): void => {
  res.json(gameState);
}

export const setGameState = (req: SafeRequest, res: SafeResponse): void => {
  const history = req.body.history;
  const currentMove = req.body.currentMove;

  if (!Array.isArray(history) || typeof currentMove !== "number") {
    res.status(400).send("Invalid request body");
    return;
  }
  gameState.history = history;
  gameState.currentMove = currentMove;
  res.status(200).send("OK");
}
