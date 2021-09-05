'use strict';

export const findDocumentById = (rootDocuments, id) => {
  let targetDocument = null;
  const stack = [...rootDocuments];

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

export const getParentDocumentById = (rootDocuments, id) => {
  let parentDocument = null;
  const stack = [...rootDocuments];

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

export const getChildDocumentsById = (rootDocuments, id) => {
  const document = findDocumentById(rootDocuments, id);

  return [...document.documents];
};

export const getChildDocumentIdsById = (rootDocuments, id) => {
  const document = findDocumentById(rootDocuments, id);

  return document.documents.map(childDocument => childDocument.id);
};

export const getDescendantDocumentsById = (rootDocuments, id) => {
  const startingDocument = findDocumentById(rootDocuments, id);
  const descendantDocuments = [];
  const stack = [...startingDocument.documents];

  while (stack.length > 0) {
    const currDocument = stack.pop();
    currDocument.documents.forEach(childDocument => stack.push(childDocument));
    descendantDocuments.push(currDocument);
  }

  return descendantDocuments;
};

export const getDescendantDocumentIdsById = (rootDocuments, id) => {
  const startingDocument = findDocumentById(rootDocuments, id);
  const descendantDocumentIds = [];
  const stack = [...startingDocument.documents];

  while (stack.length > 0) {
    const currDocument = stack.pop();
    currDocument.documents.forEach(childDocument => stack.push(childDocument));
    descendantDocumentIds.push(currDocument.id);
  }

  return descendantDocumentIds;
};
