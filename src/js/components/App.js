'use strict';

import Navbar from './Navbar.js';

export default function App({ $target, initialState }) {
  this.state = initialState;

  const navbar = new Navbar({ $target, initialState: this.state });

  this.setState = () => {};

  this.render = () => {};

  this.render();
}
