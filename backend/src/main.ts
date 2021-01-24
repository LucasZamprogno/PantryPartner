import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import {Ingredient, IngredientPreWrite, Recipe, RecipePreWrite} from "../../common/types";
import { DatabaseController } from "./DatabaseController";
import {ObjectId} from 'mongodb';

const app = express();
app.use(bodyParser.json())
const PORT = 8000;
const db = DatabaseController.getInstance();
db.initDb();

app.get('/', (req: Request, res: Response) => res.redirect("/index.html"));

app.get('/ingredient/:id', async (req: Request, res: Response) => {
  const doc: Ingredient = await db.getById(DatabaseController.INGREDIENTS_COL, req.params.id);
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
  const doc: Ingredient = await db.getById(DatabaseController.INGREDIENTS_COL, req.params.id);
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
  let doc: Ingredient = await db.getByName(DatabaseController.INGREDIENTS_COL, body.name);
  if (doc) {
    res.status(400);
  } else {
    await db.write(DatabaseController.INGREDIENTS_COL, body);
    doc = await db.getByName(DatabaseController.INGREDIENTS_COL, body.name);
    res.status(200);
    res.json(doc);
  }
});

app.patch('/ingredient', async (req: Request, res: Response) => {
  const body: Ingredient = req.body;
  let doc: Ingredient = await db.getById(DatabaseController.INGREDIENTS_COL, req.body._id);
  if (doc) {
    await db.replace(DatabaseController.INGREDIENTS_COL, body);
    res.status(200);
    res.json(body); // Change if this ever is no longer valid
  } else {
    res.sendStatus(400);
  }
});

app.get('/recipe/:id', async (req: Request, res: Response) => {
  const doc: Ingredient = await db.getById(DatabaseController.RECIPE_COL, req.params.id);
  if (doc) {
    res.status(200);
    res.json(doc);
  } else {
    res.sendStatus(404);
  }
});

app.get('/recipes', async (req: Request, res: Response) => {
  const all = await db.readRecipesInFull();
  res.json(all);
});

app.delete('/recipe/:id', async (req: Request, res: Response) => {
  const id: ObjectId = new ObjectId(req.params.id);
  const doc: Ingredient = await db.getById(DatabaseController.RECIPE_COL, req.params.id);
  if (doc) {
    await db.remove(DatabaseController.RECIPE_COL, {_id:id});
    res.status(200);
    res.json(doc);
  } else {
    res.sendStatus(404);
  }
});

app.put('/recipe', async (req: Request, res: Response) => {
  const body: RecipePreWrite = req.body;
  let doc: Recipe = await db.getByName(DatabaseController.RECIPE_COL, body.name);
  if (doc) {
    res.status(400);
  } else {
    const newBody = JSON.parse(JSON.stringify(body));
    newBody.ingredients = body.ingredients.map(x => new ObjectId(x));
    await db.write(DatabaseController.RECIPE_COL, newBody);
    doc = await db.getByName(DatabaseController.RECIPE_COL, body.name);
    res.status(200);
    res.json(doc);
  }
});

app.patch('/recipe', async (req: Request, res: Response) => {
  const body: Recipe = req.body;
  let doc: Recipe = await db.getById(DatabaseController.RECIPE_COL, req.body._id);
  if (doc) {
    await db.replace(DatabaseController.RECIPE_COL, body);
    res.status(200);
    res.json(req.body); // Change if this ever is no longer valid
  } else {
    res.sendStatus(400);
  }
});
app.use(express.static('public'));

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});