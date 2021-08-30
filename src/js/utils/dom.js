'use strict';

export const $ = (selector, element = document) =>
  element.querySelector(selector);
