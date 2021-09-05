'use strict';

import Sidebar from './components/Sidebar.js';
import Editor from './components/Editor.js';
import { API } from './utils/api.js';
import { catchRouteEvent } from './utils/router.js';

export default function App({ $target }) {
  const handleAddDocument = async newDocument => {
    const { id } = await API.addDocument(newDocument);

    const rootDocuments = await API.getRootDocuments();
    const currDocument = await API.getDocument(id);

    this.editor.setState({ nextCurrDocument: currDocument });
    this.sidebar.setState({
      nextRootDocuments: rootDocuments,
      nextSelectedDocumentId: currDocument.id,
    });
  };

  const handleUpdateDocument = async (id, title, content) => {
    const document = {
      title,
      content,
    };
    await API.updateDocument(id, document);

    const rootDocuments = await API.getRootDocuments();
    const currDocument = await API.getDocument(id);

    this.editor.setState({ nextCurrDocument: currDocument });
    this.sidebar.setState({
      nextRootDocuments: rootDocuments,
      nextSelectedDocumentId: currDocument.id,
    });
  };

  const handleDeleteDocument = async id => {
    await API.deleteDocument(id);
    const rootDocuments = await API.getRootDocuments();
    const nextToggledDocuments = this.sidebar.toggledDocuments.filter(
      toggledId => toggledId !== id
    );
    this.editor.setState({ nextCurrDocument: {} });
    this.sidebar.setState({
      nextRootDocuments: rootDocuments,
      nextCurrDocumentId: null,
      nextToggledDocuments,
    });
  };

  const handleClickDocument = async id => {
    const currDocument = await API.getDocument(id);
    this.editor.setState({ nextCurrDocument: currDocument });
    this.sidebar.setState({
      nextSelectedDocumentId: currDocument.id,
    });
  };

  const handleClickLogo = () => {
    this.editor.setState({ nextCurrDocument: {} });
    this.sidebar.setState({
      nextCurrDocumentId: null,
    });
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
    const rootDocuments = await API.getRootDocuments();
    const currDocument = {};

    this.sidebar = new Sidebar({
      $target,
      rootDocuments: rootDocuments,
      currDocumentId: null,
      onAddDocument: handleAddDocument,
      onDeleteDocument: handleDeleteDocument,
      onClickDocument: handleClickDocument,
      onClickLogo: handleClickLogo,
    });
    this.editor = new Editor({
      $target,
      currDocument: currDocument,
      onUpdateDocument: handleUpdateDocument,
    });

    this.render();
  };

  init();
  catchRouteEvent(() => this.route());
}
