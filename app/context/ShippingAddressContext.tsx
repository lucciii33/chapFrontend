import { useState } from "react";
import { showErrorToast, showSuccessToast } from "~/utils/toast";

type ShippingAddress = {
  country: string;
  state: string;
  city: string;
  postal_code: string;
  street_address: string;
  apartment: string;
  id?: number;
  user_id?: number;
};

export const ShippingAddressContext = () => {
  const baseUrl = import.meta.env.VITE_REACT_APP_URL;

  const getToken = (): string | null => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      return user.access_token;
    }
    return null;
  };

  const createShippingAddress = async (
    userId: number,
    data: ShippingAddress
  ) => {
    const token = getToken();
    try {
      const res = await fetch(
        `${baseUrl}/api/users/${userId}/shipping_address`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );
      showSuccessToast("Dirección creada exitosamente");

      return res;
    } catch (error) {
      console.error(error);
      showErrorToast("Error al crear la dirección");
    }
  };

  const getShippingAddresses = async (userId: number) => {
    console.log(",,anadp ");
    const token = getToken();
    const res = await fetch(`${baseUrl}/api/users/${userId}/shipping_address`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res;
  };

  const deleteShippingAddresses = async (shippingAddressId: number) => {
    console.log(",,anadp ");
    const token = getToken();
    try {
      const res = await fetch(
        `${baseUrl}/api/shipping_address/${shippingAddressId}/delete`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      showSuccessToast("Dirección eliminada exitosamente");
      return res;
    } catch (error) {
      console.error("Error al crear la mascota:", error);
      showErrorToast("Error al eliminar la direecion");
    }
  };

  const editShippingAddress = async (
    shippingAddressId: number,
    data: ShippingAddress
  ) => {
    const token = getToken();
    try {
      const res = await fetch(
        `${baseUrl}/api/shipping_address/${shippingAddressId}/edit`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );
      showSuccessToast("Dirección editada exitosamente");
      return res;
    } catch (error) {
      console.error(error);
      showErrorToast("Error al crear la dirección");
      return null;
    }
  };

  return {
    createShippingAddress,
    getShippingAddresses,
    deleteShippingAddresses,
    editShippingAddress,
  };
};
