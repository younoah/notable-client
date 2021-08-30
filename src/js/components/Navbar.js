'use strict';

import Username from './Username.js';
import { API } from '../utils/api.js';

export default function Navbar({ $target, initialState }) {
  console.log('--Navbar--');
  this.state = initialState;
  const $navbar = document.createElement('nav');
  $navbar.className = 'navbar';

  $target.append($navbar);
  $navbar.addEventListener('click', ({ target }) => {});

  const renderDocumentList = function recur(document) {
    return /* html */ `
      <ul class="navbar__list">
        <li data-id="${document.id}" class="navbar__list__document">
          ${document.title} <button class="add-document-button">추가</button
          ><button class="delete-document-button">삭제</button>
        </li>
        ${document.documents.map(document => recur(document)).join('')}
      </ul>
    `;
  };

  // this.setState = nextState => {
  //   this.state = nextState;
  //   this.render();
  // };

  this.render = async () => {
    const rootDocuments = await API.getRootDocuments();

    $navbar.innerHTML = /* html */ `
      <div class="navbar__user">
        <h3 id="user-title">유저이름</h3>
      </div>
      ${rootDocuments.map(document => renderDocumentList(document)).join('')}
    `;
  };

  this.render();
}
