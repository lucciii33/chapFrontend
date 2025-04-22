import React, { useEffect, useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useGlobalContext } from "../context/GlobalProvider";
import { ShippingAddressContext } from "../context/ShippingAddressContext";

// Función auxiliar para llamar al backend

const CheckoutForm: React.FC = () => {
  const baseUrl = import.meta.env.VITE_REACT_APP_URL;
  const { auth, cart } = useGlobalContext();
  const { user } = auth;
  const { allCarts } = cart;
  console.log("user", user);
  console.log("allCarts", allCarts);
  const stripe = useStripe();
  const elements = useElements();

  const { getShippingAddresses } = ShippingAddressContext();

  const [addresses, setAddresses] = useState([]);
  console.log("addresses", addresses);
  useEffect(() => {
    if (!user?.id) return; // Si user.id no está disponible, no ejecuta nada

    const fetchAddresses = async () => {
      try {
        const response = await getShippingAddresses(user.id);
        const data = await response.json(); // 🔥 Aquí extraemos el JSON
        console.log("addresses", data); // Debug para ver qué devuelve
        if (data) setAddresses(data);
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };

    fetchAddresses();
  }, [user]); // S

  const createPaymentIntent = async (
    userId: number,
    amount: number,
    petIds: number[]
  ) => {
    const response = await fetch(`${baseUrl}/stripe/create-payment-intent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, amount, pet_ids: petIds }), // Incluye el user_id y el monto
    });
    const data = await response.json();
    return data.client_secret;
  };

  const createOrder = async () => {
    const selectedAddress = addresses.find((addr) => addr.is_selected);
    if (!selectedAddress) {
      console.error("No se ha seleccionado ninguna dirección");
      return;
    }

    const totalPrice = allCarts.reduce((acc, item) => acc + item.subtotal, 0);

    const orderData = {
      user_id: user.id,
      full_name: user.full_name,
      order_data: allCarts,
      shipping_address: selectedAddress,
      total_price: totalPrice,
    };

    try {
      const response = await fetch(`${baseUrl}/api/order/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.access_token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error("Error al crear la orden");
      }

      const data = await response.json();
      console.log("Orden creada:", data);
    } catch (error) {
      console.error("Error al crear la orden:", error);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      console.error("Stripe no está cargado correctamente");
      return;
    }

    try {
      const petIds = Array.from(new Set(allCarts.map((item) => item.pet_id)));
      const clientSecret = await createPaymentIntent(user.id, 1000, petIds); // $10.00

      // Confirmar el pago
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement)!,
          },
        }
      );

      if (error) {
        console.error("Error en el pago:", error.message);
      } else if (paymentIntent?.status === "succeeded") {
        console.log("¡Pago exitoso!");
        await createOrder();
      }
    } catch (error) {
      console.error("Error inesperado:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{}}>
      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          borderRadius: "5px",
          width: "100%",
        }}
      >
        <CardElement options={{ style: { base: { fontSize: "16px" } } }} />
      </div>
      <div className="w-full">
        <button
          type="submit"
          disabled={!stripe || !elements}
          style={{ marginTop: 20 }}
          className="btn  bg-teal-500 w-full"
        >
          Pagar $10
        </button>
      </div>
    </form>
  );
};

export default CheckoutForm;
