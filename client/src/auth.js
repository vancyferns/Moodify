import bcrypt from "bcryptjs";
import CryptoJS from "crypto-js";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://humble-goldfish-4j9wgq46wr6j3j6xj-5002.app.github.dev";
const USE_MOCK = (import.meta.env.VITE_USE_MOCK_AUTH || "false") === "true";

// Helper: Deterministic hash using SHA-256
function sha256Hash(str) {
  return CryptoJS.SHA256(str).toString();
}

// Local session utils
const saveSession = (payload) => {
  localStorage.setItem("moodify_auth", JSON.stringify(payload));
};
export const loadSession = () => {
  const raw = localStorage.getItem("moodify_auth");
  return raw ? JSON.parse(raw) : null;
};
export const clearSession = () => localStorage.removeItem("moodify_auth");

// SIGNUP
export async function signup({ name, email, password }) {
  if (USE_MOCK) {
    const hashed = await bcrypt.hash(password, 10);
    const users = JSON.parse(localStorage.getItem("moodify_users") || "[]");
    if (users.find((u) => u.email === email)) {
      return { ok: false, error: "Email already registered" };
    }
    users.push({ name, email, hashed });
    localStorage.setItem("moodify_users", JSON.stringify(users));
    const session = { user: { name, email }, token: "mock-token" };
    saveSession(session);
    return { ok: true, data: session };
  }

  const shaHashed = sha256Hash(password); // <-- Deterministic hash
  const res = await fetch(`${API_BASE}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ name, email, password: shaHashed }),
  });
  if (!res.ok)
    return { ok: false, error: (await res.json()).error || "Signup failed" };
  const data = await res.json();
  saveSession(data);
  return { ok: true, data };
}

// SIGNIN
export async function signin({ email, password }) {
  if (USE_MOCK) {
    const users = JSON.parse(localStorage.getItem("moodify_users") || "[]");
    const user = users.find((u) => u.email === email);
    if (!user) return { ok: false, error: "Invalid credentials" };
    const match = await bcrypt.compare(password, user.hashed);
    if (!match) return { ok: false, error: "Invalid credentials" };
    const session = { user: { name: user.name || email.split("@")[0], email }, token: "mock-token" };
    saveSession(session);
    return { ok: true, data: session };
  }

  const shaHashed = sha256Hash(password); // <-- Deterministic hash
  const res = await fetch(`${API_BASE}/api/auth/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password: shaHashed }),
  });
  if (!res.ok)
    return { ok: false, error: (await res.json()).error || "Signin failed" };
  const data = await res.json();
  saveSession(data);
  return { ok: true, data };
}



// import bcrypt from "bcryptjs";

// const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
// const USE_MOCK = (import.meta.env.VITE_USE_MOCK_AUTH || "false") === "true";

// /** Util: simulate network wait in mock mode */
// const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// /** Persist auth locally (front-end only) */
// const saveSession = (payload) => {
//   localStorage.setItem("moodify_auth", JSON.stringify(payload));
// };
// export const loadSession = () => {
//   const raw = localStorage.getItem("moodify_auth");
//   return raw ? JSON.parse(raw) : null;
// };
// export const clearSession = () => localStorage.removeItem("moodify_auth");

// /** FRONTEND hashing with bcryptjs */
// export async function signup({ name, email, password }) {
//   // 1) hash in the browser
//   const hashed = await bcrypt.hash(password, 10);
//    console.log("Frontend signup hash:", hashed);

//   if (USE_MOCK) {
//     await wait(600);
//     // pretend to “create user” in localStorage
//     const users = JSON.parse(localStorage.getItem("moodify_users") || "[]");
//     if (users.find((u) => u.email === email)) {
//       return { ok: false, error: "Email already registered" };
//     }
//     users.push({ name, email, hashed });
//     localStorage.setItem("moodify_users", JSON.stringify(users));
//     // fake “token”
//     const session = { user: { name, email }, token: "mock-token" };
//     saveSession(session);
//     return { ok: true, data: session };
//   }

//   // If you later hook a real backend, send the HASHED password:
//   const res = await fetch(`${API_BASE}/api/auth/signup`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     credentials: "include",
//     body: JSON.stringify({ name, email, password: hashed }),
//   });
//   if (!res.ok) 
//     return { ok: false, error: (await res.json()).error || "Signup failed" };
//   const data = await res.json();
//   saveSession(data);
//   return { ok: true, data };
// }

// export async function signin({ email, password }) {
//     // ALWAYS hash first
//   const hashed = await bcrypt.hash(password, 10);

//   if (USE_MOCK) {
//     await wait(500);
//     const users = JSON.parse(localStorage.getItem("moodify_users") || "[]");
//     const user = users.find((u) => u.email === email);
//     if (!user) return { ok: false, error: "Invalid credentials" };
//     const match = await bcrypt.compare(password, user.hashed);
//     if (!match) return { ok: false, error: "Invalid credentials" };
//     const session = { user: { name: user.name || email.split("@")[0], email }, token: "mock-token" };
//     saveSession(session);
//     return { ok: true, data: session };
//   }

//   // Real backend: send that same hashed string
//   const res = await fetch(`${API_BASE}/api/auth/signin`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     credentials: "include",
//     body: JSON.stringify({ email, password: hashed }),
//   });
//   if (!res.ok) return { ok: false, error: (await res.json()).error || "Signin failed" };
//   const data = await res.json();
//   saveSession(data);
//   return { ok: true, data };
// }
