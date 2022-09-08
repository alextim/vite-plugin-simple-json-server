import './style.css';

updateView('<h1>Hello, Json Server</h1><ul id="examples"></ul>', '#app');

fetchApi('/api/home');

fetchApi('/api/json?count');

fetchApi('/api/json/?count&color=black');

fetchApi('/api/json/3');

fetchApi('/api/json?color=black', formatList);

fetchApi('/api/json?offset=5&limit=5&sort=-color', formatList);

fetchApi('/api/json/?id=3&id=8&id=9&color=black', formatList);

fetchApi('/api/json?offset=2&limit=3&color=black&sort=-id', formatList);

fetchApi('/api/json?offset=2&limit=3&color=black&sort=id', formatList);

fetchApi('/api/json?limit=5&sort=color,-id', formatList);

fetchApi('/api/json?limit=5&sort=rating.count,title', formatList);

function formatList(data) {
  if (!data || !Array.isArray(data)) {
    return '';
  }
  let s = '';
  data.forEach((item) => void (s += `<li>${JSON.stringify(item, null, '  ')}</li>`));
  return `<div>[</div><ul>${s}</ul><div>]</div>`;
}

function handleErrors(resp) {
  if (!resp.ok) {
    throw Error(`${resp.status} ${resp.statusText}`);
  }
  return resp;
}

function format(url, method) {
  return `${method || 'GET'} ${url}`;
}

function fetchApi(url, formatOutput = undefined, method = 'GET') {
  fetch(url, { method })
    .then(handleErrors)
    .then((resp) => {
      const isJson = resp.headers.get('content-type')?.includes('application/json');
      if (isJson) {
        return resp.json();
      }
      throw new Error('Response is not Json');
    })
    .then((data) => {
      updateView(`
      <li>
      <p>${format(url, method)}</p>
      ${formatOutput ? formatOutput(data) : JSON.stringify(data, null, '  ')}
      </li>
    `);
    })
    .catch((err) => {
      console.error(err.toString());
      updateView(`
      <li>
      <p>${format(url, method)}</p>
      ${err.toString()}
      </li>
    `);
    });
}

function updateView(s, id = '#examples') {
  document.querySelector(id).innerHTML += s;
}
