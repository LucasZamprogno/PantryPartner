import * as React from 'react';
import {Recipe} from '../../../../common/types'
import FilterableListComp, {IProps} from '../FilterableListComp';
import { MetaState } from '../MainEntryComp';
import RecipeComp from '../Recipes/RecipeComp';

export default class SuggestedRecipeComp extends FilterableListComp<Recipe> {
    
  protected readonly orderOptions: string[] = [];
  protected readonly componentName: string = "RecipeSuggester";

    constructor(props: IProps<Recipe>) {
      super(props);
    }

    makeComponent(recipe: Recipe): JSX.Element {
      return <RecipeComp 
        initialState={MetaState.default} 
        onDelete={this.props.comHub['recipe-remove']} 
        key={recipe._id} data={recipe} 
        onAdd={this.props.comHub['recipe-add']} 
        getIngredients={this.props.comHub['get-ingredients']} 
        onUpdate={()=>{}}/>
    }

    filterCondition(recipe: Recipe): boolean {
      return recipe.name.toLowerCase().includes(this.state.filterText.toLowerCase());
    }

    getSortedList(list: Recipe[]): Recipe[] {
      return list.sort(this.recipeSuggesterSortCompareFn);
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
          {this.renderList()}
        </>
      )
    }
  }