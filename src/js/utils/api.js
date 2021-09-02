'use strict';

const BASE_URL = 'https://kdt.roto.codes';
const USER_NAME = 'younoah';

const option = {
  get: () => ({
    headers: {
      'Content-Type': 'application/json',
      'x-username': `${USER_NAME}`,
    },
  }),
  post: contents => ({
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-username': `${USER_NAME}`,
    },
    body: JSON.stringify(contents),
  }),
  put: contents => ({
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-username': `${USER_NAME}`,
    },
    body: JSON.stringify(contents),
  }),
  delete: () => ({
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'x-username': `${USER_NAME}`,
    },
  }),
};

const request = async (url, option = {}) => {
  try {
    const response = await fetch(`${BASE_URL}${url}`, option);

    if (!response.ok) {
      throw new Error(response.status);
    }

    return await response.json();
  } catch (error) {
    alert(`💣 API Request Error - ${error} 💣`);
  }
};

export const API = {
  getRootDocuments: () => {
    return request('/documents', option.get());
  },
  addDocument: document => {
    return request('/documents', option.post(document));
  },
  getDocument: id => {
    return request(`/documents/${id}`, option.get());
  },
  updateDocument: (id, document) => {
    return request(`/documents/${id}`, option.put(document));
  },
  deleteDocument: id => {
    return request(`/documents/${id}`, option.delete());
  },
};
