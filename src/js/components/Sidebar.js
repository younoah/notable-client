'use strict';

import {
  getParentDocumentById,
  getDescendantDocumentIdsById,
} from '../utils/document.js';

const MESSAGE = Object.freeze({
  NEW_DOCUMENT: '새로 추가할 문서의 제목을 작성해주세요.',
  DELETE_DOCUMENT: '정말 해당 문서를 삭제하시겠습니까?',
});

const DEFAULT_DOCUMENT_TITLE = '제목없음';

export default function Sidebar({
  $target,
  rootDocuments = [],
  selectedDocumentId = null,
  onClickLogo,
  onClickDocument,
  onAddDocument,
  onDeleteDocument,
}) {
  const $sidebar = document.createElement('nav');
  $sidebar.id = 'sidebar';
  $target.append($sidebar);

  const initState = () => {
    this.rootDocuments = rootDocuments;
    this.selectedDocumentId = selectedDocumentId;
    this.toggledDocumentIds = [];
  };

  this.setState = ({
    nextRootDocuments = this.rootDocuments,
    nextSelectedDocumentId = this.selectedDocumentId,
    nextToggledDocumentIds = this.toggledDocumentIds,
  }) => {
    this.rootDocuments = nextRootDocuments;
    this.selectedDocumentId = nextSelectedDocumentId;
    this.toggledDocumentIds = nextToggledDocumentIds;

    this.render();
  };

  const addDocument = async (parentId = null) => {
    const title = prompt(MESSAGE.NEW_DOCUMENT);

    if (title === null) {
      return;
    }

    const newDocument = {
      parent: parentId,
      title: title.trim() !== '' ? title.trim() : DEFAULT_DOCUMENT_TITLE,
    };

    onAddDocument(newDocument);
  };

  const openDocument = target => {
    const { id: targetId } = target.closest('.document-item').dataset;

    if (this.toggledDocumentIds.includes(Number(targetId))) return;
    const nextToggledDocumentIds = [
      ...this.toggledDocumentIds,
      Number(targetId),
    ];
    this.setState({
      nextToggledDocumentIds,
    });
  };

  const closeDocument = target => {
    const { id: targetId } = target.closest('.document-item').dataset;
    const targetAndDescendantDocumentIds = [
      ...getDescendantDocumentIdsById(this.rootDocuments, Number(targetId)),
      Number(targetId),
    ];

    const nextToggledDocumentIds = this.toggledDocumentIds.filter(
      id => !targetAndDescendantDocumentIds.includes(id)
    );
    this.setState({
      nextToggledDocumentIds,
    });
  };

  const isToggledChild = document => {
    let res = false;
    const parentDocument = getParentDocumentById(
      this.rootDocuments,
      document.id
    );

    if (this.toggledDocumentIds.includes(parentDocument.id)) {
      res = true;
    }

    return res;
  };

  const renderDocumentList = (document, childrenLength, isRoot = false) => {
    const { id, title } = document;

    return /* html */ `
      <ul class="document-list ${
        isRoot || isToggledChild(document) ? '' : 'hide'
      }">
        <li data-id=${document.id} class="document-item">
          <div class="document-container ${
            this.selectedDocumentId === id ? 'selected' : ''
          }">
            ${
              childrenLength > 0
                ? /* html */ `
              <button class="more-button ${
                this.toggledDocumentIds.includes(id) ? 'toggled' : ''
              }">
                <i class="fas fa-caret-right"></i>
              </button>
            `
                : /* html */ `
                  <span class="dot">
                    <i class="fas fa-genderless"></i>
                  </span>
                `
            }
            <span class="document-title">${title}</span>
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
            renderDocumentList(document, document.documents.length)
          )
          .join('')}
      </ul>
    `;
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
        ${this.rootDocuments
          .map(document =>
            renderDocumentList(document, document.documents.length, true)
          )
          .join('')}
      <div>
    `;
  };

  $sidebar.addEventListener('click', async ({ target }) => {
    if (target.matches('.logo-title') || target.matches('.fa-accusoft')) {
      onClickLogo();
      return;
    }

    if (target.matches('.document-title')) {
      const { id } = target.closest('li').dataset;
      onClickDocument(Number(id));
      return;
    }

    if (target.matches('.fa-caret-right')) {
      const $moreButton = target.closest('.more-button');
      $moreButton.matches('.toggled')
        ? closeDocument(target)
        : openDocument(target);

      return;
    }

    if (target.matches('.add-root-button-title')) {
      addDocument();
      return;
    }

    if (target.matches('.fa-plus')) {
      const { id: parentId } = target.closest('li').dataset;
      addDocument(Number(parentId));
      return;
    }

    if (target.matches('.fa-trash')) {
      if (!confirm(MESSAGE.DELETE_DOCUMENT)) return;
      const { id } = target.closest('li').dataset;
      onDeleteDocument(Number(id));
      return;
    }
  });

  initState();
}
