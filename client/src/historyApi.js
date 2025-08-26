const API = import.meta.env.VITE_AUTH_API || "http://localhost:5002";

export async function fetchHistory(userId, limit = 10) {
  const res = await fetch(`${API}/api/history/${userId}?limit=${limit}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch history");
  return res.json();
}

export async function addHistory(userId, entry) {
  const res = await fetch(`${API}/api/history/${userId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(entry),
  });
  if (!res.ok) throw new Error("Failed to save history");
  return res.json();
}

export async function importHistory(userId, entries) {
  const res = await fetch(`${API}/api/history/${userId}/import`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ entries }),
  });
  if (!res.ok) throw new Error("Failed to import history");
  return res.json();
}
