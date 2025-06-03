import { useState } from "react";
import { showErrorToast, showSuccessToast } from "~/utils/toast";

type InventoryItem = {
  id: number;
  type_tag: string;
  color: string;
  quantity: number;
  description?: string;
};

export const useInventoryContext = () => {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [inventoryItemsUser, setInventoryItemsUser] = useState<InventoryItem[]>(
    []
  );
  const baseUrl = import.meta.env.VITE_REACT_APP_URL;

  const getToken = (): string | null => {
    const storedUser = localStorage.getItem("adminUser");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      return user.access_token;
    }
    return null;
  };

  const getTokenUser = (): string | null => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      return user.access_token;
    }
    return null;
  };

  const getAllInventoryItems = async (): Promise<void> => {
    try {
      const token = getToken();
      if (!token) throw new Error("No token");

      const res = await fetch(`${baseUrl}/api/inventory`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Error fetching inventory");

      const data: InventoryItem[] = await res.json();
      setInventoryItems(data);
    } catch (err) {
      console.error("Error:", err);
      showErrorToast("Error al obtener el inventario");
    }
  };

  const getInventoryForUser = async (): Promise<void> => {
    try {
      const token = getTokenUser();
      if (!token) throw new Error("No token");

      const res = await fetch(`${baseUrl}/api/inventory/public`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Error fetching inventory");

      const data: InventoryItem[] = await res.json();
      setInventoryItemsUser(data);
    } catch (err) {
      console.error("Error:", err);
      showErrorToast("Error al obtener el inventario para el usuario");
    }
  };

  const createInventoryItem = async (
    item: Omit<InventoryItem, "id">
  ): Promise<void> => {
    try {
      const token = getToken();
      if (!token) throw new Error("No token");

      const res = await fetch(`${baseUrl}/api/inventory/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(item),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Error creando ítem");
      }

      const newItem: InventoryItem = await res.json();
      setInventoryItems((prev) => [...prev, newItem]);
      showSuccessToast("Ítem creado correctamente");
    } catch (err) {
      console.error("Error:", err);
      showErrorToast("Error al crear ítem");
    }
  };

  const editInventoryItem = async (
    itemId: number,
    updates: Partial<Omit<InventoryItem, "id" | "type_tag" | "color">>
  ): Promise<void> => {
    try {
      const token = getToken();
      if (!token) throw new Error("No token");

      const res = await fetch(`${baseUrl}/api/inventory/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Error actualizando ítem");
      }

      const updatedItem: InventoryItem = await res.json();

      setInventoryItems((prev) =>
        prev.map((item) => (item.id === itemId ? updatedItem : item))
      );
      showSuccessToast("Ítem actualizado correctamente");
    } catch (err) {
      console.error("Error:", err);
      showErrorToast("Error al actualizar ítem");
    }
  };

  const deleteInventoryItem = async (itemId: number): Promise<void> => {
    try {
      const token = getToken();
      if (!token) throw new Error("No token");

      const res = await fetch(`${baseUrl}/api/inventory/${itemId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Error actualizando ítem");
      }

      setInventoryItems((prev) => prev.filter((item) => item.id !== itemId));
      showSuccessToast("Ítem actualizado correctamente");
    } catch (err) {
      console.error("Error:", err);
      showErrorToast("Error al actualizar ítem");
    }
  };

  return {
    inventoryItems,
    getAllInventoryItems,
    createInventoryItem,
    getInventoryForUser,
    inventoryItemsUser,
    editInventoryItem,
    deleteInventoryItem,
  };
};
