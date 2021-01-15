import * as React from 'react';

export interface IProps {
}

export interface IState {
  elements?: Array<JSX.Element>;
}

export default class FilterableListComp extends React.Component<IProps, IState> {
    render() {
      return <div>{this.state.elements}</div>;
    }
  }