// hooks/useUserAlerts.ts
import { useEffect, useState } from "react";

export interface Alert {
  id: number;
  phone_number?: string;
  email?: string;
  message: string;
  scheduled_date: string;
  sent: boolean;
  user_id: number;
}

export const useUserAlerts = (userId: number | undefined) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  console.log("alertsalertsalerts", alerts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchAlerts = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_REACT_APP_URL}/api/users/${userId}/alerts`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        }
      );
      console.log("llamandooooooooooooo");

      const data = await res.json();
      setAlerts(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [userId]);

  const deleteAlert = async (alertId: number) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_REACT_APP_URL}/api/alerts/${alertId}/delete`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        }
      );

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Error al eliminar la alerta");
      }

      // Actualizar lista local sin la alerta eliminada
      await fetchAlerts();
      setAlerts((prev) => prev.filter((alert) => alert.id !== alertId));
    } catch (err: any) {
      setError(err.message);
    }
  };

  return { alerts, loading, error, deleteAlert };
};
