import * as React from 'react';
import IngredientComp from './IngredientComp';
import {Ingredient} from '../../common/types'
import FilterableListComp, {IProps, IState} from './FilterableListComp';
import $ from 'jquery';
import SimpleAddComp from './SimpleAddComp';

export default class IngredientListComp extends FilterableListComp<Ingredient> {

    constructor(props: IProps) {
      super(props);
      // this.state = {
      //   elements: []
      // }; // Why do I have to do this manually when extended?
    }

    componentDidMount(){ // Leave to sub class once sample done
        $.get("/ingredients").then((res: Array<Ingredient>) => {
            this.setState({elements: res});
        });
    }

    makeComponent(ingredient: Ingredient) {
      return <IngredientComp callback={this.onElemRemove} key={ingredient._id} data={ingredient} />
    }

    render() {
      return (
        <div>
          {this.renderList()}
          <SimpleAddComp callback={this.onElemAdd}/>
        </div>
      )
    }
  }