import { loadStripe } from "@stripe/stripe-js";

// Carga Stripe con tu clave pública
export const stripePromise = loadStripe("pk_test_51QUUwvGvGmj7V6BQ3mYHk415POwO7PiUCZkk6iwSagaEjABNDu7iARZAeWTTP0vBTJuiCxa0lzMZoPY5JG5CduBM00yxwonPmf");