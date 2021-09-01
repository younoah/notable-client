'use strict';

import Navbar from './Navbar.js';
import Editor from './Editor.js';
import { API } from '../utils/api.js';
import { catchRouteEvent } from '../utils/router.js';

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

  this.render = async () => {
    navbar.setState();

    const { pathname } = location;

    if (pathname === '/') {
      console.log('루트!!');
      editor.setState({});
    } else if (pathname.indexOf('/documents/') === 0) {
      const [, , id] = pathname.split('/');
      const document = await API.getDocument(id);
      editor.setState(document);
    }
  };

  this.render();
  catchRouteEvent(() => this.render());
}
