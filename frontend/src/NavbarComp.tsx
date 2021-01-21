import * as React from 'react';

export default class NavbarComp extends React.Component {

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
              <a className="nav-link" href="#">Ingredients <span className="sr-only">(current)</span></a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Recipes</a>
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