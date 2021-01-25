import * as React from 'react';
import IngredientComp from './IngredientComp';
import {Ingredient} from '../../../../common/types'
import FilterableListComp, {IProps} from '../FilterableListComp';
import IngredientAddComp from './IngredientAddComp';

export default class IngredientListComp extends FilterableListComp<Ingredient> {

    constructor(props: IProps<Ingredient>) {
      super(props);
    }

    makeComponent(ingredient: Ingredient): JSX.Element {
      return <IngredientComp callback={this.props.comHub['ingredient-remove']} key={ingredient._id} data={ingredient} />
    }

    filterCondition(ingredient: Ingredient): boolean {
      return ingredient.name.toLowerCase().includes(this.state.filterText.toLowerCase());
    }

    render() {
      return (
        <div>
          {this.renderList()}
          <div className="row">
            <IngredientAddComp callback={this.props.comHub['ingredient-add']}/>
          </div>
        </div>
      )
    }
  }