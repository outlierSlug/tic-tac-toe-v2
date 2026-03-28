import express, { Express } from "express";
import cors from "cors";
import { getGameState, setGameState, getSettings, setSettings } from "./routes";

const port: number = 8080;
const app: Express = express();

const ALLOWED_ORIGINS: string[] = [
  "http://localhost:5173", 
  "https://tic-tac-toe-v2-pink.vercel.app",
  "https://tic-tac-toe-v2-outlierslugs-projects.vercel.app"
];

app.use(cors({ origin: ALLOWED_ORIGINS }));
app.use(express.json());

app.get("/game", getGameState);
app.post("/game", setGameState);

app.get("/settings", getSettings);
app.post("/settings", setSettings);

app.listen(port, () => console.log(`Server listening on ${port}`));