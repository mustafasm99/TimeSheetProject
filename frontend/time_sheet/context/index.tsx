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
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
    const response = getRequests({
      url: "user/me",
      token: storedToken as string,
    });
    response.then((data: UserType) => {
      if ( user == null) {
        setUser(data);
      }
    });
  }, [user]);

  return (
    <AppContext.Provider value={{ token, setToken, user: user }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within a AppWrapper");
  }
  return context;
}
