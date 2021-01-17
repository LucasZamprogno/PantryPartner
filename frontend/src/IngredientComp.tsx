import * as React from 'react';
import {Ingredient} from '../../common/types'
import $, { data } from 'jquery';

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
      const stapleId: string = this.props.data._id + "-staple";
      const stockedId: string = this.props.data._id + "-stocked";
      return (
      <div className="card my-1">
        <div className="card-body p-2">
          <h5 className="card-title">{this.props.data.name}</h5>
          <div className="form-check">
            <input type="checkbox" defaultChecked={this.props.data.isStaple} className="form-check-input" id={stapleId}/>
            <label className="form-check-label" htmlFor={stapleId}>Staple ingredient</label>
          </div>
          <div className="form-check">
            <input type="checkbox" defaultChecked={this.props.data.isStocked} className="form-check-input" id={stockedId}/>
            <label className="form-check-label" htmlFor={stockedId}>Have stocked</label>
          </div>
          <button type="button" className="btn btn-outline-secondary p-1" onClick={this.onButtonClick}>Delete</button>
        </div>
      </div>);
    }
  }