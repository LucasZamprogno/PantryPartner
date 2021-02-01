import * as React from 'react';
import {Ingredient, Recipe} from '../../../../common/types'
import $ from 'jquery';
import MainEntryComp, { EntryProps, MetaState } from '../MainEntryComp';

export default class RecipeComp extends MainEntryComp<Recipe> {

    protected readonly endpoint: string = "recipe";
    protected readonly entryType: string = "recipe"; // Add new _______

    constructor(props: EntryProps<Recipe>) {
      super(props);
      if (!props.getIngredients) {
          throw new Error("RecipeComp needs getIngredients function");
      }
    }

    onIngredientDelete = (event: any): void => {
        const id = event.target.getAttribute("data-id");
        this.setState((state, props) => {
            const newIngredients = state.data.ingredients.filter(x => x._id != id);
            const newData = this.getUpdatedStateData({ingredients: newIngredients});
            return {data: newData}
        });
    }

    // Add related //
    onNameUpdate = (event: any): void => {
        const newData = this.getUpdatedStateData({name: event.target.value});
        this.setState({data: newData});
    }

    onIngredientAdd = (event: any): void => {
        this.setState((state, props) => {
            const selector = $("#ingredientSelector");
            const selectedName = selector.val();
            for (const elem of this.props.getIngredients!()) {
                if (elem.name === selectedName) {
                    const withNew = state.data.ingredients.concat(elem);
                    const newData = this.getUpdatedStateData({ingredients: withNew})
                    selector.val("");
                    return {data: newData};
                }
            }
            return {data: state.data}; // TODO error handle better            
        });
    }

    getDataPreWriteString(): string {
        const name = this.state.data.name;
        const ingredient_ids = this.state.data.ingredients.map(x => x._id);
        const recipePreWrite = {
            name: name,
            ingredient_ids: ingredient_ids
        };
        return JSON.stringify(recipePreWrite);
    }

    // Rendering // 
    liRef(id: string) {
      return `add-rec-li-${id}`;
    }

    makeOptionList(): JSX.Element {
        const options = this.props.getIngredients!().map(x => (<option value={x.name}/>))
        return (
            <datalist id="suggestions">
                {options}
            </datalist>
        )
    }

    makeIngredientsList(): JSX.Element {
        return (
        <ul>
            {this.state.data.ingredients.map(x => this.makeIngredientListItem(x))}
        </ul>
        )
    }

    // These switches are like the world's biggest code smell
    // States can be changed so a subclass doesn't work well
    // Using some external util style class involves passing way too much data (or making too much public)
    // Need to find the right pattern for this
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
              <input className="form-control" type="text" placeholder="New recipe name" defaultValue={this.state.data.name} onChange={this.onNameUpdate} />
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
  }