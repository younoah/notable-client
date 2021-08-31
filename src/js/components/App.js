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
    navbar.setState();
  };

  const handleResetEditor = () => {
    editor.setState({});
  };

  const navbar = new Navbar({
    $target,
    onClickDocument: handleClickDocument,
    onUpdateEditor: handleResetEditor,
  });

  const editor = new Editor({
    $target,
    onUpdateDocumentList: handleUpdateDocumentList,
  });

  this.setState = () => {};

  this.render = () => {
    const { pathname } = location;
    console.log('pathname: ', pathname);
    const params = new URLSearchParams(pathname);
    console.log('params: ', params);

    navbar.setState();
    editor.render();
  };

  this.render();
}
