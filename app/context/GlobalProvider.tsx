import { createContext, useContext, ReactNode } from "react";
import { useAuthContext } from "./AuthContext";
import { usePetContext } from "./PetContext";
import { useTagContext } from "./tagContext";
import { useCartContext } from "./CartContext";
import { useMedicalPetContext } from "./MedicalPetContext";
import { useAuthAdminContext } from "./AuthAdminContext";
import { useOrdersContext } from "./OrdersContexts";
import { useFinanceContext } from "./financesContext";
import { useTravelModelContext } from "./TravelModeContext";
import { useComingFromCardContext } from "./ComingFromCardContext";
import { useUserAlerts } from "./AlertContext";
import { useInventoryContext } from "./InventoryContext";

type GlobalContextType = {
  auth: ReturnType<typeof useAuthContext>;
  pet: ReturnType<typeof usePetContext>;
  tag: ReturnType<typeof useTagContext>;
  cart: ReturnType<typeof useCartContext>;
  medicalHistory: ReturnType<typeof useMedicalPetContext>;
  authAdmin: ReturnType<typeof useAuthAdminContext>;
  orders: ReturnType<typeof useOrdersContext>;
  finances: ReturnType<typeof useFinanceContext>;
  travelMode: ReturnType<typeof useTravelModelContext>;
  comingFromCard: ReturnType<typeof useComingFromCardContext>;
  userAlerts: ReturnType<typeof useUserAlerts>;
  inventory: ReturnType<typeof useInventoryContext>;
};

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const auth = useAuthContext();
  const pet = usePetContext();
  const tag = useTagContext();
  const cart = useCartContext();
  const medicalHistory = useMedicalPetContext();
  const authAdmin = useAuthAdminContext();
  const orders = useOrdersContext();
  const finances = useFinanceContext();
  const travelMode = useTravelModelContext();
  const comingFromCard = useComingFromCardContext();
  const userAlerts = useUserAlerts();
  const inventory = useInventoryContext();
  return (
    <GlobalContext.Provider
      value={{
        auth,
        pet,
        tag,
        cart,
        medicalHistory,
        authAdmin,
        orders,
        finances,
        travelMode,
        comingFromCard,
        userAlerts,
        inventory,
      }}
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
