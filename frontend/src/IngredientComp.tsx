import * as React from 'react';
import {Ingredient} from '../../common/types'

interface IProps {
    data: Ingredient
}

interface IState {
}

export default class IngredientComp extends React.Component<IProps, IState> {
    render() {
      return <h1>{this.props.data.name}</h1>;
    }
  }