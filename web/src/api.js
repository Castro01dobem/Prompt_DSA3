const defaultApiUrl = "http://localhost:8080/api";
const publicApiPaths = ["/auth/login"];
const validRoles = ["ADMIN", "PROFESSOR", "ALUNO"];

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
  if (!session?.token || !isValidUser(session.user) || !isTokenValid(session.token)) {
    throw new Error("Sessao invalida recebida da API");
  }

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
    const user = JSON.parse(raw);
    if (!isValidUser(user) || !isTokenValid(getToken())) {
      clearSession();
      return null;
    }

    return user;
  } catch {
    clearSession();
    return null;
  }
}

export function hasAuthenticatedSession() {
  return Boolean(getUser() && isTokenValid(getToken()));
}

export async function apiFetch(path, options = {}) {
  const protectedEndpoint = !isPublicApiPath(path);
  if (protectedEndpoint && !hasAuthenticatedSession()) {
    throw new Error("Sessao expirada. Faca login novamente.");
  }

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
    if (protectedEndpoint && (response.status === 401 || response.status === 403)) {
      clearSession();
    }

    throw new Error(data?.message || "Erro ao chamar API");
  }

  return data;
}

function isPublicApiPath(path) {
  return publicApiPaths.includes(path);
}

function isValidUser(user) {
  return Boolean(
    user &&
    typeof user === "object" &&
    user.id !== undefined &&
    user.id !== null &&
    typeof user.name === "string" &&
    user.name.trim() &&
    typeof user.email === "string" &&
    user.email.trim() &&
    validRoles.includes(user.role)
  );
}

function isTokenValid(token) {
  if (typeof token !== "string" || !token.trim()) {
    return false;
  }

  const payload = decodeJwtPayload(token);
  if (!payload) {
    return false;
  }

  if (payload.exp && Date.now() >= payload.exp * 1000) {
    return false;
  }

  return true;
}

function decodeJwtPayload(token) {
  const parts = token.split(".");
  if (parts.length !== 3) {
    return null;
  }

  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
}

