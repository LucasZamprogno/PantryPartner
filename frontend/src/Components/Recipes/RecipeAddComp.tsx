import * as React from 'react';
import $ from 'jquery';
import { Ingredient, RecipePreWrite } from '../../../../common/types';

interface IProps {
    callback: (data: any) => void;
    options: Ingredient[]
}

interface IState {
    name: string,
    ingredients: Ingredient[],
}

export default class IngredientAddComp extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            name: "",
            ingredients: [],
        }
    }
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

    onIngredientDelete = (event: any): void => {
        const id = event.target.getAttribute("data-id");
        this.setState((state: IState, props: IProps) => {
          return {ingredients: state.ingredients.filter(x => x._id != id)}
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

    onButtonClick = (event: any): void => {
        $.ajax({
            contentType: 'application/json',
            dataType: 'json',
            url: '/recipe/',
            type: 'PUT',
            data: JSON.stringify(this.getRecipePreWriteFromState()),
            success: (result) => {
                this.props.callback(result);
            },
            error:(err) => {
                // TODO add proper error handling
                console.log(err); // And maybe a logging framework
            },
        });
    }

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

    makeIngredientListItem(ingredient: Ingredient): JSX.Element {
        const id = ingredient._id;
        return (
            <li ref={this.liRef(id)}>
                {ingredient.name} (<span data-id={id} className="delButton" onClick={this.onIngredientDelete}>X</span>)
            </li>
        )
    }

    makeIngredientsList(): JSX.Element {
        return (
        <ul>
            {this.state.ingredients.map(x => this.makeIngredientListItem(x))}
        </ul>
        )
    }

    render() {
      return (
        <div className="col-12">
            <div className="card my-1">
                <div className="card-body p-2">
                    <h5 className="card-title">Add new recipe</h5>
                    <div>
                        <input className="form-control" type="text" placeholder="Ingredient name" onChange={this.onNameUpdate} />
                    </div>
                    <p>Ingredients:</p>
                    {this.makeIngredientsList()}
                    <div className="input-group mb-3">
                        <div className="input-group-append">
                            <input id="ingredientSelector" type="text" list="suggestions" className="form-control"></input>
                            {this.makeOptionList()}
                            <button className="btn btn-outline-secondary" type="button" onClick={this.onIngredientAdd}>+</button>
                        </div>
                    </div>
                    <div>
                        <button className="btn btn-primary" onClick={this.onButtonClick}>Add</button>
                    </div>
                </div>
            </div>
        </div>
      );
    }
  }