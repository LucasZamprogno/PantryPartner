import { UpdateWriteOpResult } from "mongodb";
import { Ingredient } from "../../../common/types";
import { DatabaseController } from "./DatabaseController";

export class IngredientDatabaseController extends DatabaseController<Ingredient> {
    constructor() {
        super(DatabaseController.INGREDIENTS_COL);
    }
    
    public async replace(doc: any): Promise<UpdateWriteOpResult> {
        const toUpdate = {
            name: doc.name,
            isStaple: doc.isStaple,
            isStocked: doc.isStocked
        }
        return super.replace(doc._id, toUpdate);
    }

    public async getByFilter(filter: any) {
        return await this.read(filter);
    }
}