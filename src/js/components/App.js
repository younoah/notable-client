'use strict';

import Navbar from './Navbar.js';
import Editor from './Editor.js';
import { $ } from '../utils/dom.js';
import { API } from '../utils/api.js';
import { catchRouteEvent } from '../utils/router.js';

export default function App({ $target, initialState }) {
  this.state = initialState;

  const handleClickDocument = async id => {
    const document = await API.getDocument(id);
    editor.setState(document);
  };

  const handleUpdateDocumentTitle = (targetId, newTitle) => {
    const $documentTittle = $('.document-title', $(`[data-id="${targetId}"]`));
    $documentTittle.innerText = newTitle;
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
    onUpdateDocumentTitle: handleUpdateDocumentTitle,
  });

  this.setState = () => {};

  this.render = async () => {
    const { pathname } = location;

    navbar.setState();

    if (pathname === '/') {
      editor.setState({});
    } else if (pathname.indexOf('/documents/') === 0) {
      const [, , id] = pathname.split('/');
      const document = await API.getDocument(id);
      editor.setState(document);
    }
  };

  this.render();
  catchRouteEvent(() => editor.setState(document));
}
