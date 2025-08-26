import { addHistory } from "./historyApi";
import { pushGuestHistory } from "./historyLocal";
import { loadSession } from "./auth";

export async function trackMood(emotion) {
  const session = loadSession();
  const entry = { emotion, timestamp: new Date().toISOString() };

  if (session?.user?.id) {
    try {
      await addHistory(session.user.id, entry);
    } catch (e) {
      console.error("DB save failed, falling back to guest:", e);
      pushGuestHistory(entry);
    }
  } else {
    pushGuestHistory(entry);
  }
}
