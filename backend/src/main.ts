import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import {Ingredient, IngredientPreWrite} from "../../common/types";
import { DatabaseController } from "./DatabaseController";
import {ObjectId} from 'mongodb';

const app = express();
app.use(bodyParser.json())
const PORT = 8000;
const db = DatabaseController.getInstance();
db.initDb();

async function getIngredientByName(name: string): Promise<Ingredient> {
  return await db.read(DatabaseController.INGREDIENTS_COL, {name:name});
}

async function getIngredientById(id: ObjectId): Promise<Ingredient> {
  return await db.read(DatabaseController.INGREDIENTS_COL, {_id:id});
}

app.get('/', (req: Request, res: Response) => res.redirect("/index.html"));

app.get('/ingredient/:id', async (req: Request, res: Response) => {
  const id: ObjectId = new ObjectId(req.params.id);
  const doc: Ingredient = await getIngredientById(id);
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

app.delete('/ingredient/:id', async (req: Request, res: Response) => {
  const id: ObjectId = new ObjectId(req.params.id);
  const doc: Ingredient = await getIngredientById(id);
  if (doc) {
    await db.remove(DatabaseController.INGREDIENTS_COL, {_id:id});
    res.status(200);
    res.json(doc);
  } else {
    res.sendStatus(404);
  }
});

app.put('/ingredient', async (req: Request, res: Response) => {
  const body: IngredientPreWrite = req.body;
  let doc: Ingredient = await getIngredientByName(body.name);
  if (doc) {
    res.status(400);
  } else {
    await db.write(DatabaseController.INGREDIENTS_COL, body);
    doc = await getIngredientByName(body.name);
    res.status(200);
    res.json(doc);
  }
});

app.patch('/ingredient', async (req: Request, res: Response) => {
  const body: Ingredient = req.body;
  const id: ObjectId = new ObjectId(body._id);
  let doc: Ingredient = await getIngredientById(id);
  if (doc) {
    // This will need to change
    await db.replace(DatabaseController.INGREDIENTS_COL, body);
    res.status(200);
    res.json(doc);
  } else {
    res.sendStatus(400);
  }
});

app.use(express.static('public'));

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});