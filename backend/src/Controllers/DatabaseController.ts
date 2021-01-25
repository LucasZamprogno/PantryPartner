import {Db, DeleteWriteOpResultObject, MongoClient, UpdateWriteOpResult, WriteOpResult} from "mongodb";
import { MongoEntry } from "../../../common/types";
import {ObjectId} from 'mongodb';

export interface MongoResponse {
    n: number,
    ok: number
}

export abstract class DatabaseController<T> {

    public static readonly INGREDIENTS_COL = 'ingredients';
    public static readonly RECIPE_COL = 'recipes';
    private readonly url = "mongodb://localhost:27017/mydb";
    protected col: string;
    protected db: Db | null = null;

    protected constructor(col: string) {
        this.col = col;
        console.log("DatabaseController init");
    }

    public async initDb(): Promise<void> {
        this.db = (await MongoClient.connect(this.url)).db()
    }

    public async write(doc: any): Promise<WriteOpResult> {
        return this.db!.collection(this.col).insertOne(doc);
    }

    public async read(query: any): Promise<T | null> {
        return this.db!.collection(this.col).findOne(query);
    }

    public async readAll(): Promise<T[]> {
        return this.db!.collection(this.col).find().toArray();
    }

    public async replace(doc: MongoEntry): Promise<UpdateWriteOpResult> {
        const id = new ObjectId(doc._id);
        const toUpdate = JSON.parse(JSON.stringify(doc));
        delete toUpdate._id;
        const changeOp = {$set: toUpdate};
        return this.db!.collection(this.col).updateOne({"_id": id}, changeOp);
    }

    public async set(query: any, prop: string, val: any): Promise<UpdateWriteOpResult> {
        const change = { $set: {[prop]: val}};
        return this.db!.collection(this.col).updateOne(query, change);
    }

    public async remove(query: any): Promise<DeleteWriteOpResultObject> {
        return this.db!.collection(this.col).deleteOne(query);
    }

    public async getByName(name: string): Promise<T | null> {
        return this.getByFilter({name:name});
    }
    
    public async getById(id: string): Promise<T | null> {
        return this.getByFilter({_id: new ObjectId(id)});
    }

    protected abstract getByFilter(filter: any): Promise<T | null>;
}