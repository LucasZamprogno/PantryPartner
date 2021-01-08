import {Db, MongoClient} from "mongodb";

export class DatabaseController {

    private static instance: DatabaseController = new DatabaseController(); // WARN: Called at import time
    private readonly url = "mongodb://localhost:27017/mydb";
    public static readonly INGREDIENTS_COL = 'ingredients';

    private db: Db | null = null;
    
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


    public async replace(col: string, query: any, doc: any) {
        this.db!.collection(col).updateOne(query, doc);
    }

    public async set(col: string, query: any, prop: string, val: any) {
        const change = { $set: {[prop]: val}};
        this.db!.collection(col).updateOne(query, change);
    }

    public async remove(col: string, query: any) {
        this.db!.collection(col).deleteOne(query);
    }



}