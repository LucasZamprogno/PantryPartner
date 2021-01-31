import {IRouter} from "./IRouter"
import {Request, Response} from "express";
import {Recipe, RecipePreWrite} from "../../../common/types";
import {ObjectId} from 'mongodb';
import {RecipeDatabaseController} from "../Controllers/RecipeDatabaseController";
import {IngredientDatabaseController} from "../Controllers/IngredientDatabaseController";

export default class RecipeRouter implements IRouter {
    private recipeDB: RecipeDatabaseController;
    private ingredientDB: IngredientDatabaseController;
    
    constructor() {
        this.recipeDB = new RecipeDatabaseController();
        this.recipeDB.initDb();
        this.ingredientDB = new IngredientDatabaseController();
        this.ingredientDB.initDb();
    }

    public addRoutes(app: any) {
        app.get('/ingredient/:id', async (req: Request, res: Response) => {
            console.log("Hit GET /ingredient/:id");
            const doc = await this.ingredientDB.getById(req.params.id);
            if (doc) {
                res.status(200);
                res.json(doc);
            } else {
                res.sendStatus(404);
        }
        });
        
        app.get('/recipe/:id', async (req: Request, res: Response) => {
            console.log("Hit GET /recipe/:id");
            const doc = await this.recipeDB.getById(req.params.id);
            if (doc) {
                res.status(200);
                res.json(doc);
            } else {
                res.sendStatus(404);
            }
        });
        
        app.get('/recipes', async (req: Request, res: Response) => {
            console.log("Hit GET /recipes");
            const all = await this.recipeDB.readRecipesInFull();
            res.json(all);
        });
        
        app.delete('/recipe/:id', async (req: Request, res: Response) => {
            console.log("Hit DELETE /recipe/:id");
            const id: ObjectId = new ObjectId(req.params.id);
            const doc = await this.recipeDB.getById(req.params.id);
            if (doc) {
                await this.recipeDB.remove({_id:id});
                res.status(200);
                res.json(doc);
            } else {
                res.sendStatus(404);
            }
        });
        
        app.put('/recipe', async (req: Request, res: Response) => {
            console.log("Hit PUT /recipe");
            const body: RecipePreWrite = req.body;
            let doc = await this.recipeDB.getByName(body.name);
            if (doc) {
                res.sendStatus(400);
            } else {
                await this.recipeDB.write(body);
                doc = await this.recipeDB.getByName(body.name);
                res.status(200);
                res.json(doc);
            }
        });
        
        app.patch('/recipe', async (req: Request, res: Response) => {
            console.log("Hit PATCH /recipe");
            const body: Recipe = req.body;
            let doc = await this.recipeDB.getById(req.body._id);
            if (doc) {
                await this.recipeDB.replace(body);
                doc = await this.recipeDB.getById(body._id);
                res.status(200);
                res.json(doc);
            } else {
                res.sendStatus(400);
            }
        });
    }
}