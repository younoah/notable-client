'use strict';

import Sidebar from './components/Sidebar.js';
import Editor from './components/Editor.js';
import { API } from './utils/api.js';
import { catchRouteEvent } from './utils/router.js';

export default function App({ $target, initialState = [] }) {
  this.state = initialState;

  const handleAddDocument = async (title, parentId = null) => {
    const generatedDocument = await API.addDocument({ title, parentId });
    const newDocument = {
      ...generatedDocument,
      isOpened: parentId ? true : false,
    };
  };

  const handleToggleDocument = id => {};

  this.setState = nextState => {
    this.state = nextState;
    this.route;
  };

  const initState = async () => {
    const documents = await API.getRootDocuments();
    const newDocument = appendOpenStateTo(documents, true);
    this.state = newDocument;
  };

  const appendOpenStateTo = (documents, isRoot) => {
    const newDocument = documents.map(document => {
      return {
        ...document,
        documents: appendOpenStateTo(document.documents, false),
        isOpened: isRoot ? true : false,
      };
    });

    return newDocument;
  };

  const renderEditor = async id => {
    if (id) {
      const document = await API.getDocument(id);
      this.editor.setState(document);
    } else {
      this.editor.setState({});
    }
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
      initialState: this.state,
      renderEditor,
    });
    this.editor = new Editor({
      $target,
    });

    this.route();
  };

  init();
  catchRouteEvent(() => this.route());
}
