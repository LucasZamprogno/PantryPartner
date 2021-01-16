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
        const withNew = this.state.elements.concat(newElem);
        return {elements: withNew};
      });
    };

    abstract makeComponent(element: T): JSX.Element;

    renderList() {
      return <div>{this.state.elements.map(x => this.makeComponent(x))}</div>;
    }
  }