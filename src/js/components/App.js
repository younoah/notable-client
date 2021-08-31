'use strict';

import Navbar from './Navbar.js';
import Editor from './Editor.js';
import { API } from '../utils/api.js';

export default function App({ $target, initialState }) {
  this.state = initialState;

  const handleClickDocument = async id => {
    const document = await API.getDocument(id);
    editor.setState(document);
  };

  const handleUpdateDocumentList = () => {
    navbar.render();
  };

  const handleResetEdiotr = () => {
    editor.setState({});
  };

  const navbar = new Navbar({
    $target,
    initialState: this.state,
    onClickDocument: handleClickDocument,
    onUpdateEditor: handleResetEdiotr,
  });

  const editor = new Editor({
    $target,
    initialState: this.state,
    onUpdateDocumentList: handleUpdateDocumentList,
  });

  this.setState = () => {};

  this.render = () => {};

  this.render();
}
