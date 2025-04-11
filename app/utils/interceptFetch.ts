import { showErrorToast } from "~/utils/toast";

if (typeof window !== "undefined") {
  const originalFetch = window.fetch;

  window.fetch = async (url, options = {}) => {
    const isUrlString = typeof url === "string";
    const urlString = isUrlString ? url : url?.url || "";
    const isPublicUrl = urlString.includes("/api/public/");
    console.log("isPublicUrl", isPublicUrl)
    const storedUser = localStorage.getItem("user");
    const token = storedUser ? JSON.parse(storedUser).access_token : null;

    // 🔹 Solo agregar el header de autenticación si hay un token
    const headers = {
      ...options?.headers, // Mantener los headers originales
      ...(token && !isPublicUrl ? { Authorization: `Bearer ${token}` } : {}),
    };

    try {
      const response = await originalFetch(url, { ...options, headers });

      // 🔴 Si el token expiró (401), cerramos sesión y redirigimos
      if (!isPublicUrl && response.status === 401) {
        console.log("🔴 TOKEN EXPIRADO - CERRANDO SESIÓN");
        localStorage.removeItem("user");
        showErrorToast("Sesión expirada. Inicia sesión de nuevo.");

        if (window.location.pathname !== "/") {
          console.log("test")
          // window.location.replace("/"); // Redirige y reemplaza en el historial
        } else {
          window.location.reload(); // Si ya estamos en "/", recargamos la página
        }

        return Promise.reject("Unauthorized");
      }

      return response; // 🔹 Devolver la respuesta sin modificarla
    } catch (error) {
      console.error("⚠️ Error en fetch:", error);
      showErrorToast("Ocurrió un error en la solicitud.");
      return Promise.reject(error);
    }
  };
}
