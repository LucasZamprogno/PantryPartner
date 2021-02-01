import * as React from 'react';
import IngredientComp from './IngredientComp';
import {Ingredient} from '../../../../common/types'
import FilterableListComp, {IProps} from '../FilterableListComp';
import IngredientAddComp from './IngredientAddComp';
import { MetaState } from '../Recipes/RecipeComp';

export default class IngredientListComp extends FilterableListComp<Ingredient> {

    constructor(props: IProps<Ingredient>) {
      super(props);
    }

    makeComponent(ingredient: Ingredient): JSX.Element {
      return <IngredientComp initialState={MetaState.default} onDelete={this.props.comHub['ingredient-remove']} onAdd={this.props.comHub['ingredient-add']} onUpdate={()=>{}} key={ingredient._id} data={ingredient} />
    }

    filterCondition(ingredient: Ingredient): boolean {
      return ingredient.name.toLowerCase().includes(this.state.filterText.toLowerCase());
    }

    render() {
      const ingredient: Ingredient = {
        _id: "",
        name: "",
        isStaple: false,
        isStocked: false
      }
      return (
        <>
          {this.renderList()}
          <IngredientComp initialState={MetaState.creating} onDelete={this.props.comHub['ingredient-remove']} onAdd={this.props.comHub['ingredient-add']} onUpdate={()=>{}} key={ingredient._id} data={ingredient} />
        </>
      )
    }
  }