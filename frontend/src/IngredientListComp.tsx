import * as React from 'react';
import IngredientComp from './IngredientComp';
import {Ingredient} from '../../common/types'
import FilterableListComp, {IProps} from './FilterableListComp';
import $ from 'jquery';

export default class IngredientListComp extends FilterableListComp {

    constructor(props: IProps) {
      super(props);
      this.state = {}; // Why do I have to do this manually when extended?
    }

    componentDidMount(){ // Leave to sub class once sample done
        $.get("/ingredients").then((res: Array<Ingredient>) => {
            const elems = res.map(x => <IngredientComp data={x} />);
            this.setState({elements: elems});
        });
      }
  }