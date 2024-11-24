"use client";

import { createContext , useState , useEffect , useContext} from "react";

interface AppContextProps {
      token:string | null;
      setToken: (token:string) => void;
}
const AppContext = createContext<AppContextProps | undefined>(undefined);



export function AppWrapper({ children }:{children:React.ReactNode}) {
 
     const [token , setToken] = useState<string|null>(null);

     useEffect(() => {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);
     } , []);
     return (
            <AppContext.Provider value={{token , setToken}}>
                     {children}
            </AppContext.Provider>
     ) 
}


export function useAppContext() {
     const context = useContext(AppContext);
     if(context === undefined) {
        throw new Error("useAppContext must be used within a AppWrapper");
     }
     return context;
}