import { createContext, useContext, useEffect, useState } from "react";
import { loadSession, clearSession } from "./auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => loadSession());
  const [loading, setLoading] = useState(false);

  const signout = () => {
    clearSession();
    setSession(null);
  };

  // In future, you can add a “refresh me” here
  useEffect(() => {}, []);

  return (
    <AuthContext.Provider value={{ session, setSession, signout, loading, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
