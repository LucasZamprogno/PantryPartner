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
    ingredients: string[]
}

export interface Recipe extends MongoEntry, IngredientPreWrite {}