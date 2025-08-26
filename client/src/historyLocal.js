const GUEST_KEY = "guestMoodHistory";
const USER_KEY = "moodHistory";
const SESSION_FLAG = "guestSessionActive";


export function initGuestSession() {
  if (!sessionStorage.getItem(SESSION_FLAG)) {
    localStorage.removeItem(GUEST_KEY);
    sessionStorage.setItem(SESSION_FLAG, "true");
  }
}


export function getGuestHistory() {
  const arr = JSON.parse(localStorage.getItem(GUEST_KEY) || "[]");
  return Array.isArray(arr) ? arr.slice(-10) : [];
}

export function pushGuestHistory(entry) {
  const arr = JSON.parse(localStorage.getItem(GUEST_KEY) || "[]");
  const withTs = { ...entry, timestamp: entry.timestamp || new Date().toISOString() };
  arr.push(withTs);
  const last10 = arr.slice(-10);
  localStorage.setItem(GUEST_KEY, JSON.stringify(last10));
  return last10;
}

export function clearGuestHistory() {
  localStorage.removeItem(GUEST_KEY);
}


export function setUserHistory(entries) {
  localStorage.setItem(USER_KEY, JSON.stringify(entries.slice(-10)));
}

export function getUserHistory() {
  const arr = JSON.parse(localStorage.getItem(USER_KEY) || "[]");
  return Array.isArray(arr) ? arr.slice(-10) : [];
}

export function clearUserHistory() {
  localStorage.removeItem(USER_KEY);
}