import { createContext, useContext, ReactNode } from "react";
import { useAuthContext } from "./AuthContext"; // Importa tu archivo original

type GlobalContextType = {
  auth: ReturnType<typeof useAuthContext>;
};

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const auth = useAuthContext();
  return (
    <GlobalContext.Provider value={{ auth }}>{children}</GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext debe usarse dentro de un GlobalProvider");
  }
  return context;
};
