'use strict';

import Sidebar from './components/Sidebar.js';
import Editor from './components/Editor.js';
import { API } from './utils/api.js';
import { catchRouteEvent } from './utils/router.js';

export default function App({ $target }) {
  const handleAddDocument = async (parentId, title) => {
    const document = {
      parent: parentId,
      title,
    };
    const { id } = await API.addDocument(document);
    setRootDocuments();
    setCurrDocument(id);
  };

  const handleUpdateDocument = async (id, title, content) => {
    const document = {
      title,
      content,
    };
    await API.updateDocument(id, document);
    setRootDocuments();
    setCurrDocument(id); // 낙관적 업데이트시 삭제 해도 될 듯
  }; // for editor

  const handleDeleteDocument = id => {
    await API.deleteDocument(id);
    setRootDocuments();
    setCurrDocument(null);
  };

  const initState = async () => {
    this.rootDocuments = await API.getRootDocuments();
    this.currDocument = {};
  };

  const setCurrDocument = async id => {
    if (id) {
      this.currDocument = await API.getDocument(id);
      this.editor.setState(this.currDocument);
    } else {
      this.currDocument = {};
      this.editor.setState(this.currDocument);
    }
  };

  const setRootDocuments = async () => {
    this.rootDocuments = await API.getRootDocuments();
    this.sidebar.setState(this.rootDocuments);
  };

  this.route = async () => {
    const { pathname } = location;

    this.sidebar.render();

    if (pathname === '/') {
      this.editor.setState({});
    } else if (pathname.indexOf('/documents/') === 0) {
      const [, , id] = pathname.split('/');
      const document = await API.getDocument(id);
      this.editor.setState(document);
    }
  };

  const init = async () => {
    await initState();

    this.sidebar = new Sidebar({
      $target,
      initialState: this.rootDocument,
      renderEditor,
    });
    this.editor = new Editor({
      $target,
      initialState: this.currDocument,
      renderSidebar,
    });

    this.route();
  };

  init();
  catchRouteEvent(() => this.route());
}
