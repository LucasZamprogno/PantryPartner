import * as React from 'react';
import $ from 'jquery';
import { IngredientPreWrite } from '../../common/types';

export interface IProps {
    callback: (data: any) => void;
}

export default class IngredientAddComp extends React.Component<IProps, IngredientPreWrite> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            name: "",
            isStaple: false,
            isStocked: false
        }
    }

    onNameUpdate = (event: any): void => {
        this.setState({name: event.target.value});
    }

    onStapleUpdate = (event: any): void => {
        this.setState({isStaple: event.target.checked});
    }

    onStockedUpdate = (event: any): void => {
        this.setState({isStocked: event.target.checked});
    }

    onButtonClick = (event: any): void => {
        $.ajax({
            contentType: 'application/json',
            dataType: 'json',
            url: '/ingredient/',
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

    render() {
      return (
        <div className="col-12">
            <div className="card my-1">
                <div className="card-body p-2">
                    <h5 className="card-title">Add new ingredient</h5>
                    <div>
                        <input className="form-control" type="text" placeholder="Ingredient name" onChange={this.onNameUpdate} />
                    </div>
                    <div className="form-check">
                        <input type="checkbox" defaultChecked={false} className="form-check-input" id="add-staple" onChange={this.onStapleUpdate}/>
                        <label className="form-check-label" htmlFor="add-staple">Staple?</label>
                    </div>
                    <div className="form-check">
                        <input type="checkbox" defaultChecked={false} className="form-check-input" id="add-stocked" onChange={this.onStockedUpdate}/>
                        <label className="form-check-label" htmlFor="add-stocked">Stocked?</label>
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