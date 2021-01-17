import * as React from 'react';
import IngredientComp from './IngredientComp';
import {Ingredient} from '../../common/types'
import FilterableListComp, {IProps, IState} from './FilterableListComp';
import $ from 'jquery';
import SimpleAddComp from './SimpleAddComp';

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
            <SimpleAddComp callback={this.onElemAdd}/>
          </div>
        </div>
      )
    }
  }