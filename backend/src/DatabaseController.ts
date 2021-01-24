import {Db, MongoClient} from "mongodb";
import { MongoEntry, Recipe } from "../../common/types";
import {ObjectId} from 'mongodb';

export class DatabaseController {

    private static instance: DatabaseController = new DatabaseController(); // WARN: Called at import time
    private readonly url = "mongodb://localhost:27017/mydb";
    public static readonly INGREDIENTS_COL = 'ingredients';
    public static readonly RECIPE_COL = 'recipes';

    private db: Db | null = null;

    public async getByName(col: string, name: string) {
      return this.getByFilter(col, {name:name});
    }
    
    public async getById(col: string, id: string) {
        return this.getByFilter(col, {_id: new ObjectId(id)});
    }

    private async getByFilter(col: string, filter: any) {
        console.log(`DatabaseController: Getting by filter on ${col}`);
        if (col === DatabaseController.RECIPE_COL) {
          return (await this.readRecipesInFull(filter))[0];
        }
        return await this.read(col, filter);
    }
    
    public static getInstance() {
        return DatabaseController.instance;
    }

    private constructor() {
        console.log("DatabaseController init");
    }

    public async initDb() {
        this.db = (await MongoClient.connect(this.url)).db()
    }

    public async write(col: string, doc: any) {
        this.db!.collection(col).insertOne(doc);
    }

    public async read(col: string, query: any) {
        return this.db!.collection(col).findOne(query);
    }

    public async readAll(col: string) {
        return this.db!.collection(col).find().toArray();
    }

    public async replace(col: string, doc: MongoEntry) {
        const id = new ObjectId(doc._id);
        const toUpdate = JSON.parse(JSON.stringify(doc));
        delete toUpdate._id;
        const changeOp = {$set: toUpdate};
        this.db!.collection(col).updateOne({"_id": id}, changeOp);
    }

    public async set(col: string, query: any, prop: string, val: any) {
        const change = { $set: {[prop]: val}};
        this.db!.collection(col).updateOne(query, change);
    }

    public async remove(col: string, query: any) {
        this.db!.collection(col).deleteOne(query);
    }

    public async readRecipesInFull(filter?: any): Promise<Recipe[]> {
        const pipeline: any[] = [];
        if (filter) {
            pipeline.push({$match: filter});
        }
        pipeline.push({
            $lookup:
              {
                from: DatabaseController.INGREDIENTS_COL,
                localField: "ingredient_ids",
                foreignField: "_id",
                as: "ingredients"
              }
         });
         const res: Recipe[] | undefined = await this.db?.collection(DatabaseController.RECIPE_COL).aggregate(pipeline).toArray();
         return res ? res : [];
    }
}