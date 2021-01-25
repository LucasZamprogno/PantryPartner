import { Ingredient } from "../../common/types";
import { DatabaseController } from "./DatabaseController";

export class IngredientDatabaseController extends DatabaseController<Ingredient> {
    constructor() {
        super(DatabaseController.INGREDIENTS_COL);
    }

    public async getByFilter(filter: any) {
        return await this.read(filter);
    }
}