// import _ from 'lodash'

// function component() {
//     const element = document.createElement('div');
  
//     // Lodash, now imported
//     element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  
//     return element;
//   }
  
//   document.body.appendChild(component());
import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Ingredient} from '../../common/types'

class IngredientCompList extends React.Component<{elems:Array<Ingredient>}> {
  render() {
    const entries = this.props.elems.map(x => <IngredientComp name={x.name} />);
    return <div>{entries}</div>;
  }
}

class IngredientComp extends React.Component<{name:string}> {
  render() {
    return <h1>{this.props.name}</h1>;
  }
}

$.get("/ingredients").then((res: Array<Ingredient>) => {
  ReactDOM.render(<IngredientCompList elems={res}/>, document.getElementById('root'));
});
