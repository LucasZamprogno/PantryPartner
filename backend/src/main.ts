import express, { Request, Response } from "express";
import { DatabaseController } from "./DatabaseController";

const app = express();
const PORT = 8000;
const db = DatabaseController.getInstance();
db.initDb();

app.get('/', (req: Request, res: Response) => res.redirect("/index.html"));
app.get('/ingredient/:name', async (req: Request, res: Response) => {
  await db.read(DatabaseController.INGREDIENTS_COL, {name:req.params.name});
  res.send(200);
});
app.get('/ingredients', async (req: Request, res: Response) => {
  const all = await db.readAll(DatabaseController.INGREDIENTS_COL);
  res.json(all);
});
app.delete('/ingredient/:name', async (req: Request, res: Response) => {
  await db.remove(DatabaseController.INGREDIENTS_COL, {name:req.params.name});
  res.send(200);
});
app.post('/ingredient/:name', async (req: Request, res: Response) => {
  await db.write(DatabaseController.INGREDIENTS_COL, {name:req.params.name});
  res.send(200);
});
app.patch('/ingredient/:name', async (req: Request, res: Response) => {
  await db.replace(DatabaseController.INGREDIENTS_COL, {name:req.params.name}, {name:req.params.name});
  res.send(200);
});

app.use(express.static('public'));

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});