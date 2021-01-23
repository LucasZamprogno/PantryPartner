import * as React from 'react';
import IngredientComp from './IngredientComp';
import {Ingredient} from '../../common/types'
import FilterableListComp, {IProps} from './FilterableListComp';
import $ from 'jquery';
import IngredientAddComp from './IngredientAddComp';

export default class IngredientListComp extends FilterableListComp<Ingredient> {

    constructor(props: IProps) {
      super(props);
    }

    componentDidMount(){ // Leave to sub class once sample done
        $.get("/ingredients").then((res: Array<Ingredient>) => {
            this.setState({elements: res});
        });
    }

    makeComponent(ingredient: Ingredient) {
      return <IngredientComp callback={this.onElemRemove} key={ingredient._id} data={ingredient} />
    }

    filterCondition(ingredient: Ingredient) {
      return ingredient.name.toLowerCase().includes(this.state.filterText.toLowerCase());
    }

    render() {
      return (
        <div>
          {this.renderList()}
          <div className="row">
            <IngredientAddComp callback={this.onElemAdd}/>
          </div>
        </div>
      )
    }
  }