import express, { Express } from "express";
import cors from "cors";
import { getGameState, setGameState } from "./routes";

const port: number = 8080;
const app: Express = express();

app.use(cors());
app.use(express.json());
app.get("/game", getGameState);
app.post("/game", setGameState);

app.listen(port, () => console.log(`Server listening on ${port}`));