import * as React from 'react';

export interface IProps {
}

export interface IState {
  elements: any[];
}

export default class FilterableListComp extends React.Component<IProps, IState> {
    constructor(props: IProps) {
      super(props)
      this.state = {elements: []}
    }
  // Right now this is super unused
    renderList() {
      return <div>{this.state.elements}</div>;
    }

    render() { // Does this have to be here? Maybe this could be abstract? Might still complain
      return <div>{this.state.elements}</div>;
    }
  }