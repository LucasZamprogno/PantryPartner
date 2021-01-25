import * as React from 'react';
import { MongoEntry} from '../../../common/types';
import { ComHub } from './App';

export interface IProps<T> {
  comHub: ComHub,
  elements: T[],
  altElements?: any[] // TODO maybe make a proper type system here
}

export interface IState {
  filterText: string
}

export default abstract class FilterableListComp<T extends MongoEntry> extends React.Component<IProps<T>, IState> {
    constructor(props: IProps<T>) {
      super(props)
      this.state = {
        filterText: ""
      }
    }

    onInputUpdate = (event: any): void => {
      this.setState({filterText: event.target.value});
    }

    filter(initial: Array<T>): Array<T> {
      return initial.filter(x => this.filterCondition(x));
    }

    makeListRow(elem: T): JSX.Element {
      return (
      <div className="row">
        <div className="col-12">{this.makeComponent(elem)}</div>
      </div>
      )
    }

    abstract makeComponent(element: T): JSX.Element;
    abstract filterCondition(item: T): boolean;

    renderList(): JSX.Element {
      return (
      <div>
        <div className="row justify-content-start">
          <div className="col-6">
            <input className="form-control" type="text" placeholder="Filter" onChange={this.onInputUpdate} />
          </div>
        </div>
        <div className="my-2">
          {this.filter(this.props.elements).map(x => this.makeListRow(x))}
        </div>
      </div>);
    }
  }