'use strict';

import { $ } from '../utils/dom.js';
import { API } from '../utils/api.js';
import { dispatchRouteEvent } from '../utils/router.js';

export default function Sidebar({ $target, initialState = [], renderEditor }) {
  const $sidebar = document.createElement('nav');
  $sidebar.id = 'sidebar';
  $target.append($sidebar);
  this.state = initialState;

  $sidebar.addEventListener('click', async ({ target }) => {
    // 사이드바가 리렌더링 x
    if (target.matches('.logo-title') || target.matches('.fa-accusoft')) {
      renderEditor();
      return;
    }

    if (target.matches('.document-title')) {
      // 사이드바가 리렌더링 x
      const { id } = target.closest('li').dataset;
      const $clickedDocumentContainer = $('.document-container.clicked ');
      const $targetDocumentContainer = target.closest('.document-container');

      if ($clickedDocumentContainer !== null) {
        $clickedDocumentContainer.classList.remove('clicked');
      }
      $targetDocumentContainer.classList.toggle('clicked');

      renderEditor(Number(id));
      return;
    }

    if (target.matches('.fa-caret-right')) {
      // 사이드바가 리렌더링 x
      const $moreButton = target.closest('.more-button');
      const $documentList = target.closest('.document-list');
      $moreButton.classList.toggle('clicked');
      toggleChildDocumentLists($documentList);
      return;
    }

    if (target.matches('.add-root-button-title')) {
      // 사이드바가 리렌더링 o
      addDocument();
      return;
    }

    if (target.matches('.fa-plus')) {
      // 사이드바가 리렌더링 o
      const { id: parentId } = target.closest('li').dataset;
      addDocument(Number(parentId));
      return;
    }

    if (target.matches('.fa-trash')) {
      // 사이드바가 리렌더링 o
      const { id } = target.closest('li').dataset;
      deleteDocument(id);
      return;
    }
  });

  const addDocument = async (parentId = null) => {
    const title = prompt('새로 추가할 문서의 제목을 작성해주세요.');

    if (title === null) {
      return;
    }

    const document = {
      parent: parentId,
      title: title.trim() !== '' ? title.trim() : '제목없음',
    };
    const { id } = await API.addDocument(document);

    dispatchRouteEvent(`/documents/${id}`);
  };

  const deleteDocument = async id => {
    if (!confirm('정말 해당 문서를 삭제하시겠습니까?')) return;
    await API.deleteDocument(id);
    dispatchRouteEvent(`/`);
  };

  const toggleChildDocumentLists = $documentList => {
    const childDocumentLists = [...$documentList.children].filter($node =>
      $node.matches('.document-list')
    );

    childDocumentLists.forEach($documentList =>
      $documentList.classList.toggle('hide')
    );
  };

  const renderDocumentList = (document, childrenLength, isRoot) => {
    return /* html */ `
      <ul class="document-list ${isRoot ? '' : 'hide'}">
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
          .map(document =>
            renderDocumentList(document, document.documents.length, false)
          )
          .join('')}
      </ul>
    `;
  };

  this.setState = async () => {
    this.state = await API.getRootDocuments();
    this.render();
  };

  this.render = async () => {
    $sidebar.innerHTML = /* html */ `
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
            renderDocumentList(document, document.documents.length, true)
          )
          .join('')}
      <div>
    `;
  };
}
