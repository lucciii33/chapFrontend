import { useState } from "react";

type Cart = {
  tag_id: number;
  pet_id: number;
  quantity: number;
  price: number;
  subtotal: number;
  is_checked_out: boolean;
};

type User = {
  id: number;
  email: string;
  full_name: string;
  country: string;
  age: number;
};

type Tag = {
  shape: string;
  name: boolean;
  continue_later: boolean;
  material: string;
  color: string;
  id: number;
};

type Pet = {
  name: string;
  age: number;
  personality: string;
  address: string;
  phone_number: number;
  phone_number_optional: number;
  profile_photo: string;
  pet_color: string;
  breed: string;
  lost: boolean;
  vet_address: string;
  neighbourhood: string;
  mom_name: string;
  dad_name: string;
  chip_number: number;
  id: number;
  user_id: number;
  tags: Tag[];
};

type CreateCartResponse = Cart & {
  id: number;
  user: User;
  tag: Tag;
  pet: Pet;
};

export const useCartContext = () => {
  const [cartProfile, setCartProfile] = useState<CreateCartResponse | null>(
    null
  );
  const [allCarts, setAllCarts] = useState<CreateCartResponse[]>([]);
  const [actSideBar, setActSideBar] = useState(false);

  const getToken = (): string | null => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      return user.access_token; // Obtener el token del almacenamiento local
    }
    return null;
  };

  // Función para manejar la creación de una nueva mascota
  const createCart = async (
    userId: number,
    cartData: Cart
  ): Promise<CreateCartResponse | null> => {
    try {
      const token = getToken();
      if (!token) throw new Error("Usuario no autenticado");
      const response = await fetch(
        `http://127.0.0.1:8000/api/users/${userId}/cart`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(cartData),
        }
      );

      if (!response.ok) {
        throw new Error("Error al crear el cart");
      }

      const responseData: CreateCartResponse = await response.json();
      setCartProfile(responseData); // Guardamos la mascota creada en el estado
      return responseData;
    } catch (error) {
      console.error("Error al crear la mascota:", error);
      return null;
    }
  };

  const getCartByUser = async (
    userId: number
  ): Promise<CreateCartResponse | null> => {
    try {
      const token = getToken();
      if (!token) throw new Error("Usuario no autenticado");
      const response = await fetch(
        `http://127.0.0.1:8000/api/users/${userId}/cart`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Añadimos el token aquí
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al crear la mascota");
      }

      const responseData: CreateCartResponse[] = await response.json();
      setAllCarts(responseData);
      return responseData;
    } catch (error) {
      console.error("Error al crear la mascota:", error);
      return null;
    }
  };

  const deleteCartById = async (
    cartId: number
  ): Promise<CreateCartResponse | null> => {
    try {
      const token = getToken();
      if (!token) throw new Error("Usuario no autenticado");
      const response = await fetch(
        `http://127.0.0.1:8000/api/cart/${cartId}/delete`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Añadimos el token aquí
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al crear la mascota");
      }

      const responseData: CreateCartResponse = await response.json();
      return responseData;
    } catch (error) {
      console.error("Error al crear la mascota:", error);
      return null;
    }
  };

  const editCartById = async (
    cartId: number,
    cartData: Cart
  ): Promise<CreateCartResponse | null> => {
    try {
      const token = getToken();
      if (!token) throw new Error("Usuario no autenticado");
      const response = await fetch(
        `http://127.0.0.1:8000/api/cart/${cartId}/edit`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(cartData),
        }
      );

      if (!response.ok) {
        throw new Error("Error al crear la mascota");
      }

      const responseData: CreateCartResponse = await response.json();
      // setPetProfile(responseData); // Guardamos la mascota creada en el estado
      return responseData;
    } catch (error) {
      console.error("Error al crear la mascota:", error);
      return null;
    }
  };

  const activateSideBar = () => {
    setActSideBar(true);
  };

  const closeSideBar = () => {
    setActSideBar(false);
  };

  return {
    createCart,
    cartProfile,
    getCartByUser,
    allCarts,
    deleteCartById,
    editCartById,
    activateSideBar,
    actSideBar,
    closeSideBar,
  };
};
