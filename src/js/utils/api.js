'use strict';

const BASE_URL = 'https://kdt.roto.codes';

const option = {
  post: contents => ({
    methods: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-username': 'younoah' },
    body: JSON.stringify(contents),
  }),
  put: contents => ({
    methods: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(contents),
  }),
  delete: () => ({
    methods: 'DELETE',
  }),
};

const request = async (url, option = {}) => {
  try {
    const response = await fetch(`${BASE_URL}${url}`, option);

    if (!response.ok) {
      throw new Error(response.status);
    }

    return await response.json();
  } catch (e) {
    alert(`💣 API Request Error : ${err} 💣`);
  }
};

export const API = {
  getRootDocuments: () => {
    return request('/documents');
  },
  addDocument: document => {
    const content = {
      title: document.title,
      parent: document.parent,
    };
    return request('/documents', option.post(content));
  },
  getDocument: id => {
    return request(`/documents/${id}`);
  },
  updateDocument: (id, document) => {
    const content = {
      title: document.title,
      parent: document.parent,
    };
    return request(`/documents/${id}`, option.put(content));
  },
  deleteDocument: id => {
    return request(`/documents/${id}`, option.delete());
  },
};
