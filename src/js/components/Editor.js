'use strict';

import { $ } from '../utils/dom.js';
import { API } from '../utils/api.js';
import {
  mainPageTemplate,
  editorTemplate,
} from '../templates/editorTemplates.js';

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
    console.log('에디터 렌더');

    const isEmptyDocument = Object.keys(this.currDocument).length <= 0;
    window.document.title = isEmptyDocument
      ? 'Notable'
      : this.currDocument.title;

    if (isEmptyDocument) {
      $editor.innerHTML = mainPageTemplate();
      return;
    }

    $editor.innerHTML = editorTemplate(this.currDocument);
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
