const defaultApiUrl = "http://localhost:8080/api";

export function getApiUrl() {
  return localStorage.getItem("apiUrl") || defaultApiUrl;
}

export function setApiUrl(value) {
  localStorage.setItem("apiUrl", value || defaultApiUrl);
}

export function getToken() {
  return localStorage.getItem("token");
}

export function setSession(session) {
  localStorage.setItem("token", session.token);
  localStorage.setItem("user", JSON.stringify(session.user));
}

export function clearSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export function getUser() {
  const raw = localStorage.getItem("user");
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    clearSession();
    return null;
  }
}

export async function apiFetch(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${getApiUrl()}${path}`, {
    ...options,
    headers
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.message || "Erro ao chamar API");
  }

  return data;
}

