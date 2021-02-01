import * as React from 'react';
import RecipeComp from './RecipeComp';
import {Recipe, RecipeJoined} from '../../../../common/types'
import FilterableListComp, {IProps} from '../FilterableListComp';
import {MetaState} from './RecipeComp';

export default class RecipeListComp extends FilterableListComp<Recipe> {

    constructor(props: IProps<Recipe>) {
      super(props);
    }

    makeComponent(recipe: Recipe): JSX.Element {
      return <RecipeComp initialState={MetaState.default} onDelete={this.props.comHub['recipe-remove']} key={recipe._id} data={recipe}  options={this.props.altElements!} onAdd={this.props.comHub['recipe-add']} onUpdate={()=>{}}/>
    }

    filterCondition(recipe: Recipe): boolean {
      return recipe.name.toLowerCase().includes(this.state.filterText.toLowerCase());
    }

    render() {
      const recipe: RecipeJoined = {
        _id: "",
        name: "",
        ingredient_ids: [],
        ingredients: []
      }
      return (
        <>
          {this.renderList()}
          <RecipeComp initialState={MetaState.creating} onDelete={this.props.comHub['recipe-remove']} key={recipe._id} data={recipe}  options={this.props.altElements!} onAdd={this.props.comHub['recipe-add']} onUpdate={()=>{}}/>
        </>
      )
    }
  }
  //<RecipeAddComp options={this.props.altElements!} callback={this.props.comHub['recipe-add']}/>