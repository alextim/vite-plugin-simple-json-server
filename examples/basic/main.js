import './style.css';

document.querySelector('#app').innerHTML = `<h1>Hello, Vite</h1>`;

fetch('/api/home')
  .then((response) => response.json())
  .then((data) => {
    document.querySelector('#app').innerHTML += `
      <p>/api/home response:</p>
      ${JSON.stringify(data)}
    `;
  });

fetch('/api/user', {
  method: 'GET',
})
  .then((response) => response.json())
  .then((data) => {
    document.querySelector('#app').innerHTML += `
      <p>/api/user GET response:</p>
      ${JSON.stringify(data)}
    `;
  });
