import * as React from 'react';
import { MongoEntry } from '../../common/types';

export interface IProps {
}

export interface IState<Type> {
  elements: Array<Type>;
}

export default abstract class FilterableListComp<T extends MongoEntry> extends React.Component<IProps, IState<T>> {
    constructor(props: IProps) {
      super(props)
      this.state = {elements: []}
    }

    onElemRemove = (id: string) => {
      // TODO
      this.setState((state: IState<T>, props: IProps) => {elements: state.elements.filter(x => x._id != id)});
    };

    onElemAdd = (newElem: any) => {
      const withNew = this.state.elements.concat(newElem) // TODO MAKE SURE THIS DATA IS CORRECT
      this.setState((state: IState<T>, props: IProps) => {elements: withNew});
    };

    abstract makeComponent(element: T): JSX.Element;

    renderList() {
      return <div>{this.state.elements.map(x => this.makeComponent(x))}</div>;
    }
  }