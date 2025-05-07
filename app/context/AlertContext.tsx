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

  useEffect(() => {
    const fetchAlerts = async () => {
      if (!userId) return;

      setLoading(true);
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/api/users/${userId}/alerts`,
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

    fetchAlerts();
  }, [userId]);

  return { alerts, loading, error };
};
