import * as React from 'react';
import $ from 'jquery';
import Collapse from "react-bootstrap/Collapse";
import { Ingredient, MongoEntry } from '../../../common/types';

export enum MetaState {
  default,
  editing,
  creating
}

export interface EntryProps<T> {
    data: T,
    initialState: MetaState,
    onDelete: (id: string) => void,
    onAdd: (entry: T) => void,
    onUpdate: (entry: T) => void,
    getIngredients?: () => Ingredient[] // I kind of hate this
}

export interface EntryState<T> {
    data: T,
    expanded: boolean,
    metaState: MetaState
}

export default abstract class MainEntryComp<T extends MongoEntry> extends React.Component<EntryProps<T>, EntryState<T>> {
    
    protected abstract readonly endpoint: string;
    protected abstract readonly entryType: string;

    constructor(props: EntryProps<T>) {
      super(props);
      this.state = {
          data: this.props.data,
          expanded: false,
          metaState: this.props.initialState
      }
    }

    abstract renderBody(): JSX.Element;
    abstract renderCRUDbuttons(): JSX.Element;
    abstract getDataPreWriteString(): string;

    // Need to do full object update to force render
    getUpdatedStateData(toUpdate: Partial<T>): T {
      const copy: T = JSON.parse(JSON.stringify(this.state.data));
      for (const [key, value] of Object.entries(toUpdate)) {
        // I guess it wants to know exactly what value is, but it will be the correct type because it's from a Partial of T
        // @ts-ignore: Implicit any
        copy[key] = value;
      }
      return copy;
    }

    toggleExpanded = () => this.setState((state: EntryState<T>) => {
      if (this.state.metaState === MetaState.editing) {
        return {expanded: true}; // Don't allow collapsing of editing, must save or cancel first
      }
      return {expanded: !state.expanded}
    })

    // AFAIK this should be allowed since T extends MongoEntry so name:string should be a partial??
    // onNameUpdate = (event: any): void => {
    //     const newData = this.updateStateData({name: (event.target.value as string)});
    //     this.setState({data: newData);
    // }

    onEditClick = (event: any): void => {
      this.setState({metaState: MetaState.editing});
    }

    onAddClick = (event: any): void => {
        $.ajax({
            contentType: 'application/json',
            dataType: 'json',
            url: `/${this.endpoint}`,
            type: 'PUT',
            data: this.getDataPreWriteString(),
            success: (result) => {
                this.props.onAdd(result);
            },
            error:(err) => {
                // TODO add proper error handling
                console.log(err); // And maybe a logging framework
            },
        });
    }

    onDeleteClick = (event: any): void => {
      $.ajax({
          url: `/${this.endpoint}/${this.props.data._id}`,
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
          url: `/${this.endpoint}`,
          type: 'PATCH',
          data: JSON.stringify(this.state.data),
          success: (result: T) => {
            this.setState({data: result});
            this.setState({metaState: MetaState.default});
          },
          error:(err) => {
              // TODO add proper error handling
              console.log(err); // And maybe a logging framework
          },
      });
    }

    renderHeading(): JSX.Element {
      let text: string;
      switch(this.state.metaState) {
        case MetaState.default:
          text = this.state.data.name;
          break;
        case MetaState.editing:
          text = `(Editing) ${this.state.data.name}`;
          break;
        case MetaState.creating:
          text = `Add new ${this.entryType}`;
          break;
      }
      return <h5 className="card-title" onClick={this.toggleExpanded}>{text}</h5>
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
