import * as React from 'react';
import {Ingredient} from '../../../../common/types'
import FilterableListComp, {IProps} from '../FilterableListComp';
import { MetaState } from '../MainEntryComp';
import IngredientComp from './IngredientComp';

export default class ShoppingListComp extends FilterableListComp<Ingredient> {

    constructor(props: IProps<Ingredient>) {
      super(props);
    }

    makeComponent(ingredient: Ingredient): JSX.Element {
      return <IngredientComp 
        initialState={MetaState.default} 
        onDelete={this.props.comHub['ingredient-remove']} 
        onAdd={this.props.comHub['ingredient-add']} 
        onUpdate={this.props.comHub['ingredient-update']} 
        key={ingredient._id} 
        data={ingredient} />
    }

    filterCondition(ingredient: Ingredient): boolean {
      return ingredient.name.toLowerCase().includes(this.state.filterText.toLowerCase());
    }

    render() {
      return (
        <>
          {this.renderList()}
        </>
      )
    }
  }