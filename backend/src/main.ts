import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import {Ingredient, IngredientPreWrite, Recipe, RecipePreWrite} from "../../common/types";
import {ObjectId} from 'mongodb';
import { IngredientDatabaseController } from "./IngredientDatabaseController";
import { RecipeDatabaseController } from "./RecipeDatabaseController";

const app = express();
app.use(bodyParser.json())
const PORT = 8000;
const IngredientDBC = new IngredientDatabaseController();
const RecipeDBC = new RecipeDatabaseController();
IngredientDBC.initDb();
RecipeDBC.initDb();

app.get('/', (req: Request, res: Response) => res.redirect("/index.html"));

app.get('/ingredient/:id', async (req: Request, res: Response) => {
  console.log("Hit GET /ingredient/:id");
  const doc = await IngredientDBC.getById(req.params.id);
  if (doc) {
    res.status(200);
    res.json(doc);
  } else {
    res.sendStatus(404);
  }
});

app.get('/ingredients', async (req: Request, res: Response) => {
  console.log("Hit GET /ingredients");
  const all = await IngredientDBC.readAll();
  res.json(all);
});

app.delete('/ingredient/:id', async (req: Request, res: Response) => {
  console.log("Hit DELETE /ingredient/:id");
  const id: ObjectId = new ObjectId(req.params.id);
  const doc = await IngredientDBC.getById(req.params.id);
  if (doc) {
    await IngredientDBC.remove({_id:id});
    res.status(200);
    res.json(doc);
  } else {
    res.sendStatus(404);
  }
});

app.put('/ingredient', async (req: Request, res: Response) => {
  console.log("Hit PUT /ingredient");
  const body: IngredientPreWrite = req.body;
  let doc = await IngredientDBC.getByName(body.name);
  if (doc) {
    res.status(400);
  } else {
    await IngredientDBC.write(body);
    doc = await IngredientDBC.getByName(body.name);
    res.status(200);
    res.json(doc);
  }
});

app.patch('/ingredient', async (req: Request, res: Response) => {
  console.log("Hit PATCH /ingredient");
  const body: Ingredient = req.body;
  let doc = await IngredientDBC.getById(req.body._id);
  if (doc) {
    await IngredientDBC.replace(body);
    res.status(200);
    res.json(body); // Change if this ever is no longer valid
  } else {
    res.sendStatus(400);
  }
});

app.get('/recipe/:id', async (req: Request, res: Response) => {
  console.log("Hit GET /recipe/:id");
  const doc = await RecipeDBC.getById(req.params.id);
  if (doc) {
    res.status(200);
    res.json(doc);
  } else {
    res.sendStatus(404);
  }
});

app.get('/recipes', async (req: Request, res: Response) => {
  console.log("Hit GET /recipes");
  const all = await RecipeDBC.readRecipesInFull();
  res.json(all);
});

app.delete('/recipe/:id', async (req: Request, res: Response) => {
  console.log("Hit DELETE /recipe/:id");
  const id: ObjectId = new ObjectId(req.params.id);
  const doc = await RecipeDBC.getById(req.params.id);
  if (doc) {
    await RecipeDBC.remove({_id:id});
    res.status(200);
    res.json(doc);
  } else {
    res.sendStatus(404);
  }
});

app.put('/recipe', async (req: Request, res: Response) => {
  console.log("Hit PUT /recipe");
  console.log(req.body);
  const body: RecipePreWrite = req.body;
  let doc = await RecipeDBC.getByName(body.name);
  if (doc) {
    res.sendStatus(400);
  } else {
    const newBody = JSON.parse(JSON.stringify(body));
    newBody.ingredient_ids = body.ingredient_ids.map(x => new ObjectId(x));
    await RecipeDBC.write(newBody);
    doc = await RecipeDBC.getByName(body.name);
    console.log(doc);
    res.status(200);
    res.json(doc);
  }
});

app.patch('/recipe', async (req: Request, res: Response) => {
  console.log("Hit PATCH /recipe");
  const body: Recipe = req.body;
  let doc = await RecipeDBC.getById(req.body._id);
  if (doc) {
    await RecipeDBC.replace(body);
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