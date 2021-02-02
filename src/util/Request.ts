const urlPrefix = 'http://127.0.0.1:5000/api';

function request<T>(url: string, params?: RequestInit): Promise<T> {
  const newUrl = url.startsWith('http') || url.startsWith('https') ? url : urlPrefix + url;
  return fetch(newUrl, params)
    .then((res) => res.json())
    .then((json) => {
      if (json.message === 'success') {
        return json.data;
      }
      throw new Error('request error');
    });
}

export default request;
