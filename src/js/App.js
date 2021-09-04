'use strict';

import Sidebar from './components/Sidebar.js';
import Editor from './components/Editor.js';
import { API } from './utils/api.js';
import { catchRouteEvent } from './utils/router.js';

export default function App({ $target }) {
  const handleAddDocument = async newDocument => {
    const { id } = await API.addDocument(newDocument);
    setCurrDocument(id);
    setRootDocuments();
  };

  const handleUpdateDocument = async (id, title, content) => {
    const document = {
      title,
      content,
    };
    await API.updateDocument(id, document);
    setRootDocuments();
    setCurrDocument(id);
  };

  const handleDeleteDocument = async id => {
    await API.deleteDocument(id);
    setRootDocuments();
    setCurrDocument(null);
  };

  const handleClickDocument = id => {
    setCurrDocument(id);
  };

  const handleClickLogo = () => {
    this.editor.setState({ nextCurrDocument: {} });
  };

  const initState = async () => {
    this.rootDocuments = await API.getRootDocuments();
    this.currDocument = {};
  };

  const setCurrDocument = async id => {
    if (id) {
      this.currDocument = await API.getDocument(id);
      this.editor.setState({ nextCurrDocument: this.currDocument });
      this.sidebar.setState({ nextCurrDocumentId: this.currDocument.id });
    } else {
      this.currDocument = {};
      this.editor.setState({ nextCurrDocument: this.currDocument });
      this.sidebar.setState({ nextCurrDocumentId: null });
    }
  };

  const setRootDocuments = async () => {
    this.rootDocuments = await API.getRootDocuments();

    this.sidebar.setState({ nextRootDocuments: this.rootDocuments });
  };

  this.route = async () => {
    const { pathname } = location;

    this.sidebar.render();

    if (pathname === '/') {
      this.editor.setState({ nextCurrDocument: {} });
    } else if (pathname.indexOf('/documents/') === 0) {
      const [, , id] = pathname.split('/');
      const document = await API.getDocument(id);
      this.editor.setState({ nextCurrDocument: document });
    }
  };

  this.render = () => {
    this.sidebar.render();
    this.editor.render();
  };

  const init = async () => {
    await initState();

    this.sidebar = new Sidebar({
      $target,
      rootDocuments: this.rootDocuments,
      currDocumentId: null,
      onAddDocument: handleAddDocument,
      onDeleteDocument: handleDeleteDocument,
      onClickDocument: handleClickDocument,
      onClickLogo: handleClickLogo,
    });
    this.editor = new Editor({
      $target,
      currDocument: this.currDocument,
      onUpdateDocument: handleUpdateDocument,
    });

    this.render();
  };

  init();
  catchRouteEvent(() => this.route());
}
