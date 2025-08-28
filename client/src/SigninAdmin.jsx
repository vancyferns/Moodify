import { v4 as uuidv4 } from 'uuid';

const API_BASE = import.meta.env.VITE_AUTH_API || "http://localhost:5002";
const USE_MOCK = (import.meta.env.VITE_USE_MOCK_AUTH || "false") === "true";

// Local session utils - unchanged
const saveSession = (payload) => {
  localStorage.setItem("moodify_auth", JSON.stringify(payload));
};
export const loadSession = () => {
  const raw = localStorage.getItem("moodify_auth");
  return raw ? JSON.parse(raw) : null;
};
export const clearSession = () => localStorage.removeItem("moodify_auth");

// SIGNUP: Send plain password to the backend for secure hashing
export async function signup({ name, email, password }) {
  if (USE_MOCK) {
    const users = JSON.parse(localStorage.getItem("moodify_users") || "[]");
    if (users.find((u) => u.email === email)) {
      return { ok: false, error: "Email already registered" };
    }
    users.push({ name, email, password });
    localStorage.setItem("moodify_users", JSON.stringify(users));
    const session = { user: { name, email }, token: uuidv4() };
    saveSession(session);
    return { ok: true, data: session };
  }

  const res = await fetch(`${API_BASE}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ name, email, password }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    return { ok: false, error: errorData.error || `Signup failed with status: ${res.status}` };
  }

  const data = await res.json();
  saveSession(data);
  return { ok: true, data };
}

// SIGNIN: Send plain password to the backend for secure comparison
export async function signin({ email, password }) {
  if (USE_MOCK) {
    const users = JSON.parse(localStorage.getItem("moodify_users") || "[]");
    const user = users.find((u) => u.email === email);
    if (!user || user.password !== password) {
      return { ok: false, error: "Invalid credentials" };
    }
    const session = { user: { name: user.name || email.split("@")[0], email }, token: uuidv4() };
    saveSession(session);
    return { ok: true, data: session };
  }

  const res = await fetch(`${API_BASE}/api/auth/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    return { ok: false, error: errorData.error || `Signin failed with status: ${res.status}` };
  }

  const data = await res.json();
  saveSession(data);
  return { ok: true, data };
}

// SIGNIN (ADMIN): Fixed the URL to point to the correct admin endpoint
export async function signinAdmin({ email, password }) {
  if (USE_MOCK) {
    const admins = JSON.parse(localStorage.getItem("moodify_admins") || "[]");
    const admin = admins.find((a) => a.email === email);
    if (!admin || admin.password !== password) {
      return { ok: false, error: "Invalid credentials" };
    }
    const session = { user: { name: admin.name || email.split("@")[0], email, role: "admin" }, token: uuidv4() };
    saveSession(session);
    return { ok: true, data: session };
  }

  const res = await fetch(`${API_BASE}/api/auth/signin/admin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    return { ok: false, error: errorData.error || `Admin signin failed with status: ${res.status}` };
  }

  const data = await res.json();
  saveSession(data);
  return { ok: true, data };
}
