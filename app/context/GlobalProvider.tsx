import { createContext, useContext, ReactNode } from "react";
import { useAuthContext } from "./AuthContext";
import { usePetContext } from "./PetContext";
import { useTagContext } from "./tagContext";
import { useCartContext } from "./CartContext";
import { useMedicalPetContext } from "./MedicalPetContext";
import { useAuthAdminContext } from "./AuthAdminContext";

type GlobalContextType = {
  auth: ReturnType<typeof useAuthContext>;
  pet: ReturnType<typeof usePetContext>;
  tag: ReturnType<typeof useTagContext>;
  cart: ReturnType<typeof useCartContext>;
  medicalHistory: ReturnType<typeof useMedicalPetContext>;
  authAdmin: ReturnType<typeof useAuthAdminContext>;
};

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const auth = useAuthContext();
  const pet = usePetContext();
  const tag = useTagContext();
  const cart = useCartContext();
  const medicalHistory = useMedicalPetContext();
  const authAdmin = useAuthAdminContext();
  return (
    <GlobalContext.Provider
      value={{ auth, pet, tag, cart, medicalHistory, authAdmin }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext debe usarse dentro de un GlobalProvider");
  }
  return context;
};
