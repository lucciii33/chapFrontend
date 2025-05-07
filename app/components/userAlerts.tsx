// components/UserAlerts.tsx
import { useUserAlerts } from "../context/AlertContext";

export default function UserAlerts({ userId }: { userId: number }) {
  const { alerts, loading, error } = useUserAlerts(userId);
  console.log("alertsalertsalerts", alerts);

  if (loading) return null;
  if (error) return null;
  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="bg-yellow-100 p-2 rounded-md mt-2 text-yellow-800 text-sm shadow">
      <ul>
        {alerts.map((alert) => (
          <li key={alert.id}>
            <strong>
              {new Date(alert.scheduled_date).toLocaleDateString()}
            </strong>
            : {alert.message}
          </li>
        ))}
      </ul>
    </div>
  );
}
