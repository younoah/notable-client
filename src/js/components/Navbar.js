'use strict';

import Username from './Username.js';

export default function Navbar({ $target, initialState }) {
  console.log('--Navbar--');
  this.state = initialState;
  const $navbar = document.createElement('nav');
  $navbar.className = 'navbar';

  $target.append($navbar);
  $navbar.addEventListener('click', ({ target }) => {});

  const renderDocumentList = function recur(document) {
    const childDocuments = document.documents;

    return /* html */ `
      <ul class="navbar__list">
        <li data-id="${document.id}" class="navbar__list__document">
          ${document.title} <button class="add-document-button">추가</button
          ><button class="delete-document-button">삭제</button>
        </li>
        ${childDocuments.map(document => recur(document)).join('')}
      </ul>
    `;
  };

  this.setState = () => {};

  this.render = () => {
    $navbar.innerHTML = /* html */ `
      <div class="navbar__user">
        <h3 id="user-title">유저이름</h3>
      </div>
      ${this.state.map(document => renderDocumentList(document)).join('')}
    `;
  };

  this.render();
}
