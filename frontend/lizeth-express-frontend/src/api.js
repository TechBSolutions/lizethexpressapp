const API_BASE = import.meta.env.VITE_BACKEND_URL;

export const fetchApi = (path, options = {}) => {
  // Siempre asegura que la ruta tenga el prefijo /api
  const url =
    API_BASE.replace(/\/$/, "") +
    "/api" +
    (path.startsWith("/") ? path : "/" + path);

  return fetch(url, options);
};
