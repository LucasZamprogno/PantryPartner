import * as React from 'react';
import {Recipe} from '../../common/types'
import $ from 'jquery';
import Collapse from "react-bootstrap/Collapse";

interface IProps {
    data: Recipe,
    callback: (id: string) => void
}

interface IState extends Recipe {
  expanded: boolean
}

export default class RecipeComp extends React.Component<IProps, IState> {

    constructor(props: IProps) {
      super(props);
      const ingCopy = JSON.parse(JSON.stringify(this.props.data));
      ingCopy.expanded = false;
      this.state = ingCopy;
    }

    getRecipeFromState(): Recipe {
      const stateCopy = JSON.parse(JSON.stringify(this.props.data));
      delete stateCopy.expanded;
      return stateCopy;
    }

    onDeleteClick = (event: any): void => {
      $.ajax({
          url: '/recipe/' + this.props.data._id,
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
    
    onUpdateClick = (event: any): void => {
      $.ajax({
          contentType: 'application/json',
          dataType: 'json',
          url: '/recipe',
          type: 'PATCH',
          data: JSON.stringify(this.getRecipeFromState()),
          success: (result: Recipe) => {
            this.setState(result);
          },
          error:(err) => {
              // TODO add proper error handling
              console.log(err); // And maybe a logging framework
          },
      });
    }

    render() {
      return (
      <div className="card my-1">
        <div className="card-body p-2">
          <h5 className="card-title" onClick={() => this.setState((state: IState, props: IProps) => {return {expanded: !state.expanded}})}>{this.props.data.name}</h5>
          <Collapse in={this.state.expanded}>
            <div id={this.props.data._id}>
            </div>
          </Collapse>
        </div>
      </div>);
    }
  }