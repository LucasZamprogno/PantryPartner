import * as React from 'react';
import {Ingredient} from '../../../../common/types'
import FilterableListComp, {IProps} from '../FilterableListComp';
import { MetaState } from '../MainEntryComp';
import IngredientComp from './IngredientComp';

export default class IngredientListComp extends FilterableListComp<Ingredient> {
    
  protected readonly orderOptions: string[] = ["Name", "Created"];
  protected readonly componentName: string = "IngredientList";

    constructor(props: IProps<Ingredient>) {
      super(props);
    }

    makeComponent(ingredient: Ingredient): JSX.Element {
      return <IngredientComp 
        initialState={MetaState.default} 
        onDelete={this.props.comHub['ingredient-remove']} 
        onAdd={this.props.comHub['ingredient-add']} 
        onUpdate={()=>{}} key={ingredient._id} 
        data={ingredient} />
    }

    filterCondition(ingredient: Ingredient): boolean {
      return ingredient.name.toLowerCase().includes(this.state.filterText.toLowerCase());
    }

    getSortedList(list: Ingredient[]): Ingredient[] {
      if (this.state.sortOrder === "Name") {
        return list.sort((a, b) => a.name < b.name ? -1 : 1);
      } else {
        return list;
      }
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
          <IngredientComp 
          initialState={MetaState.creating} 
          onDelete={this.props.comHub['ingredient-remove']} 
          onAdd={this.props.comHub['ingredient-add']} 
          onUpdate={()=>{}} key={ingredient._id} 
          data={ingredient} />
        </>
      )
    }
  }