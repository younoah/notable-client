'use strict';

export const findDocumentById = (documents, id) => {
  let targetDocument = null;
  const stack = [...documents];

  while (stack.length > 0) {
    const currDocument = stack.pop();

    if (currDocument.id === id) {
      targetDocument = currDocument;
      break;
    }
    currDocument.documents.forEach(childDocument => stack.push(childDocument));
  }

  return targetDocument;
};

export const getParentDocumentById = (documents, id) => {
  let parentDocument = null;
  const stack = [...documents];

  while (stack.length > 0) {
    const currDocument = stack.pop();
    const childDocumentIds = currDocument.documents.map(
      childDocument => childDocument.id
    );

    if (childDocumentIds.includes(id)) {
      parentDocument = currDocument;
      break;
    }
    currDocument.documents.forEach(childDocument => stack.push(childDocument));
  }

  return parentDocument;
};

export const getChildDocumentsById = (documents, id) => {
  const document = findDocumentById(documents, id);

  return [...document.documents];
};

export const getChildDocumentIdsById = (documents, id) => {
  const document = findDocumentById(documents, id);

  return document.documents.map(childDocument => childDocument.id);
};

export const getDescendantDocumentsById = (documents, id) => {
  const startingDocument = findDocumentById(documents, id);
  const descendantDocuments = [];
  const stack = [...startingDocument.documents];

  while (stack.length > 0) {
    const currDocument = stack.pop();
    currDocument.documents.forEach(childDocument => stack.push(childDocument));
    descendantDocuments.push(currDocument);
  }

  return descendantDocuments;
};

export const getDescendantDocumentIdsById = (documents, id) => {
  const startingDocument = findDocumentById(documents, id);
  const descendantDocumentIds = [];
  const stack = [...startingDocument.documents];

  while (stack.length > 0) {
    const currDocument = stack.pop();
    currDocument.documents.forEach(childDocument => stack.push(childDocument));
    descendantDocumentIds.push(currDocument.id);
  }

  return descendantDocumentIds;
};
