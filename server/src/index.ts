import express, { Express } from "express";

const port: number = 8080;
const app: Express = express();

app.use(express.json());
app.listen(port, () => console.log(`Server listening on ${port}`));