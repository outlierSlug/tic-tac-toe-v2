import express, { Express } from "express";
import cors from "cors";
import { getGameState, setGameState, getSettings, setSettings } from "./routes";

const port: number = 8080;
const app: Express = express();

app.use(cors());
app.use(express.json());

app.get("/game", getGameState);
app.post("/game", setGameState);

app.get("/settings", getSettings);
app.post("/settings", setSettings);

app.listen(port, () => console.log(`Server listening on ${port}`));