import "../../../styles/dashboard.css";

export default function Donation() {
  const handleOnboard = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_REACT_APP_URL}/stripe/onboard-user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id: 1 }),
        }
      );

      if (!res.ok) {
        throw new Error("Error en la petición");
      }

      const data = await res.json();

      if (data.onboarding_url) {
        // 🚀 Redirige al link de Stripe
        window.location.href = data.onboarding_url;
      } else {
        alert("No se recibió el link de onboarding");
      }
    } catch (err) {
      console.error(err);
      alert("Error al crear el onboarding link");
    }
  };

  return (
    <div className="donation-container">
      <h1>Test donation</h1>
      <button onClick={handleOnboard} className="btn">
        Conectar con Stripe
      </button>
    </div>
  );
}
