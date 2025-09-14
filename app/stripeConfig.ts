import { loadStripe } from "@stripe/stripe-js";

// Carga Stripe con tu clave pública
export const stripePromise = loadStripe(import.meta.env.VITE_REACT_APP_STRIPE_FRONT_END);