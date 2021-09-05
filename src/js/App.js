'use strict';

import Sidebar from './components/Sidebar.js';
import Editor from './components/Editor.js';
import { API } from './utils/api.js';
import { initListenRouteEvent, dispatchRouteEvent } from './utils/router.js';
import {
  getParentDocumentById,
  getAncestorDocumentIdsByDocument,
} from './utils/document.js';

export default function App({ $target }) {
  const handleAddDocument = async newDocument => {
    const { id } = await API.addDocument(newDocument);

    const rootDocuments = await API.getRootDocuments();
    const currDocument = await API.getDocument(id);
    const parentDocument = getParentDocumentById(rootDocuments, Number(id));
    const nextToggledDocumentIds = [...this.sidebar.toggledDocumentIds];
    if (parentDocument) {
      nextToggledDocumentIds.push(parentDocument.id);
    }

    this.editor.setState({ nextCurrDocument: currDocument });
    this.sidebar.setState({
      nextRootDocuments: rootDocuments,
      nextSelectedDocumentId: currDocument.id,
      nextToggledDocumentIds,
    });
    dispatchRouteEvent(`/documents/${id}`);
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
    const nextToggledDocumentIds = this.sidebar.toggledDocumentIds.filter(
      toggledId => toggledId !== id
    );
    this.editor.setState({ nextCurrDocument: {} });
    this.sidebar.setState({
      nextRootDocuments: rootDocuments,
      nextSelectedDocumentId: null,
      nextToggledDocumentIds,
    });
  };

  const handleClickDocument = async id => {
    const currDocument = await API.getDocument(id);
    this.editor.setState({ nextCurrDocument: currDocument });
    this.sidebar.setState({
      nextSelectedDocumentId: currDocument.id,
    });
    dispatchRouteEvent(`/documents/${id}`);
  };

  const handleClickLogo = () => {
    this.editor.setState({ nextCurrDocument: {} });
    this.sidebar.setState({
      nextSelectedDocumentId: null,
    });
    dispatchRouteEvent('/');
  };

  const initComponents = async () => {
    const rootDocuments = await API.getRootDocuments();
    const currDocument = {};

    this.sidebar = new Sidebar({
      $target,
      rootDocuments: rootDocuments,
      selectedDocumentId: null,
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
  };

  const initialize = async () => {
    await initComponents();
    await this.route();
  };

  this.route = async () => {
    const { pathname } = location;

    if (pathname === '/') {
      this.sidebar.render();
      this.editor.setState({ nextCurrDocument: {} });
    } else if (pathname.indexOf('/documents/') === 0) {
      const [, , id] = pathname.split('/');
      const rootDocuments = await API.getRootDocuments();
      const currDocument = await API.getDocument(id);
      const ancestorDocumentIds = getAncestorDocumentIdsByDocument(
        rootDocuments,
        currDocument
      );
      const nextToggledDocumentIds = [
        ...this.sidebar.toggledDocumentIds,
        ...ancestorDocumentIds,
      ];

      this.editor.setState({ nextCurrDocument: currDocument });
      this.sidebar.setState({
        nextRootDocuments: rootDocuments,
        nextSelectedDocumentId: currDocument.id,
        nextToggledDocumentIds,
      });
    }
  };

  initialize();
  initListenRouteEvent(() => {
    this.route();
  });
}
