export interface MongoEntry {
    _id: string
}

export interface Ingredient extends MongoEntry {
    name: string
}