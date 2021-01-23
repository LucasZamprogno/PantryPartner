import * as React from 'react';
import $ from 'jquery';

export default class NavbarComp extends React.Component {

    toggleVisible = (targetId: string) => {
      $("div.active").toggleClass("active d-none");
      $(`div#${targetId}`).toggleClass("active d-none");
    }

    render() {
      return (
      <nav className="row navbar navbar-expand navbar-light bg-light mb-2">
        <a className="navbar-brand ml-2" href="#">FoodThing</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item active">
              <a className="nav-link" onClick={() => this.toggleVisible("ingredients")}>Ingredients <span className="sr-only">(current)</span></a>
            </li>
            <li className="nav-item">
              <a className="nav-link" onClick={() => this.toggleVisible("recipes")}>Recipes</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Shopping List</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Recipe Suggester</a>
            </li>
          </ul>
        </div>
      </nav>
      )
    }
  }