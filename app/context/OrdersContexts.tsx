import { useState } from "react";

type Tag = {
  color: string;
  continue_later: boolean;
  id: number;
  is_active: boolean;
  material: string;
  name: boolean;
  qr_url_link: string;
  shape: string;
  stripe_number: string | null;
};

type Pet = {
  name: string;
  age: number;
  personality: string;
  address: string;
  phone_number: number;
};

type OrderItem = {
  id: number;
  is_checked_out: boolean;
  pet: Pet;
  pet_id: number;
  price: number;
  quantity: number;
  subtotal: number;
  tag: Tag;
  tag_id: number;
};

type ShippingAddress = {
  country: string;
  state: string;
  city: string;
  postal_code: string;
  street_address: string;
  apartment: string;
  id: number;
  user_id: number;
};

type Order = {
  id?: number;
  user_id: number;
  order_data: OrderItem[];
  shipping_address: ShippingAddress;
  total_price: number;
  status?: string;
};

export const useOrdersContext = () => {
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [singleOrder, setSingleOrder] = useState<Order | null>(null);

  const getToken = (): string | null => {
    const storedUser = localStorage.getItem("adminUser");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      return user.access_token;
    }
    return null;
  };

  // Crear una nueva orden
  const createOrder = async (orderData: Order): Promise<Order | null> => {
    try {
      const token = getToken();
      if (!token) throw new Error("Usuario no autenticado");

      const response = await fetch("http://127.0.0.1:8000/api/order/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error("Error al crear la orden");
      }

      const newOrder: Order = await response.json();
      setAllOrders((prevOrders) => [...prevOrders, newOrder]);
      return newOrder;
    } catch (error) {
      console.error("Error al crear la orden:", error);
      return null;
    }
  };

  // Obtener todas las órdenes (Admin)
  const getAllOrders = async (): Promise<Order[] | null> => {
    try {
      const token = getToken();
      if (!token) throw new Error("Usuario no autenticado");

      const response = await fetch("http://127.0.0.1:8000/api/order/orders", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al obtener todas las órdenes");
      }

      const orders: Order[] = await response.json();
      setAllOrders(orders);
      return orders;
    } catch (error) {
      console.error("Error al obtener todas las órdenes:", error);
      return null;
    }
  };

  // Obtener órdenes por usuario
  const getOrdersByUser = async (userId: number): Promise<Order[] | null> => {
    try {
      const token = getToken();
      if (!token) throw new Error("Usuario no autenticado");

      const response = await fetch(
        `http://127.0.0.1:8000/api/order/orders/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al obtener las órdenes del usuario");
      }

      const orders: Order[] = await response.json();
      setUserOrders(orders);
      return orders;
    } catch (error) {
      console.error("Error al obtener las órdenes del usuario:", error);
      return null;
    }
  };

  // Obtener orden por ID
  const getOrderById = async (orderId: number): Promise<Order | null> => {
    try {
      const token = getToken();
      if (!token) throw new Error("Usuario no autenticado");

      const response = await fetch(
        `http://127.0.0.1:8000/api/order/orders/${orderId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al obtener la orden");
      }

      const order: Order = await response.json();
      setSingleOrder(order);
      return order;
    } catch (error) {
      console.error("Error al obtener la orden:", error);
      return null;
    }
  };

  const updateOrderStatus = async (
    orderId: number,
    newStatus: string
  ): Promise<Order | null> => {
    try {
      const token = getToken();
      if (!token) throw new Error("Usuario no autenticado");

      const response = await fetch(
        `http://127.0.0.1:8000/api/order/orders/${orderId}/update-status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Error al actualizar el estado de la orden");
      }

      const updatedOrder: Order = await response.json();

      return updatedOrder;
    } catch (error) {
      console.error("Error al actualizar el estado:", error);
      return null;
    }
  };

  const deleteOrder = async (orderId: number): Promise<Order | null> => {
    console.log("desde context", orderId);
    try {
      const token = getToken();
      if (!token) throw new Error("Usuario no autenticado");

      const response = await fetch(
        `http://127.0.0.1:8000/api/order/orders/delete/${orderId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al actualizar el estado de la orden");
      }
      const data = await response.json(); // ✅ Asegúrate de parsear la respuesta
      return data;
    } catch (error) {
      console.error("Error al actualizar el estado:", error);
      return null;
    }
  };

  return {
    allOrders,
    userOrders,
    singleOrder,
    createOrder,
    getAllOrders,
    getOrdersByUser,
    getOrderById,
    updateOrderStatus,
    deleteOrder,
  };
};
