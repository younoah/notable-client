'use strict';

import { getParentDocumentById } from '../utils/document.js';

export default function sidebarTemplateBuilder() {
  this.setRootDocuments = rootDocuments => {
    this.rootDocuments = rootDocuments;
    return this;
  };

  this.setToggledDocumentIds = toggledDocumentIds => {
    this.toggledDocumentIds = toggledDocumentIds;
    return this;
  };

  this.setSelectedDocumentId = selectedDocumentId => {
    this.selectedDocumentId = selectedDocumentId;
    return this;
  };

  this.build = () => {
    return new sidebarTemplate(
      this.rootDocuments,
      this.toggledDocumentIds,
      this.selectedDocumentId
    );
  };
}

function sidebarTemplate(
  rootDocuments,
  toggledDocumentIds,
  selectedDocumentId
) {
  this.rootDocuments = rootDocuments;
  this.toggledDocumentIds = toggledDocumentIds;
  this.selectedDocumentId = selectedDocumentId;

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

  const documentListTemplate = (document, childrenLength, isRoot = false) => {
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
            documentListTemplate(document, document.documents.length)
          )
          .join('')}
      </ul>
    `;
  };

  this.getSidebarTemplate = () => {
    return /* html */ `
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
            documentListTemplate(document, document.documents.length, true)
          )
          .join('')}
      <div>
    `;
  };
}
