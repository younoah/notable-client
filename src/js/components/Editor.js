'use strict';

import { $ } from '../utils/dom.js';
import {
  mainPageTemplate,
  editorTemplate,
} from '../templates/editorTemplates.js';

export default function Editor({
  $target,
  currDocument = {},
  onUpdateDocument,
}) {
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
    const titleText = $('.editor__header', $editor).innerText.trim();
    const title = titleText === '' ? '제목없음' : titleText;
    const content = $('.editor__content', $editor).innerText.trim();

    debounceTimer = setTimeout(async () => {
      onUpdateDocument(id, title, content);
    }, 1500);
  });

  initState();
}
