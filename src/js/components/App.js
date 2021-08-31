'use strict';

import Navbar from './Navbar.js';
import Editor from './Editor.js';

export default function App({ $target, initialState }) {
  this.state = initialState;

  const navbar = new Navbar({ $target, initialState: this.state });
  const editor = new Editor({ $target, initialState: this.state });

  this.setState = () => {};

  this.render = () => {};

  this.render();
}
