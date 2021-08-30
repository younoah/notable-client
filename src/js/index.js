'use strict';
import { $ } from './utils/dom.js';
import App from './components/App.js';

const navbarDummy = [
  {
    id: 1,
    title: '문서1',
    documents: [],
    createdAt: '2021-08-29T14:25:55.606Z',
    updatedAt: '2021-08-29T14:25:55.611Z',
  },
  {
    id: 2,
    title: '문서2',
    documents: [
      {
        id: 4,
        title: '문서4',
        documents: [],
        createdAt: '2021-08-29T14:25:55.606Z',
        updatedAt: '2021-08-29T14:25:55.611Z',
      },
      {
        id: 5,
        title: '문서5',
        documents: [
          {
            id: 7,
            title: '문서7',
            documents: [],
            createdAt: '2021-08-29T14:25:55.606Z',
            updatedAt: '2021-08-29T14:25:55.611Z',
          },
          {
            id: 8,
            title: '문서8',
            documents: [
              {
                id: 9,
                title: '문서9',
                documents: [],
                createdAt: '2021-08-29T14:25:55.606Z',
                updatedAt: '2021-08-29T14:25:55.611Z',
              },
            ],
            createdAt: '2021-08-29T14:25:55.606Z',
            updatedAt: '2021-08-29T14:25:55.611Z',
          },
        ],
        createdAt: '2021-08-29T14:25:55.606Z',
        updatedAt: '2021-08-29T14:25:55.611Z',
      },
    ],
    createdAt: '2021-08-29T14:25:55.606Z',
    updatedAt: '2021-08-29T14:25:55.611Z',
  },
  {
    id: 3,
    title: '문서3',
    documents: [
      {
        id: 6,
        title: '문서6',
        documents: [],
        createdAt: '2021-08-29T14:25:55.606Z',
        updatedAt: '2021-08-29T14:25:55.611Z',
      },
    ],
    createdAt: '2021-08-29T14:25:55.606Z',
    updatedAt: '2021-08-29T14:25:55.611Z',
  },
];

const documentDummyForContent = {
  id: 1,
  title: '문서1',
  documents: [],
  createdAt: '2021-08-29T14:25:55.606Z',
  updatedAt: '2021-08-29T14:25:55.611Z',
  content: '문서1 본문 내용',
};

const $target = $('#app');
new App({ $target, initialState: navbarDummy });
