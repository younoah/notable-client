'use strict';
import { $ } from './utils/dom.js';
import App from './components/App.js';

const navbarDummy = [
  {
    id: 1,
    title: '루트문서1',
    documents: [],
    createdAt: '2021-08-29T14:25:55.606Z',
    updatedAt: '2021-08-29T14:25:55.611Z',
  },
  {
    id: 2,
    title: '루트문서1',
    documents: [
      {
        id: 4,
        title: '루트문서1',
        documents: [],
        createdAt: '2021-08-29T14:25:55.606Z',
        updatedAt: '2021-08-29T14:25:55.611Z',
      },
      {
        id: 5,
        title: '루트문서1',
        documents: [],
        createdAt: '2021-08-29T14:25:55.606Z',
        updatedAt: '2021-08-29T14:25:55.611Z',
      },
    ],
    createdAt: '2021-08-29T14:25:55.606Z',
    updatedAt: '2021-08-29T14:25:55.611Z',
  },
  {
    id: 3,
    title: '루트문서1',
    documents: [
      {
        id: 6,
        title: '루트문서1',
        documents: [],
        createdAt: '2021-08-29T14:25:55.606Z',
        updatedAt: '2021-08-29T14:25:55.611Z',
      },
    ],
    createdAt: '2021-08-29T14:25:55.606Z',
    updatedAt: '2021-08-29T14:25:55.611Z',
  },
];

const $target = $('#app');
new App({ $target, initialState: navbarDummy });
