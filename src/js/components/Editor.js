'use strict';

export default function Editor({ $target, initialState }) {
  const $editor = document.createElement('div');
  $target.append($editor);

  $editor.addEventListener('keyup', ({ target }) => {
    console.log('Editor - keyup');
  });

  this.state = initialState;

  this.setState = nextState => {
    this.state = nextState;
    this.render();
  };

  this.render = () => {
    $editor.innerHTML = /* html */ `
      <div class="editor__header">
        <h1>제목</h1>
      </div>
      <div class="editor__title">
        <input type="text" style="width: 800px" />
      </div>
      <div class="ediotr__content">
        <textarea
          name="content"
          id="content"
          style="width: 800px; height: 400px"
        ></textarea>
      </div>
    `;
  };

  this.render();
}
