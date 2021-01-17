import * as React from 'react';
import { MongoEntry } from '../../common/types';

export interface IProps {
}

export interface IState<Type> {
  elements: Array<Type>,
  filterText: string
}

export default abstract class FilterableListComp<T extends MongoEntry> extends React.Component<IProps, IState<T>> {
    constructor(props: IProps) {
      super(props)
      this.state = {
        elements: [],
        filterText: ""
      }
    }

    onElemRemove = (id: string) => {
      this.setState((state: IState<T>, props: IProps) => {
        console.log(state.elements);
        const newElems = state.elements.filter(x => x._id != id);
        console.log(newElems);
        return {elements: newElems}
      });
    };

    onElemAdd = (newElem: any) => {
      console.log(newElem)
      this.setState((state: IState<T>, props: IProps) => {
        const withNew = state.elements.concat(newElem);
        return {elements: withNew};
      });
    };

    onInputUpdate = (event: any) => {
      this.setState({filterText: event.target.value});
    }

    filter(initial: Array<T>) {
      return initial.filter(x => this.filterCondition(x));
    }

    makeListRow(elem: T) {
      return (
      <div className="row">
        <div className="col-12">{this.makeComponent(elem)}</div>
      </div>
      )
    }

    abstract makeComponent(element: T): JSX.Element;
    abstract filterCondition(item: T): boolean;

    renderList() {
      return (
      <div>
        <div className="row justify-content-start">
          <div className="col-6">
            <input className="form-control" type="text" placeholder="Filter" onChange={this.onInputUpdate} />
          </div>
        </div>
        {this.filter(this.state.elements).map(x => this.makeListRow(x))}
      </div>);
    }
  }