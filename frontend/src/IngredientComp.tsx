import * as React from 'react';
import {Ingredient} from '../../common/types'
import $ from 'jquery';

interface IProps {
    data: Ingredient,
    callback: (id: string) => void
}

export default class IngredientComp extends React.Component<IProps, Ingredient> {

    constructor(props: IProps) {
      super(props);
      this.state = props.data;
    }

    onStapleUpdate = (event: any) => {
        this.setState({isStaple: event.target.checked});
    }

    onStockedUpdate = (event: any) => {
        this.setState({isStocked: event.target.checked});
    }

    onDeleteClick = (event: any) => {
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
    
    onUpdateClick = (event: any) => {
      $.ajax({
          contentType: 'application/json',
          dataType: 'json',
          url: '/ingredient',
          type: 'PATCH',
          data: JSON.stringify(this.state),
          success: (result: Ingredient) => {
            this.setState(result);
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
            <input type="checkbox" defaultChecked={this.state.isStaple} className="form-check-input" id={stapleId}  onChange={this.onStapleUpdate}/>
            <label className="form-check-label" htmlFor={stapleId}>Staple ingredient</label>
          </div>
          <div className="form-check">
            <input type="checkbox" defaultChecked={this.state.isStocked} className="form-check-input" id={stockedId}  onChange={this.onStockedUpdate}/>
            <label className="form-check-label" htmlFor={stockedId}>Have stocked</label>
          </div>
          <button type="button" className="btn btn-outline-secondary p-1 mr-2" onClick={this.onDeleteClick}>Delete</button>
          <button type="button" className="btn btn-outline-secondary p-1" onClick={this.onUpdateClick}>Update</button>
        </div>
      </div>);
    }
  }