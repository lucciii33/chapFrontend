import { useSearchParams } from "@remix-run/react";
import { useState } from "react";
import { useGlobalContext } from "~/context/GlobalProvider";
import { showErrorToast, showSuccessToast } from "~/utils/toast";

export default function ResetPasswordPage() {
  const { auth } = useGlobalContext();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");

  const handleReset = async () => {
    if (!token || !newPassword) {
      showErrorToast("Token o nueva contraseña no válidos");
      return;
    }

    const result = await auth.resetPassword(token, newPassword);

    if (result?.success) {
      showSuccessToast("Contraseña actualizada correctamente");
    } else {
      showErrorToast("Error al actualizar contraseña");
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Restablecer Contraseña</h1>
      <input
        type="password"
        placeholder="Nueva contraseña"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="w-full p-2 border mb-4 rounded"
      />
      <button
        onClick={handleReset}
        className="w-full bg-teal-600 text-white py-2 rounded"
      >
        Cambiar contraseña
      </button>
    </div>
  );
}
