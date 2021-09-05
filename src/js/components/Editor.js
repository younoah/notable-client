'use strict';

import { $ } from '../utils/dom.js';
import { API } from '../utils/api.js';

export default function Editor({ $target, currDocument = {} }) {
  let debounceTimer = null;
  const $editor = document.createElement('section');
  $editor.id = 'editor';
  $target.append($editor);

  const initState = () => {
    this.currDocument = currDocument;
  };

  this.setState = ({ nextCurrDocument }) => {
    this.currDocument = nextCurrDocument;
    this.render();
  };

  this.render = () => {
    if (Object.keys(this.currDocument).length <= 0) {
      $editor.innerHTML = /* html */ `
        <div class="editor__logo">
          <div class="editor__logo-image">
            <i class="fab fa-accusoft"></i>
          </div>
          <span class="editor__logo-title">Notable</span>
          <span class="editor__logo-comment"
            ><strong>'지혜'</strong>는 생각났을 때 <strong>'기록'<strong>하는 것이다.</span
          >
        </div>
      `;
      return;
    }

    $editor.innerHTML = /* html */ `
      <div class="editor-container">
        <h1 contenteditable="true" class="editor__header">${
          this.currDocument.title
        }</h1>
        <div contenteditable="true" class="editor__content">${
          this.currDocument.content || ''
        }</div>
      </div>
      <div class="content-bottom"></div>
    `;
  };

  $editor.addEventListener('keyup', ({ target }) => {
    if (debounceTimer !== null) {
      clearTimeout(debounceTimer);
    }

    const id = this.currDocument.id;
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

  initState();
}
