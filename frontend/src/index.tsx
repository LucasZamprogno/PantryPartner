import 'bootstrap/dist/css/bootstrap.min.css';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import IngredientListComp from './IngredientListComp';
import NavbarComp from './NavbarComp';
import RecipeListComp from './RecipeListComp';

ReactDOM.render(
    (<>
    <NavbarComp />
    <div className="row justify-content-center active" id="ingredients">
        <div className="col-10"><IngredientListComp /></div>
    </div>
    <div className="row justify-content-center d-none" id="recipes">
        <div className="col-10"><RecipeListComp /></div>
    </div>
    </>),
    document.getElementById('root'));
