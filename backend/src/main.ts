import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import IngredientRouter from "./Routers/IngredientRouter";
import RecipeRouter from "./Routers/RecipeRouter";

const app = express();
app.use(bodyParser.json())
const PORT = 8000;
const ingredientRouter = new IngredientRouter();
const recipeRouter = new RecipeRouter();
ingredientRouter.addRoutes(app);
recipeRouter.addRoutes(app);

app.get('/', (req: Request, res: Response) => res.redirect("/index.html"));

app.use(express.static('public'));

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});