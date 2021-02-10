import {IRouter} from "./IRouter"
import {Request, Response} from "express";
import {Ingredient, IngredientPreWrite} from "../../../common/types";
import {ObjectId} from 'mongodb';
import {IngredientDatabaseController} from "../Controllers/IngredientDatabaseController";
import { RecipeDatabaseController } from "../Controllers/RecipeDatabaseController";

export default class IngredientRouter implements IRouter {
    private recipeDB: RecipeDatabaseController;
    private ingredientDB: IngredientDatabaseController;

    constructor() {
        this.ingredientDB = new IngredientDatabaseController();
        this.ingredientDB.initDb();
        this.recipeDB = new RecipeDatabaseController();
        this.recipeDB.initDb();
    }

    private async doDelete(id_string: string, res: Response) {
      try {
        const id: ObjectId = new ObjectId(id_string);
        const doc = await this.ingredientDB.getById(id_string);
        if (doc) {
          await this.ingredientDB.remove({_id:id});
          res.status(200);
          res.json(doc);
        } else {
          res.sendStatus(404);
        }
      } catch (e) {
        console.log(`Error thrown: ${e}`);
        res.status(500);
        res.json({error: "Internal error deleting ingredient"});
      }

    }

    public addRoutes(app: any) {
        app.get('/ingredients', async (req: Request, res: Response) => {
          console.log("Hit GET /ingredients");
          try {
            const all = await this.ingredientDB.readAll();
            res.json(all);
          } catch (e) {
            console.log(`Error thrown: ${e}`);
            res.status(500);
            res.json({error: "Internal error getting ingredients"});
          }
        });
        
        app.delete('/ingredient/:id', async (req: Request, res: Response) => {
          console.log("Hit DELETE /ingredient/:id");
          await this.doDelete(req.params.id, res);
        });
        
        app.put('/ingredient', async (req: Request, res: Response) => {
          console.log("Hit PUT /ingredient");
          try {
            const body: IngredientPreWrite = req.body;
            let doc = await this.ingredientDB.getByName(body.name);
            if (doc) {
              res.status(400);
            } else {
              await this.ingredientDB.write(body);
              doc = await this.ingredientDB.getByName(body.name);
              res.status(200);
              res.json(doc);
            }
          } catch (e) {
            console.log(`Error thrown: ${e}`);
            res.status(500);
            res.json({error: "Internal error adding ingredient"});
          }
        });
        
        app.patch('/ingredient', async (req: Request, res: Response) => {
          console.log("Hit PATCH /ingredient");
          try {
            const body: Ingredient = req.body;
            let doc = await this.ingredientDB.getById(req.body._id);
            if (doc) {
              await this.ingredientDB.replace(body);
              let saved = await this.ingredientDB.getById(req.body._id);
              res.status(200);
              res.json(saved); // Change if this ever is no longer valid
            } else {
              res.sendStatus(400);
            }
          } catch (e) {
            console.log(`Error thrown: ${e}`);
            res.status(500);
            res.json({error: "Internal error updating ingredient"});
          }
        });

        app.delete('/ingredient/safe/:id', async (req: Request, res: Response) => {
          console.log("Hit DELETE /ingredient/safe/:id");
          const id = new ObjectId(req.params.id);
          const usedIn = await this.recipeDB.getRecipcesThatUseIngredient(id);
          if (typeof usedIn !== 'undefined' && usedIn.length > 0) {
            res.status(400);
            res.json({usedIn: usedIn.map(x => x.name)});
          } else {
            await this.doDelete(req.params.id, res);
          }
        });
    }
}