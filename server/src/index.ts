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

app.get("/api/", async (req: Request, res: Response) => {
  const times = await db.fetch();
  res.send(times).status(200);
});

app.post("/api/new", async (req: Request, res: Response) => {
  const { addedAt, countdownTo } = req.body;
  // JSON.parse(Object.keys(req.body)[0])

  let newItem;
  try {
    newItem = await db.put({
      addedAt,
      countdownTo,
    });
  } catch (e) {
    res.status(500).send(e);
  }

  res.send(newItem).status(200);
});

app.post("/api/delete/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await db.delete(id);
  } catch (e) {
    res.status(500).send(e);
  }

  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT} 🚀`);
});
