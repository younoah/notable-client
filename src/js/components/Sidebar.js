'use strict';

import {
  getParentDocumentById,
  getDescendantDocumentIdsById,
} from '../utils/document.js';
import sidebarTemplateBuilder from '../templates/sidebarTemplate.js';

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

  this.render = async () => {
    console.log('사이드바 렌더');
    const sidebarTemplate = new sidebarTemplateBuilder() //
      .setRootDocuments(this.rootDocuments)
      .setToggledDocumentIds(this.toggledDocumentIds)
      .setSelectedDocumentId(this.selectedDocumentId)
      .build();

    $sidebar.innerHTML = sidebarTemplate.getSidebarTemplate();
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
