import { ObjectId } from "mongodb";

export interface MongoEntry {
    _id: string
}

export interface IngredientPreWrite {
    name: string,
    isStaple: boolean,
    isStocked: boolean
}

export interface Ingredient extends MongoEntry, IngredientPreWrite {}

export interface RecipePreWrite {
    name: string,
    ingredient_ids: (string | ObjectId)[]
}

export interface Recipe extends MongoEntry, RecipePreWrite {}

export interface RecipeJoined extends Recipe {
    ingredients: Ingredient[]
}