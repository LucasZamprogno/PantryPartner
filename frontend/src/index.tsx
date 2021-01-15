// import _ from 'lodash'

// function component() {
//     const element = document.createElement('div');
  
//     // Lodash, now imported
//     element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  
//     return element;
//   }
  
//   document.body.appendChild(component());
import 'bootstrap/dist/css/bootstrap.min.css';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import IngredientListComp from './IngredientListComp';

ReactDOM.render(<IngredientListComp />, document.getElementById('root'));