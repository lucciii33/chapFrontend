import React from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useGlobalContext } from "../context/GlobalProvider";

// Función auxiliar para llamar al backend

const CheckoutForm: React.FC = () => {
  const { auth } = useGlobalContext();
  const { user } = auth;
  const stripe = useStripe();
  const elements = useElements();

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
