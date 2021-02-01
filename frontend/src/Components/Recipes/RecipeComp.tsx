import * as React from 'react';
import {Ingredient, Recipe, RecipeJoined, RecipePreWrite} from '../../../../common/types'
import $ from 'jquery';
import Collapse from "react-bootstrap/Collapse";

export enum MetaState {
  default,
  editing,
  creating
}

interface IProps {
    data: Recipe,
    options: Ingredient[],
    initialState: MetaState,
    onDelete: (id: string) => void,
    onAdd: (recipe: Recipe) => void,
    onUpdate: (recipe: Recipe) => void,
}

interface IState extends RecipeJoined {
  expanded: boolean,
  metaState: MetaState
}

export default class RecipeComp extends React.Component<IProps, IState> {

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

    // Edit and add // 

    onIngredientDelete = (event: any): void => {
        const id = event.target.getAttribute("data-id");
        this.setState((state: IState, props: IProps) => {
          return {ingredients: state.ingredients.filter(x => x._id != id)}
        });
    }

    // Edit related //
    getRecipeFromState(): Recipe {
      const recipeData: Recipe = {
        _id: this.state._id,
        name: this.state.name,
        ingredient_ids: this.state.ingredients.map(x => x._id)
      };
      return recipeData;
    }

    onEditClick= (event: any): void => {
      this.setState({metaState: MetaState.editing});
    }

    onDeleteClick = (event: any): void => {
      $.ajax({
          url: '/recipe/' + this.props.data._id,
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
          url: '/recipe',
          type: 'PATCH',
          data: JSON.stringify(this.getRecipeFromState()),
          success: (result: Recipe) => {
            this.setState(result);
            this.setState({metaState: MetaState.default});
          },
          error:(err) => {
              // TODO add proper error handling
              console.log(err); // And maybe a logging framework
          },
      });
    }

    // Add related //
    onNameUpdate = (event: any): void => {
        this.setState({name: event.target.value});
    }

    onIngredientAdd = (event: any): void => {
        this.setState((state: IState, props: IProps) => {
            const selector = $("#ingredientSelector");
            const selectedName = selector.val();
            for (const elem of this.props.options) {
                if (elem.name === selectedName) {
                    const withNew = state.ingredients.concat(elem);
                    selector.val("");
                    return {ingredients: withNew};
                }
            }
            return {ingredients: state.ingredients};
            // TODO error handle
        });
    }

    getRecipePreWriteFromState(): RecipePreWrite {
        const name = this.state.name;
        const ingredient_ids = this.state.ingredients.map(x => x._id);
        return {
            name: name,
            ingredient_ids: ingredient_ids
        };
    }

    onAddClick = (event: any): void => {
        $.ajax({
            contentType: 'application/json',
            dataType: 'json',
            url: '/recipe/',
            type: 'PUT',
            data: JSON.stringify(this.getRecipePreWriteFromState()),
            success: (result) => {
                this.props.onAdd(result);
            },
            error:(err) => {
                // TODO add proper error handling
                console.log(err); // And maybe a logging framework
            },
        });
    }

    // Rendering // 
    liRef(id: string) {
      return `add-rec-li-${id}`;
    }

    makeOptionList(): JSX.Element {
        const options = this.props.options.map(x => (<option value={x.name}/>))
        return (
            <datalist id="suggestions">
                {options}
            </datalist>
        )
    }

    makeIngredientsList(): JSX.Element {
        return (
        <ul>
            {this.state.ingredients.map(x => this.makeIngredientListItem(x))}
        </ul>
        )
    }

    // These switches are like the world's biggest code smell
    // States can be changed so a subclass doesn't work well
    // Using some external util style class involves passing way too much data (or making too much public)
    // Need to find the right pattern for this
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
          text = "Add new recipe";
          break;
      }
      return <h5 className="card-title" onClick={this.toggleExpanded}>{text}</h5>
    }

    renderBody(): JSX.Element {
      switch(this.state.metaState) {
        case MetaState.default:
          return (
            <>
              <p>Ingredients:</p>
              {this.makeIngredientsList()}
            </>
          )
        default:
          return (
            <>
              <input className="form-control" type="text" placeholder="New recipe name" defaultValue={this.state.name} onChange={this.onNameUpdate} />
              <p>Ingredients:</p>
              {this.makeIngredientsList()}
              <div className="input-group mb-3">
                  <div className="input-group-append">
                      <input id="ingredientSelector" type="text" list="suggestions" className="form-control"></input>
                      {this.makeOptionList()}
                      <button className="btn btn-outline-secondary" type="button" onClick={this.onIngredientAdd}>+</button>
                  </div>
              </div>
            </>
          )
      }
    }

    makeIngredientListItem(ingredient: Ingredient): JSX.Element {
      const id = ingredient._id;
      switch(this.state.metaState) {
        case MetaState.default:
          return <li ref={this.liRef(id)}>{ingredient.name}</li>;
        default:
          return (
            <li ref={this.liRef(id)}>
                {ingredient.name} (<span data-id={id} className="delButton" onClick={this.onIngredientDelete}>X</span>)
            </li>
          );
      }
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