import * as React from 'react';
import $ from 'jquery';
import { Ingredient, RecipePreWrite } from '../../common/types';

interface IProps {
    callback: (data: any) => void;
    options: Ingredient[]
}

export default class IngredientAddComp extends React.Component<IProps, RecipePreWrite> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            name: "",
            ingredients: [],
        }
    }
    onNameUpdate = (event: any) => {
        this.setState({name: event.target.value});
    }

    onIngredientAdd = (event: any) => {
        this.setState((state: RecipePreWrite, props: IProps) => {
            const selectedName = $("#ingredientSelector").val();
            for (const elem of this.props.options) {
                if (elem.name === selectedName) {
                    const withNew = state.ingredients.concat(elem._id);
                    return {ingredients: withNew};
                }
            }
            return {ingredients: state.ingredients};
            // TODO error handle
        });
    }

    getRecipeFromState() {
        const stateCopy = JSON.parse(JSON.stringify(this.state));
        delete stateCopy.expanded;
        return stateCopy;
    }

    onButtonClick = (event: any) => {
        $.ajax({
            contentType: 'application/json',
            dataType: 'json',
            url: '/recipe/',
            type: 'PUT',
            data: JSON.stringify(this.state),
            success: (result) => {
                this.props.callback(result);
            },
            error:(err) => {
                // TODO add proper error handling
                console.log(err); // And maybe a logging framework
            },
        });
    }

    makeOptionList() {
        const options = this.props.options.map(x => (<option value={x.name}/>))
        return (
            <datalist id="suggestions">
                {options}
            </datalist>
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
                    <ul>
                        {this.state.ingredients.map(x => (<li>{x}</li>))}
                    </ul>
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