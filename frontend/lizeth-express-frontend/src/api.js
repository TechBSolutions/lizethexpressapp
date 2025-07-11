// src/api.js

export const API = import.meta.env.VITE_BACKEND_URL;

// GET simple (igual a fetch pero usa el API base)
export function fetchApi(url, options) {
  // Si viene una URL absoluta, úsala tal cual
  if (url.startsWith('http')) return fetch(url, options);
  return fetch(`${API}${url}`, options);
}

// POST (envía body como JSON por defecto)
export function postApi(url, body, options) {
  return fetchApi(url, {
    ...options,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(options && options.headers),
    },
    body: JSON.stringify(body),
  });
}

// PUT
export function putApi(url, body, options) {
  return fetchApi(url, {
    ...options,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(options && options.headers),
    },
    body: JSON.stringify(body),
  });
}

// DELETE
export function deleteApi(url, options) {
  return fetchApi(url, {
    ...options,
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...(options && options.headers),
    },
  });
}
