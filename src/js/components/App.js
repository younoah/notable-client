'use strict';

import Sidebar from './Sidebar.js';
import Editor from './Editor.js';
import { API } from '../utils/api.js';
import { catchRouteEvent } from '../utils/router.js';

export default function App({ $target, initialState }) {
  this.state = initialState;

  const sidebar = new Sidebar({
    $target,
  });

  const editor = new Editor({
    $target,
  });

  this.render = async () => {
    const { pathname } = location;
    sidebar.setState();

    if (pathname === '/') {
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
