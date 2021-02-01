import { ObjectId } from "mongodb";

export interface MongoEntry {
    _id: string,
    name: string
}

export interface Ingredient extends MongoEntry {
    isStaple: boolean,
    isStocked: boolean
}

export type IngredientPreWrite = Omit<Ingredient, "_id">;

export interface Recipe extends MongoEntry {
    ingredient_ids: (string | ObjectId)[],
    ingredients: Ingredient[]
}

// I hate all this too
export type RecipeStored = Omit<Recipe, "ingredients">

export type RecipePreWrite = Omit<RecipeStored, "_id">