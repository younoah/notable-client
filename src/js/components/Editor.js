'use strict';

import { $ } from '../utils/dom.js';
import { API } from '../utils/api.js';

export default function Editor({
  $target,
  initialState = {},
  onUpdateDocumentTitle,
}) {
  let timer = null;
  const $editor = document.createElement('section');
  $editor.id = 'editor';
  $target.append($editor);

  $editor.addEventListener('keyup', ({ target }) => {
    if (timer !== null) {
      clearTimeout(timer);
    }

    let titleChangedFlag = false;
    const id = this.state.id;
    const title = $('.editor__header', $editor).innerText.trim();
    const content = $('.editor__content', $editor).innerText.trim();

    if (target.matches('.editor__header')) {
      titleChangedFlag = true;
    }

    timer = setTimeout(() => {
      updateDocument(id, title, content);
      if (titleChangedFlag) {
        onUpdateDocumentTitle(id, title);
      }
    }, 2000);
  });

  const updateDocument = async (id, title, content) => {
    const document = {
      title,
      content,
    };
    await API.updateDocument(id, document);
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
    <div class="editor-container">
      <h1 contenteditable="true" class="editor__header">${this.state.title}</h1>
      <div contenteditable="true" class="editor__content">${
        this.state.content || ''
      }</div>
    </div>
    <div class="content-bottom"></div>
  `;
  };
}
