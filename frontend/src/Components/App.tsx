import * as React from 'react';
import $ from 'jquery';
import { Ingredient, Recipe } from '../../../common/types';
import IngredientListComp from './Ingredients/IngredientListComp';
import NavbarComp from './NavbarComp';
import RecipeListComp from './Recipes/RecipeListComp';
import ShoppingListComp from './Ingredients/ShoppingListComp';
import SuggestedRecipeComp from './Ingredients/SuggestedRecipeComp';

export interface ComHub {
    "ingredient-add": (ingredient: Ingredient) => void,
    "ingredient-remove": (id: string) => void,
    "ingredient-update": (ingredient: Ingredient) => void,
    "recipe-add": (recipe: Recipe) => void,
    "recipe-remove": (id: string) => void,
    "get-ingredients": () => Ingredient[]
}

export interface IProps {
}

export interface IState {
  ingredients: Ingredient[],
  recipes: Recipe[]
}

export default class App extends React.Component<IProps, IState> {
    private comHub: ComHub;

    constructor(props: IProps) {
      super(props)
      this.state = {
        ingredients: [],
        recipes: []
      }
      this.comHub = {
          "ingredient-add": this.onIngredientAdd,
          "ingredient-remove": this.onIngredientRemove,
          "ingredient-update": this.onIngredientUpdate,
          "recipe-add": this.onRecipeAdd,
          "recipe-remove": this.onRecipeRemove,
          "get-ingredients": this.getCurrentIngredients
      }
    }

    componentDidMount() {
        const getIngredients = $.get("/ingredients");
        const getRecipes = $.get("/recipes");
        Promise.all([getIngredients, getRecipes]).then((res) => {
            this.setState({
                ingredients: res[0],
                recipes: res[1]
            })
        }).catch((err: any) => {
            let str = "Error while fetching data on startup";
            if (err["error"]) {
                str += `: ${err["error"]}`;
            }
            alert(str);
        })
    }

    onIngredientRemove = (id: string): void => {
      this.setState((state: IState, props: IProps) => {
        return {ingredients: state.ingredients.filter(x => x._id != id)}
      });
    };

    onIngredientAdd = (newElem: Ingredient): void => {
      this.setState((state: IState, props: IProps) => {
        return {ingredients: state.ingredients.concat(newElem)};
      });
    };

    onIngredientUpdate = (updatedElem: Ingredient): void => {
      this.setState((state: IState, props: IProps) => {
        const copy = JSON.parse(JSON.stringify(state.ingredients));
        for (const index in copy) {
          if (copy[index].name === updatedElem.name) {
            copy[index] = updatedElem;
          }
        }
        return {ingredients: copy};
      });
    };

    onRecipeRemove = (id: string): void => {
        this.setState((state: IState, props: IProps) => {
            return {recipes: state.recipes.filter(x => x._id != id)}
        });
    };
  
    onRecipeAdd = (newElem: Recipe): void => {
        console.log(newElem);
        this.setState((state: IState, props: IProps) => {
            return {recipes: state.recipes.concat(newElem)};
        });
    };

    getCurrentIngredients = (): Ingredient[] => {
      return JSON.parse(JSON.stringify(this.state.ingredients)); // Copy to prevent modification
    };

    public getShoppingList(): Ingredient[] {
        const notStocked: Ingredient[] = this.state.ingredients.filter(x => x.isStocked === false);
        notStocked.sort(this.shoppingSortCompareFn);
        return notStocked;
    }

    public getRecipeSuggestList(): Recipe[] {
        const copy: Recipe[] = JSON.parse(JSON.stringify(this.state.recipes));
        return copy.sort(this.recipeSuggesterSortCompareFn);
    }

    private shoppingSortCompareFn(a: Ingredient, b: Ingredient) {
        if (a.isStaple && !b.isStaple) {
            return -1;
        } else if (b.isStaple && !a.isStaple) {
            return 1;
        } else {
            return a.name < b.name ? -1 : 1;
        }
    }

    private recipeSuggesterSortCompareFn(a: Recipe, b: Recipe) {
        const numIngredientsUnstocked = (recipe: Recipe) => {return recipe.ingredients.filter(x => !x.isStocked).length;};
        const numUnstockedA = numIngredientsUnstocked(a);
        const numUnstockedB = numIngredientsUnstocked(b);
        if (numUnstockedA < numUnstockedB) {
            return -1;
        } else if (numUnstockedB < numUnstockedA) {
            return 1;
        } else {
            return a.name < b.name ? -1 : 1;
        }
    }

    render() {
        return (
            <>
            <NavbarComp />
            <div className="row justify-content-center active" id="ingredients">
                <div className="col-10"><IngredientListComp elements={this.state.ingredients} comHub={this.comHub}/></div>
            </div>
            <div className="row justify-content-center d-none" id="recipes">
                <div className="col-10"><RecipeListComp elements={this.state.recipes} altElements={this.state.ingredients} comHub={this.comHub} /></div>
            </div>
            <div className="row justify-content-center d-none" id="shopping">
                <div className="col-10"><ShoppingListComp elements={this.getShoppingList()} comHub={this.comHub} /></div>
            </div>
            <div className="row justify-content-center d-none" id="suggester">
                <div className="col-10"><SuggestedRecipeComp elements={this.getRecipeSuggestList()} comHub={this.comHub} /></div>
            </div>
            </>
        )
    }
  }