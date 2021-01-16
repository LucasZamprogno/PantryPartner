import express, { Request, Response } from "express";
import {Ingredient} from "../../common/types";
import { DatabaseController } from "./DatabaseController";

const app = express();
const PORT = 8000;
const db = DatabaseController.getInstance();
db.initDb();

async function getIngredientByName(name: string): Promise<Ingredient> {
  return await db.read(DatabaseController.INGREDIENTS_COL, {name:name});
}

app.get('/', (req: Request, res: Response) => res.redirect("/index.html"));

app.get('/ingredient/:name', async (req: Request, res: Response) => {
  const doc: Ingredient = await getIngredientByName(req.params.name);
  if (doc) {
    res.status(200);
    res.json(doc);
  } else {
    res.sendStatus(404);
  }
});

app.get('/ingredients', async (req: Request, res: Response) => {
  const all = await db.readAll(DatabaseController.INGREDIENTS_COL);
  res.json(all);
});

app.delete('/ingredient/:name', async (req: Request, res: Response) => {
  const doc: Ingredient = await getIngredientByName(req.params.name);
  if (doc) {
    await db.remove(DatabaseController.INGREDIENTS_COL, {name:req.params.name});
    res.status(200);
    res.json(doc);
  } else {
    res.sendStatus(404);
  }
});

app.put('/ingredient/:name', async (req: Request, res: Response) => {
  let doc: Ingredient = await getIngredientByName(req.params.name);
  if (doc) {
    res.status(404);
  } else {
    await db.write(DatabaseController.INGREDIENTS_COL, {name:req.params.name});
    doc = await getIngredientByName(req.params.name);
    res.status(200);
    res.json(doc);
  }
});

app.patch('/ingredient/:name', async (req: Request, res: Response) => {
  let doc: Ingredient = await getIngredientByName(req.params.name);
  if (doc) {
    await db.replace(DatabaseController.INGREDIENTS_COL, {name:req.params.name}, {name:req.params.name});
    res.status(200);
    res.json(doc);
  } else {
    res.sendStatus(404);
  }
});

app.use(express.static('public'));

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});