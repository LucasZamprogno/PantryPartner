import * as React from 'react';
import RecipeComp from './RecipeComp';
import {Recipe} from '../../../../common/types'
import FilterableListComp, {IProps} from '../FilterableListComp';
import RecipeAddComp from './RecipeAddComp';

export default class RecipeListComp extends FilterableListComp<Recipe> {

    constructor(props: IProps<Recipe>) {
      super(props);
    }

    makeComponent(recipe: Recipe): JSX.Element {
      return <RecipeComp onDelete={this.props.comHub['recipe-remove']} key={recipe._id} data={recipe}  options={this.props.altElements!} onAdd={this.props.comHub['recipe-add']} onUpdate={()=>{}}/>
    }

    filterCondition(recipe: Recipe): boolean {
      return recipe.name.toLowerCase().includes(this.state.filterText.toLowerCase());
    }

    render() {
      return (
        <div>
          {this.renderList()}
          <div className="row">
            <RecipeAddComp options={this.props.altElements!} callback={this.props.comHub['recipe-add']}/>
          </div>
        </div>
      )
    }
  }