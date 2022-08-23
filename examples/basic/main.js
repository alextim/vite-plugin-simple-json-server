import './style.css';

updateView('<h1>Hello, Json Server</h1>');

fetchApi('/api/home');

fetchApi('/api/test?color=active', 'GET', formatList);

fetchApi('/api/test?offset=5&limit=5&sort=color&order=desc', 'GET', formatList);

fetchApi('/api/test/count');

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

function fetchApi(url, method = 'GET', formatOutput = undefined) {
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
      <p>${format(url, method)}</p>
      ${formatOutput ? formatOutput(data) : JSON.stringify(data, null, '  ')}
    `);
    })
    .catch((err) => {
      updateView(`
      <p>${format(url, method)}</p>
      ${err.toString()}
    `);
    });
}

function updateView(s) {
  return (document.querySelector('#app').innerHTML += s);
}
