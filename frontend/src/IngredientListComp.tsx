import * as React from 'react';
import IngredientComp from './IngredientComp';
import {Ingredient} from '../../common/types'
import FilterableListComp, {IProps, IState} from './FilterableListComp';
import $ from 'jquery';
import SimpleAddComp from './SimpleAddComp';

export default class IngredientListComp extends FilterableListComp {

    constructor(props: IProps) {
      super(props);
      this.state = {
        elements: []
      }; // Why do I have to do this manually when extended?
    }

    onElemRemove = (id: string) => {
      // TODO
      this.setState((state: IState, props: IProps) => {elements: state.elements.filter(x => x._id != id)});
    };

    onElemAdd = (newElem: any) => {
      const withNew = this.state.elements.concat(newElem) // TODO MAKE SURE THIS DATA IS CORRECT
      this.setState((state: IState, props: IProps) => {elements: withNew});
    };

    componentDidMount(){ // Leave to sub class once sample done
        $.get("/ingredients").then((res: Array<Ingredient>) => {
            this.setState({elements: res});
        });
    }

    makeIngredient(ingredient: Ingredient) {
      return <IngredientComp callback={this.onElemRemove} key={ingredient._id} data={ingredient} />
    }

    render() {
      return (
        <div>
          {this.state.elements.map(x => this.makeIngredient(x))}
          <SimpleAddComp callback={this.onElemAdd}/>
        </div>
      )
    }
  }