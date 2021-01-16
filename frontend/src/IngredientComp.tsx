import * as React from 'react';
import {Ingredient} from '../../common/types'
import $ from 'jquery';

interface IProps {
    data: Ingredient,
    callback: (id: string) => void
}

interface IState {
}

export default class IngredientComp extends React.Component<IProps, IState> {

    onButtonClick = (event: any) => {
      $.ajax({
          url: '/ingredient/' + this.props.data._id,
          type: 'DELETE',
          success: (result) => {
              this.props.callback(result._id);
          },
          error:(err) => {
              // TODO add proper error handling
              console.log(err); // And maybe a logging framework
          },
      });
    }
    render() {
      return (
      <div>
        <h1>{this.props.data.name}</h1>
        <button onClick={this.onButtonClick}>Delete</button>
      </div>);
    }
  }