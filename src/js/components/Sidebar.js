'use strict';

export default function Sidebar({
  $target,
  rootDocuments = [],
  currDocumentId = null,
  onAddDocument,
  onDeleteDocument,
  onClickDocument,
  onClickLogo,
}) {
  const $sidebar = document.createElement('nav');
  $sidebar.id = 'sidebar';
  $target.append($sidebar);

  const initState = () => {
    this.rootDocuments = rootDocuments;
    this.currDocumentId = currDocumentId;
    this.openedDocuments = [];
    this.rootDocuments.forEach(document =>
      this.openedDocuments.push(document.id)
    );
  };

  initState();

  this.setState = ({
    nextRootDocuments = this.rootDocuments,
    nextCurrDocumentId = this.currDocumentId,
    nextOpenedDocuments = this.openedDocuments,
  }) => {
    this.rootDocuments = nextRootDocuments;
    this.currDocumentId = nextCurrDocumentId;
    this.openedDocuments = nextOpenedDocuments;

    if (
      !this.openedDocuments.includes(this.currDocumentId) &&
      this.currDocumentId !== null
    ) {
      this.openedDocuments.push(this.currDocumentId);
    }

    this.render();
  };

  $sidebar.addEventListener('click', async ({ target }) => {
    // 사이드바가 리렌더링 x
    if (target.matches('.logo-title') || target.matches('.fa-accusoft')) {
      onClickLogo();
      return;
    }

    if (target.matches('.document-title')) {
      // 사이드바가 리렌더링 x
      const { id } = target.closest('li').dataset;
      onClickDocument(Number(id));
      return;
    }

    if (target.matches('.fa-caret-right')) {
      const { id } = target.closest('.document-item').dataset;
      const childDocuments = getChildDocumentsById(Number(id));
      const childDocumentIds = childDocuments.map(document => document.id);
      this.setState({
        nextOpenedDocuments: [...this.openedDocuments, ...childDocumentIds],
      });

      const $moreButton = target.closest('.more-button');
      $moreButton.classList.toggle('clicked');
      console.log($moreButton);
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
      if (!confirm('정말 해당 문서를 삭제하시겠습니까?')) return;
      const { id } = target.closest('li').dataset;
      onDeleteDocument(Number(id));
      return;
    }
  });

  const getChildDocumentsById = id => {
    const document = findDocument(id);

    return [...document.documents];
  };

  const findDocument = id => {
    let targetDocument = null;
    const stack = [...this.rootDocuments];

    while (stack.length > 0) {
      const currDocument = stack.pop();

      if (currDocument.id === id) {
        targetDocument = currDocument;
        break;
      }
      currDocument.documents.forEach(document => stack.push(document));
    }

    return targetDocument;
  };

  const addDocument = async (parentId = null) => {
    const title = prompt('새로 추가할 문서의 제목을 작성해주세요.');

    if (title === null) {
      return;
    }

    const newDocument = {
      parent: parentId,
      title: title.trim() !== '' ? title.trim() : '제목없음',
    };

    onAddDocument(newDocument);
  };

  const renderDocumentList = (document, childrenLength) => {
    const { id, title } = document;
    return /* html */ `
      <ul class="document-list ${
        this.openedDocuments.includes(id) ? '' : 'hide'
      }">
        <li data-id=${document.id} class="document-item">
          <div class="document-container ${
            this.currDocumentId === id ? 'clicked' : ''
          }">
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
            renderDocumentList(document, document.documents.length, false)
          )
          .join('')}
      </ul>
    `;
  };

  this.render = async () => {
    console.log('사이드바 렌더');
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
}
