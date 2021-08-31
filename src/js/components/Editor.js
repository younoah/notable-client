'use strict';

const documentDummyForContent = {
  id: 1,
  title: '문서1 제목',
  documents: [],
  createdAt: '2021-08-29T14:25:55.606Z',
  updatedAt: '2021-08-29T14:25:55.611Z',
  content: '문서1 본문 내용',
};

export default function Editor({ $target, initialState = {} }) {
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
      <div class="editor__title">
        <input type="text" style="width: 800px" value="${
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

  this.render();
}
