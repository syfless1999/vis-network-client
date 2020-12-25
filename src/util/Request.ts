const urlPrefix = 'http://127.0.0.1:5000/api';

function request(url: string, params: any) {
  console.log(params);
  const newUrl = url.startsWith('http') || url.startsWith('https') ? url : urlPrefix + url;
  return fetch(newUrl, params)
    .then((res) => res.json());
}

export default request;
