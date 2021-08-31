'use strict';

import { $ } from '../utils/dom.js';
import { API } from '../utils/api.js';

export default function Editor({
  $target,
  initialState = {},
  onUpdateDocumentList,
}) {
  let timer = null;
  const $editor = document.createElement('div');
  $editor.className = 'editor';
  $target.append($editor);

  $editor.addEventListener('keyup', ({ target }) => {
    if (timer !== null) {
      clearTimeout(timer);
    }

    const id = this.state.id;
    const title = $('.title', $editor).value.trim();
    const content = $('[name=content]', $editor).value.trim();

    timer = setTimeout(() => {
      updateDocument(id, title, content);
    }, 2000);
  });

  const updateDocument = async (id, title, content) => {
    const document = {
      title,
      content,
    };
    await API.updateDocument(id, document);
    onUpdateDocumentList();
  };

  this.state = initialState;

  this.setState = nextState => {
    this.state = nextState;
    this.render();
  };

  this.render = () => {
    if (Object.keys(this.state).length <= 0) {
      $editor.innerHTML = /* html */ `<h1>나만의 작은 문서공간!</h1>`;
      return;
    }

    $editor.innerHTML = /* html */ `
    <div class="editor__title">
      <input class='title' type="text" style="width: 800px" value="${
        this.state.title || ''
      }"/>
    </div>
    <div class="editor__content">
      <textarea
        name="content"
        id="content"
        style="width: 800px; height: 400px"
      >${this.state.content || ''}</textarea>
    </div>
  `;
  };
}
