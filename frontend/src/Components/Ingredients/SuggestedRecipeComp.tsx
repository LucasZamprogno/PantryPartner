import * as React from 'react';
import {Recipe} from '../../../../common/types'
import FilterableListComp, {IProps} from '../FilterableListComp';
import { MetaState } from '../MainEntryComp';
import RecipeComp from '../Recipes/RecipeComp';

export default class SuggestedRecipeComp extends FilterableListComp<Recipe> {

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

    render() {
      return (
        <>
          {this.renderList()}
        </>
      )
    }
  }