import {IRouter} from "./IRouter"
import {Request, Response} from "express";
import {Recipe, RecipePreWrite, RecipeStored} from "../../../common/types";
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
        app.get('/recipe/:id', async (req: Request, res: Response) => {
            console.log("Hit GET /recipe/:id");
            try {
                const doc = await this.recipeDB.getById(req.params.id);
                if (doc) {
                    res.status(200);
                    res.json(doc);
                } else {
                    res.sendStatus(404);
                }
            } catch (e) {
              console.log(`Error thrown: ${e}`);
              res.status(500);
              res.json({error: "Internal error getting recipe"});
            }
        });
        
        app.get('/recipes', async (req: Request, res: Response) => {
            try {
                console.log("Hit GET /recipes");
                const all = await this.recipeDB.readRecipesInFull();
                res.json(all);
            } catch (e) {
              console.log(`Error thrown: ${e}`);
              res.status(500);
              res.json({error: "Internal error getting recipes"});
            }
        });
        
        app.delete('/recipe/:id', async (req: Request, res: Response) => {
            console.log("Hit DELETE /recipe/:id");
            try {
                const id: ObjectId = new ObjectId(req.params.id);
                const doc = await this.recipeDB.getById(req.params.id);
                if (doc) {
                    await this.recipeDB.remove({_id:id});
                    res.status(200);
                    res.json(doc);
                } else {
                    res.sendStatus(404);
                }
            } catch (e) {
              console.log(`Error thrown: ${e}`);
              res.status(500);
              res.json({error: "Internal error deleting recipe"});
            }
        });
        
        app.put('/recipe', async (req: Request, res: Response) => {
            console.log("Hit PUT /recipe");
            try {
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
            } catch (e) {
              console.log(`Error thrown: ${e}`);
              res.status(500);
              res.json({error: "Internal error adding recipe"});
            }
        });
        
        app.patch('/recipe', async (req: Request, res: Response) => {
            console.log("Hit PATCH /recipe");
            try {
                const body: RecipeStored = req.body;
                let doc = await this.recipeDB.getById(req.body._id);
                if (doc) {
                    await this.recipeDB.replace(body);
                    doc = await this.recipeDB.getById(body._id);
                    res.status(200);
                    res.json(doc);
                } else {
                    res.sendStatus(400);
                }
            } catch (e) {
              console.log(`Error thrown: ${e}`);
              res.status(500);
              res.json({error: "Internal error updating recipe"});
            }
        });
    }
}