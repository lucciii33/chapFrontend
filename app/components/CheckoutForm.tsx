import React, { useEffect, useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useGlobalContext } from "../context/GlobalProvider";
import { ShippingAddressContext } from "../context/ShippingAddressContext";

// Función auxiliar para llamar al backend

const CheckoutForm: React.FC = () => {
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

  const createPaymentIntent = async (userId: number, amount: number) => {
    const response = await fetch(
      "http://127.0.0.1:8000/stripe/create-payment-intent",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, amount }), // Incluye el user_id y el monto
      }
    );
    const data = await response.json();
    return data.client_secret;
  };

  const createOrder = async () => {
    // Obtener la dirección seleccionada (is_selected: true)
    const selectedAddress = addresses.find((addr) => addr.is_selected);
    if (!selectedAddress) {
      console.error("No se ha seleccionado ninguna dirección");
      return;
    }

    // Calcular el total del carrito
    const totalPrice = allCarts.reduce((acc, item) => acc + item.subtotal, 0);

    // Estructura de la orden
    const orderData = {
      user_id: user.id,
      full_name: user.full_name,
      order_data: allCarts, // Incluye todos los carritos seleccionados
      shipping_address: selectedAddress, // Dirección seleccionada
      total_price: totalPrice,
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/api/order/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.access_token}`, // 🔥 Token para autenticación
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error("Error al crear la orden");
      }

      const data = await response.json();
      console.log("Orden creada:", data);

      // Vaciar carrito después de crear la orde
    } catch (error) {
      console.error("Error al crear la orden:", error);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Valida que Stripe y los elementos estén cargados
    if (!stripe || !elements) {
      console.error("Stripe no está cargado correctamente");
      return;
    }

    try {
      // Crear PaymentIntent y obtener client_secret
      const clientSecret = await createPaymentIntent(user.id, 1000); // $10.00

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
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "auto" }}>
      <CardElement />
      <button
        type="submit"
        disabled={!stripe || !elements}
        style={{ marginTop: 20 }}
      >
        Pagar $10
      </button>
    </form>
  );
};

export default CheckoutForm;
