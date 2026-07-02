const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:3001/api";

const getStoredToken = () => localStorage.getItem("portalToken") || "";
const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("portalUser") || "null");
  } catch {
    return null;
  }
};

const getAuthHeaders = () => {
  const headers = { "Content-Type": "application/json" };
  const token = getStoredToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

export const apiGet = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...(options.headers || {}),
    },
    credentials: "include",
  });

  if (!response.ok) {
    const errorPayload = await response
      .json()
      .catch(() => ({ message: response.statusText }));
    throw new Error(errorPayload.message || "Request failed");
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};

export const apiPost = async (path, body, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...(options.headers || {}),
    },
    credentials: "include",
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorPayload = await response
      .json()
      .catch(() => ({ message: response.statusText }));
    throw new Error(errorPayload.message || "Request failed");
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};

export const isAuthenticated = () => Boolean(getStoredToken());
export const getCurrentUser = () => getStoredUser();
