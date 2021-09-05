'use strict';

import Sidebar from './Sidebar.js';
import Editor from './Editor.js';
import { API } from '../utils/api.js';
import { initListenRouteEvent } from '../utils/router.js';

export default function App({ $target }) {
  const sidebar = new Sidebar({
    $target,
  });

  const editor = new Editor({
    $target,
  });

  const routeEditor = async () => {
    const { pathname } = location;
    const [, , id] = pathname.split('/');
    const document = await API.getDocument(id);
    editor.setState(document);
  };

  this.route = async () => {
    const { pathname } = location;

    sidebar.setState();

    if (pathname === '/') {
      editor.setState({});
    } else if (pathname.indexOf('/documents/') === 0) {
      // routeEditor();
      const { pathname } = location;
      const [, , id] = pathname.split('/');
      const document = await API.getDocument(id);
      editor.setState(document);
    }
  };

  this.route();
  initListenRouteEvent(() => {
    this.route();
  });
}
