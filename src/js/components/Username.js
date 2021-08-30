'use strict';

export default function Username({ $target, name }) {
  console.log('--Username--');
  const $username = document.createElement('div');
  $target.append($username);

  this.render = () => {
    $username.innerHTML = `
      <h3 id="user-title">${name}</h3>
    `;
  };

  this.render();
}
