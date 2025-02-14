import { useState } from "react";

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
    const res = await fetch(
      `http://127.0.0.1:8000/api/users/${userId}/shipping_address`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );

    return res;
  };

  const getShippingAddresses = async (userId: number) => {
    console.log(",,anadp ");
    const token = getToken();
    const res = await fetch(
      `http://127.0.0.1:8000/api/users/${userId}/shipping_address`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res;
  };

  const deleteShippingAddresses = async (shippingAddressId: number) => {
    console.log(",,anadp ");
    const token = getToken();
    const res = await fetch(
      `http://127.0.0.1:8000/api/shipping_address/${shippingAddressId}/delete`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res;
  };

  const editShippingAddress = async (
    shippingAddressId: number,
    data: ShippingAddress
  ) => {
    const token = getToken();
    const res = await fetch(
      `http://127.0.0.1:8000/api/shipping_address/${shippingAddressId}/edit`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );

    return res;
  };

  return {
    createShippingAddress,
    getShippingAddresses,
    deleteShippingAddresses,
    editShippingAddress,
  };
};
