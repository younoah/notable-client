'use strict';

import { $ } from '../utils/dom.js';
import { API } from '../utils/api.js';

export default function Editor({ $target, initialState = {} }) {
  let debounceTimer = null;
  const $editor = document.createElement('section');
  $editor.id = 'editor';
  $target.append($editor);

  $editor.addEventListener('keyup', ({ target }) => {
    if (debounceTimer !== null) {
      clearTimeout(debounceTimer);
    }

    const id = this.state.id;
    const title = $('.editor__header', $editor).innerText.trim();
    const content = $('.editor__content', $editor).innerText.trim();

    debounceTimer = setTimeout(async () => {
      const document = {
        title,
        content,
      };
      await API.updateDocument(id, document);
    }, 2000);
  });

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
      <div class="editor-container">
        <h1 contenteditable="true" class="editor__header">${
          this.state.title
        }</h1>
        <div contenteditable="true" class="editor__content">${
          this.state.content || ''
        }</div>
      </div>
      <div class="content-bottom"></div>
    `;
  };
}
