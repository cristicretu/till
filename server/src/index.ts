import express, { Application, Request, Response } from "express";
import bodyParser from "body-parser";
// @ts-ignore
import { Deta } from "deta";
import * as dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const deta = process.env.DETA_PROJECT_KEY
  ? Deta(process.env.DETA_PROJECT_KEY)
  : Deta();

const corsOptions = {
  origin: process.env.DETA_PROJECT_KEY
    ? "https://localhost:3000"
    : `https://${process.env.DETA_SPACE_APP_HOSTNAME}`,
  credentials: true,
};

const PORT = process.env.port || 8080;

const db = deta.Base("till");

const app: Application = express();

app.use(cors(corsOptions));
app.use(bodyParser.json());

// --------

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!").status(200);
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT} 🚀`);
});
