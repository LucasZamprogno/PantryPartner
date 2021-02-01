import * as React from 'react';
import {Ingredient, IngredientPreWrite} from '../../../../common/types'
import $ from 'jquery';
import Collapse from "react-bootstrap/Collapse";

enum MetaState {
  default,
  editing,
  creating
}

interface IProps {
    data: Ingredient,
    initialState: MetaState,
    onDelete: (id: string) => void,
    onAdd: (ingredient: Ingredient) => void,
    onUpdate: (ingredient: Ingredient) => void,
}

interface IState extends Ingredient {
  expanded: boolean,
  metaState: MetaState
}

export default class IngredientComp extends React.Component<IProps, IState> {

    constructor(props: IProps) {
      super(props);
      const ingCopy = JSON.parse(JSON.stringify(this.props.data));
      ingCopy.expanded = false;
      ingCopy.metaState = props.initialState;
      this.state = ingCopy;
    }

    toggleExpanded = () => this.setState((state: IState, props: IProps) => {
      if (this.state.metaState === MetaState.editing) {
        return {expanded: true}; // Don't allow collapsing of editing, must save or cancel first
      }
      return {expanded: !state.expanded}
    })

    onEditClick= (event: any): void => {
      this.setState({metaState: MetaState.editing});
    }

    getIngredientFromState(): Ingredient {
      const ingredient: Ingredient = {
        _id: this.state._id,
        name: this.state.name,
        isStocked: this.state.isStocked,
        isStaple: this.state.isStaple
      }
      return ingredient;
    }

    getIngredientPreWriteFromState(): IngredientPreWrite {
      const ingredientPreWrite: IngredientPreWrite = {
        name: this.state.name,
        isStocked: this.state.isStocked,
        isStaple: this.state.isStaple
      }
      return ingredientPreWrite;
    }

    onStapleUpdate = (event: any): void => {
        this.setState({isStaple: event.target.checked});
    }

    onStockedUpdate = (event: any): void => {
        this.setState({isStocked: event.target.checked});
    }

    onDeleteClick = (event: any): void => {
      $.ajax({
          url: '/ingredient/' + this.props.data._id,
          type: 'DELETE',
          success: (result) => {
              this.props.onDelete(result._id);
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
          url: '/ingredient',
          type: 'PATCH',
          data: JSON.stringify(this.getIngredientFromState()),
          success: (result: Ingredient) => {
            this.setState(result);
            this.setState({metaState: MetaState.default});
          },
          error:(err) => {
              // TODO add proper error handling
              console.log(err); // And maybe a logging framework
          },
      });
    }

    onAddClick = (event: any): void => {
        $.ajax({
            contentType: 'application/json',
            dataType: 'json',
            url: '/ingredient/',
            type: 'PUT',
            data: JSON.stringify(this.getIngredientPreWriteFromState()),
            success: (result) => {
                this.props.onAdd(result);
            },
            error:(err) => {
                // TODO add proper error handling
                console.log(err); // And maybe a logging framework
            },
        });
    }

    onNameUpdate = (event: any): void => {
        this.setState({name: event.target.value});
    }

    renderHeading(): JSX.Element {
      let text: string;
      switch(this.state.metaState) {
        case MetaState.default:
          text = this.props.data.name;
          break;
        case MetaState.editing:
          text = `(Editing) ${this.props.data.name}`;
          break;
        case MetaState.creating:
          text = "Add new ingredient";
          break;
      }
      return <h5 className="card-title" onClick={this.toggleExpanded}>{text}</h5>
    }

    renderBody(): JSX.Element {
      const stapleId: string = this.props.data._id + "-staple";
      const stockedId: string = this.props.data._id + "-stocked";
      let disabled = false;
      let nameInput = <div>
          <input defaultValue={this.state.name} className="form-control" type="text" placeholder="Ingredient name" onChange={this.onNameUpdate} />
      </div>
      if (this.state.metaState === MetaState.default) {
        disabled = true;
        nameInput = <></>;
      }
      return (
        <>
        {nameInput}
        <div className="form-check">
          <input type="checkbox" disabled={disabled} defaultChecked={this.state.isStaple} className="form-check-input" id={stapleId} onChange={this.onStapleUpdate}/>
          <label className="form-check-label" htmlFor={stapleId}>Staple ingredient</label>
        </div>
        <div className="form-check">
          <input type="checkbox" disabled={disabled} defaultChecked={this.state.isStocked} className="form-check-input" id={stockedId} onChange={this.onStockedUpdate}/>
          <label className="form-check-label" htmlFor={stockedId}>Have stocked</label>
        </div>
        </>
      )
    }

    renderCRUDbuttons(): JSX.Element {
      switch(this.state.metaState) {
        case MetaState.default:
          return <button type="button" className="btn btn-outline-secondary p-1" onClick={this.onEditClick}>Edit</button>;
        case MetaState.editing:
          return (
          <>
            <button type="button" className="btn btn-outline-secondary p-1 mr-2" onClick={this.onDeleteClick}>Delete</button>
            <button type="button" className="btn btn-outline-secondary p-1" onClick={this.onUpdateClick}>Update</button>
          </>);
        case MetaState.creating:
          return (<div>
              <button className="btn btn-primary" onClick={this.onAddClick}>Add</button>
          </div>);
      }
    }

    render() {
      return (
      <div className="card my-1">
        <div className="card-body p-2">
          {this.renderHeading()}
          <Collapse in={this.state.expanded}>
            <div id={this.props.data._id}>
              {this.renderBody()}
              {this.renderCRUDbuttons()}
            </div>
          </Collapse>
        </div>
      </div>);
    }
  }