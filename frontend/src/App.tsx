import * as React from 'react';
import $ from 'jquery';
import { Ingredient, Recipe } from '../../common/types';
import IngredientListComp from './IngredientListComp';
import NavbarComp from './NavbarComp';
import RecipeListComp from './RecipeListComp';

export interface ComHub {
    "ingredient-add": (ingredient: Ingredient) => void,
    "ingredient-remove": (id: string) => void,
    "recipe-add": (recipe: Recipe) => void,
    "recipe-remove": (id: string) => void
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
          "recipe-add": this.onRecipeAdd,
          "recipe-remove": this.onRecipeRemove
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
        })
    }

    onIngredientRemove = (id: string) => {
      this.setState((state: IState, props: IProps) => {
        return {ingredients: state.ingredients.filter(x => x._id != id)}
      });
    };

    onIngredientAdd = (newElem: Ingredient) => {
      this.setState((state: IState, props: IProps) => {
        return {ingredients: state.ingredients.concat(newElem)};
      });
    };

    onRecipeRemove = (id: string) => {
        this.setState((state: IState, props: IProps) => {
            return {ingredients: state.recipes.filter(x => x._id != id)}
        });
    };
  
    onRecipeAdd = (newElem: Recipe) => {
        this.setState((state: IState, props: IProps) => {
            return {ingredients: state.recipes.concat(newElem)};
        });
    };

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
            </>
        )
    }
  }