import './style.css';

document.querySelector('#app').innerHTML = '<h1>Hello, Vite</h1>';

let ep = '/api/home';
fetch(ep, { method: 'GET' })
  .then((response) => response.json())
  .then((data) => {
    document.querySelector('#app').innerHTML += `
      <p>${ep} GET response:</p>
      ${JSON.stringify(data, null, '  ')}
    `;
  });

ep = '/api/home';
fetch(ep, { method: 'PUT' })
  .then((response) => response.json())
  .then((data) => {
    document.querySelector('#app').innerHTML += `
      <p>${ep} PUT response:</p>
      ${JSON.stringify(data, null, '  ')}
    `;
  });

ep = '/api/lines';
fetch(ep, { method: 'GET' })
  .then((response) => response.json())
  .then((data) => {
    document.querySelector('#app').innerHTML += `
      <p>${ep} GET response:</p>
      ${JSON.stringify(data, null, '  ')}
    `;
  });

ep = '/api/test?_page=2&_limit=10&_sort=color&_order=desc';
fetch(ep, { method: 'GET' })
  .then((response) => response.json())
  .then((data) => {
    let s = '';
    data.forEach((item) => (s += `<li>${JSON.stringify(item, null, '  ')}</li>`));
    document.querySelector('#app').innerHTML += `
      <p>${ep} GET response:</p>
      <div>[</div><ul>${s}</ul><div>]</div>
    `;
  });

ep = '/api/test?_page=2&_limit=10&_sort=color&_order=desc';
fetch(ep, { method: 'PUT' })
  .then((response) => response.json())
  .then((data) => {
    document.querySelector('#app').innerHTML += `
      <p>${ep} PUT response:</p>
      ${JSON.stringify(data, null, '  ')}
    `;
  });
