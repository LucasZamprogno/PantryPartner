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
    ingredient_ids: string[]
}

export interface Recipe extends MongoEntry, IngredientPreWrite {}

export interface RecipeJoined extends Recipe {
    ingredients: Ingredient[]
}