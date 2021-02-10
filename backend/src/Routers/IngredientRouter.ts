import {IRouter} from "./IRouter"
import {Request, Response} from "express";
import {Ingredient, IngredientPreWrite} from "../../../common/types";
import {ObjectId} from 'mongodb';
import {IngredientDatabaseController} from "../Controllers/IngredientDatabaseController";

export default class IngredientRouter implements IRouter {
    private ingredientDB: IngredientDatabaseController;

    constructor() {
        this.ingredientDB = new IngredientDatabaseController();
        this.ingredientDB.initDb();
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
          try {
            const id: ObjectId = new ObjectId(req.params.id);
            const doc = await this.ingredientDB.getById(req.params.id);
            if (doc) {
              throw "aaaaa";
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
    }
}