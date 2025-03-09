"use client";

import { getRequests } from "@/server/base/base_requests";
import { UserType } from "@/types/user";
import { createContext, useState, useEffect, useContext } from "react";

interface AppContextProps {
  token: string | null;
  setToken: (token: string) => void;
  user: UserType | null;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);
      setLoading(false);

      if (storedToken) {
        getRequests({ url: "user/me", token: storedToken }).then((data: UserType) => {
          setUser(data);
        });
      }
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Prevents rendering before token is loaded
  }

  return (
    <AppContext.Provider value={{ token, setToken, user }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppWrapper");
  }
  return context;
}
