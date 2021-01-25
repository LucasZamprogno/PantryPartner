import {Recipe} from "../../../common/types";
import {DatabaseController} from "./DatabaseController";

export class RecipeDatabaseController extends DatabaseController<Recipe> {
    constructor() {
        super(DatabaseController.RECIPE_COL);
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

    public async getByFilter(filter: any) {
        return (await this.readRecipesInFull(filter))[0];
    }
}
//return await this.read(filter);