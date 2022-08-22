import './style.css';

document.querySelector('#app').innerHTML = '<h1>Hello, Json Server</h1>';

const ep1 = '/api/home';
fetch(ep1, { method: 'GET' })
  .then((response) => response.json())
  .then((data) => {
    document.querySelector('#app').innerHTML += `
      <p>${ep1} GET response:</p>
      ${JSON.stringify(data, null, '  ')}
    `;
  });

const ep2 = '/api/test?color=active';
fetch(ep2, { method: 'GET' })
  .then((response) => response.json())
  .then((data) => {
    document.querySelector('#app').innerHTML += `
      <p>${ep2} GET response:</p>
      ${JSON.stringify(data, null, '  ')}
    `;
  });

const ep3 = '/api/test?offset=5&limit=5&sort=color&order=desc';
fetch(ep3, { method: 'GET' })
  .then((response) => response.json())
  .then((data) => {
    let s = '';
    data.forEach((item) => (s += `<li>${JSON.stringify(item, null, '  ')}</li>`));
    document.querySelector('#app').innerHTML += `
      <p>${ep3} GET response:</p>
      <div>[</div><ul>${s}</ul><div>]</div>
    `;
  });

const ep4 = '/api/test/count';
fetch(ep4, { method: 'GET' })
  .then((response) => response.json())
  .then((data) => {
    document.querySelector('#app').innerHTML += `
      <p>${ep4} GET response:</p>
      ${JSON.stringify(data, null, '  ')}
    `;
  });
