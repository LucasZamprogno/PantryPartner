import * as React from 'react';
import { MongoEntry} from '../../../common/types';
import { ComHub } from './App';

export interface IProps<T> {
  comHub: ComHub,
  elements: T[],
  altElements?: any[] // TODO maybe make a proper type system here
}

export interface IState {
  filterText: string,
  sortOrder: string | null
}

export default abstract class FilterableListComp<T extends MongoEntry> extends React.Component<IProps<T>, IState> {
    
  protected abstract readonly orderOptions: string[];
  protected abstract readonly componentName: string;

    constructor(props: IProps<T>) {
      super(props)
      this.state = {
        filterText: "",
        sortOrder: null
      }
    }

    componentDidMount() {
      const sort = this.orderOptions.length > 0 ? this.orderOptions[0] : null;
      this.setState({sortOrder: sort});
    }

    onInputUpdate = (event: any): void => {
      this.setState({filterText: event.target.value});
    }

    onSortUpdate = (event: any): void => {
      console.log(event.target.value);
      this.setState({sortOrder: event.target.value});
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

    getSelectId() {
      return `sort-${this.componentName}`;
    }

    renderSortOptions() {
      let elem;
      if (this.orderOptions.length > 0) {
        elem = (
          <div className="form-group row">
            <div className="col-4">
              <label htmlFor={this.getSelectId()} className="control-label">Sort by:</label>
            </div>
            <div className="col-6">
              <select className="form-control" id={this.getSelectId()} onChange={this.onSortUpdate}>
                {this.orderOptions.map(x => <option>{x}</option>)}
              </select>
            </div>
          </div>
        )
      } else {
        elem = <></>
      }
      return elem;
    }

    abstract makeComponent(element: T): JSX.Element;
    abstract filterCondition(item: T): boolean;
    abstract getSortedList(list: T[]): T[];

    renderList(): JSX.Element {
      const elemsToShow = this.filter(this.props.elements);
      const sorted = this.getSortedList(elemsToShow);
      const finalElements = sorted.map(x => this.makeListRow(x));
      return (
      <div>
        <div className="row justify-content-start">
          <div className="col-6">
            <input className="form-control" type="text" placeholder="Filter" onChange={this.onInputUpdate} />
          </div>
          <div className="col-6">
            {this.renderSortOptions()}
          </div>
        </div>
        <div className="my-2">
          {finalElements}
        </div>
      </div>);
    }
  }