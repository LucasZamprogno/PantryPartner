import 'bootstrap/dist/css/bootstrap.min.css';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import IngredientListComp from './IngredientListComp';
import NavbarComp from './NavbarComp';

ReactDOM.render(
    (<>
    <NavbarComp />
    <div className="row justify-content-center">
        <div className="col-10"><IngredientListComp /></div>
    </div>
    </>),
    document.getElementById('root'));
