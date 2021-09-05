'use strict';

export const editorTemplate = document => {
  return /* html */ `
    <div class="editor-container">
      <h1 contenteditable="true" class="editor__header">${document.title}</h1>
      <div contenteditable="true" class="editor__content">${
        document.content || ''
      }</div>
    </div>
    <div class="content-bottom"></div>
  `;
};

export const mainPageTemplate = () => {
  return /* html */ `
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
};
