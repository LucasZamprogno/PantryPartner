import * as React from 'react';
import $ from 'jquery';
import {Ingredient, IngredientPreWrite} from '../../../../common/types'
import MainEntryComp, { EntryProps, MetaState } from '../MainEntryComp';

export default class IngredientComp extends MainEntryComp<Ingredient> {

    protected readonly endpoint: string = "ingredient";
    protected readonly entryType: string = "ingredient"; // Add new _______

    constructor(props: EntryProps<Ingredient>) {
      super(props);
    }

    onDeleteClick = (event: any): void => {
      $.ajax({
          url: `/${this.endpoint}/safe/${this.props.data._id}`,
          type: 'DELETE',
          success: (result) => {
            this.props.onDelete(result._id);
          },
          error:(err) => {
            const status = err.status;
            if (status === 400) {
              const usedIn = err?.responseJSON?.usedIn;
              let str = "This ingredient is still in used in the following recipes:";
              for (const recipe of usedIn) {
                str += `\n- ${recipe}`;
              }
              alert(str);
            } else {
              const msg = err?.responseJSON?.error;
              if(msg) {
                alert(msg);
              } else {
                alert(`Connection to server failed`);
              }
            }
          },
      });
    }

    getDataPreWriteString(): string {
      const ingredientPreWrite: IngredientPreWrite = {
        name: this.state.data.name,
        isStocked: this.state.data.isStocked,
        isStaple: this.state.data.isStaple
      }
      return JSON.stringify(ingredientPreWrite);
    }

    onStapleUpdate = (event: any): void => {
        const newData = this.getUpdatedStateData({isStaple: event.target.checked});
        this.setState({data: newData});
    }

    onStockedUpdate = (event: any): void => {
        const newData = this.getUpdatedStateData({isStocked: event.target.checked});
        this.setState({data: newData});
    }

    onNameUpdate = (event: any): void => {
        const newData = this.getUpdatedStateData({name: event.target.value});
        this.setState({data: newData});
    }

    renderBody(): JSX.Element {
      const stapleId: string = this.props.data._id + "-staple";
      const stockedId: string = this.props.data._id + "-stocked";
      let disabled = false;
      let nameInput = <div>
          <input defaultValue={this.state.data.name} className="form-control" type="text" placeholder="Ingredient name" onChange={this.onNameUpdate} />
      </div>
      if (this.state.metaState === MetaState.default) {
        disabled = true;
        nameInput = <></>;
      }
      return (
        <>
        {nameInput}
        <div className="form-check">
          <input type="checkbox" disabled={disabled} defaultChecked={this.state.data.isStaple} className="form-check-input" id={stapleId} onChange={this.onStapleUpdate}/>
          <label className="form-check-label" htmlFor={stapleId}>Staple ingredient</label>
        </div>
        <div className="form-check">
          <input type="checkbox" disabled={disabled} defaultChecked={this.state.data.isStocked} className="form-check-input" id={stockedId} onChange={this.onStockedUpdate}/>
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
  }