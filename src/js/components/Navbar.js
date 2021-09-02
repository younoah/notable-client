'use strict';

import { $ } from '../utils/dom.js';
import { API } from '../utils/api.js';
import { dispatchRouteEvent } from '../utils/router.js';

export default function Navbar({
  $target,
  initialState,
  onClickDocument,
  onUpdateEditor,
}) {
  this.state = initialState;
  const $navbar = document.createElement('nav');
  $navbar.id = 'sidebar';

  $target.append($navbar);
  $navbar.addEventListener('click', async ({ target }) => {
    if (target.matches('.logo-title') || target.matches('.fa-accusoft')) {
      dispatchRouteEvent(`/`);
      return;
    }

    if (target.matches('.document-title')) {
      const { id } = target.closest('li').dataset;
      const $clickedDocumentContainer = $('.document-container.clicked ');
      const $documentContainer = target.closest('.document-container');

      if ($clickedDocumentContainer !== null) {
        $clickedDocumentContainer.classList.remove('clicked');
      }
      $documentContainer.classList.toggle('clicked');

      onClickDocument(Number(id));
      dispatchRouteEvent(`/documents/${id}`);
    }

    if (target.matches('.add-root-button-title')) {
      const { id } = await addDocument();
      this.setState();
      onClickDocument(Number(id));
      dispatchRouteEvent(`/documents/${id}`);
      return;
    }

    if (target.matches('.fa-plus')) {
      const $li = target.closest('li');
      const { id: parentId } = $li.dataset;
      const { id } = await addDocument(Number(parentId));
      this.setState();
      onClickDocument(Number(id));
      dispatchRouteEvent(`/documents/${id}`);

      return;
    }

    if (target.matches('.fa-trash')) {
      if (!confirm('정말 해당 문서를 삭제하시겠습니까?')) return;
      const $li = target.closest('li');
      const { id } = $li.dataset;
      await deleteDocument(Number(id));
      this.setState();
      onUpdateEditor();
      dispatchRouteEvent(`/`);
      return;
    }

    if (target.matches('.fa-caret-right')) {
      const $moreButton = target.closest('.more-button');
      $moreButton.classList.toggle('clicked');
      const $documentList = target.closest('.document-list');
      toggleChildDocumentLists($documentList);
    }
  });

  const toggleChildDocumentLists = function recur($documentList) {
    const childDocumentLists = [...$documentList.children].filter($node =>
      $node.matches('.document-list')
    );
    childDocumentLists.forEach($documentList =>
      $documentList.classList.toggle('hide')
    );
  };

  const renderDocumentList = function recur(document, i, childrenLength) {
    i++;
    return /* html */ `
      <ul class="document-list ${i > 1 ? 'hide' : ''}">
        <li data-id=${document.id} class="document-item">
          <div class="document-container">
            ${
              childrenLength > 0
                ? /* html */ `
              <button class="more-button">
                <i class="fas fa-caret-right"></i>
              </button>
            `
                : /* html */ `
                  <span class="dot">
                  <i class="fas fa-genderless"></i>
                  </span>
                `
            }
            <span class="document-title">${document.title}</span>
          </div>
          <div class="document-buttons">
            <button class="add-button">
              <i class="fas fa-plus"></i>
            </button>
            <button class="delete-button">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </li>
        ${document.documents
          .map(document => recur(document, i, document.documents.length))
          .join('')}
      </ul>
    `;
  };

  const addDocument = async (id = null) => {
    const title = prompt('새로 추가할 문서의 제목을 작성해주세요.').trim();

    if (title === null) return;

    const document = {
      parent: id,
      title: title !== '' ? title : '제목없음',
    };

    return await API.addDocument(document);
  };

  const deleteDocument = async id => {
    await API.deleteDocument(id);
  };

  this.setState = async () => {
    this.state = await API.getRootDocuments();
    this.render();
  };

  this.render = async () => {
    $navbar.innerHTML = /* html */ `
      <header class="sidebar__header">
        <div class="logo">
          <i class="fab fa-accusoft"></i>
          <span class="logo-title">Notable</span>
        </div>
        <button class="hide-button">
          <i class="fas fa-bars"></i>
        </button>
      </header>
      <div class="sidebar__add-button">
        <button class="add-root-button">
          <i class="fas fa-plus"></i>
          <span class="add-root-button-title">New Document</span>
        </button>
      </div>
      <div class="sidebar__document-list-container">
        ${this.state
          .map(document =>
            renderDocumentList(document, 0, document.documents.length)
          )
          .join('')}
      <div>
    `;
  };
}
