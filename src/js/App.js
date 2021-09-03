'use strict';

import Sidebar from './components/Sidebar.js';
import Editor from './components/Editor.js';
import { API } from './utils/api.js';
import { catchRouteEvent } from './utils/router.js';

export default function App({ $target }) {
  const sidebar = new Sidebar({
    $target,
  });

  const editor = new Editor({
    $target,
  });

  this.route = async () => {
    const { pathname } = location;

    sidebar.setState();

    if (pathname === '/') {
      console.log('1');
      editor.setState({});
    } else if (pathname.indexOf('/documents/') === 0) {
      const [, , id] = pathname.split('/');
      const document = await API.getDocument(id);
      editor.setState(document);
    }
  };

  this.route();
  catchRouteEvent(() => this.route());
}
