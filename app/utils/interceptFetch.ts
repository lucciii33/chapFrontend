import { showErrorToast } from "~/utils/toast";

if (typeof window !== "undefined") {
  const originalFetch = window.fetch;

  window.fetch = async (url, options = {}) => {
    const storedUser = localStorage.getItem("user");
    const token = storedUser ? JSON.parse(storedUser).access_token : null;

    // 🔹 Solo agregar el header de autenticación si hay un token
    const headers = {
      ...options?.headers, // Mantener los headers originales
      ...(token ? { Authorization: `Bearer ${token}` } : {}), 
    };

    try {
      let response = await originalFetch(url, { ...options, headers });

      // 🔴 Si el token expiró (401), cerramos sesión y redirigimos
      if (response.status === 401) {
       
        // localStorage.removeItem("user");
        // showErrorToast("Sesión expirada. Inicia sesión de nuevo.");

        // if (window.location.pathname !== "/") {
        //   window.location.replace("/"); // Redirige y reemplaza en el historial
        // } else {
        //   window.location.reload(); // Si ya estamos en "/", recargamos la página
        // }

        // return Promise.reject("Unauthorized");

        const refreshResp = await originalFetch(
          `${import.meta.env.VITE_REACT_APP_URL}/users/refresh`,
          {
            method: "POST",
            credentials: "include",
          }
        );

        if (refreshResp.ok) {
          const data = await refreshResp.json();
    
          // Guardar nuevo access token
          const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
          storedUser.access_token = data.access_token;
          localStorage.setItem("user", JSON.stringify(storedUser));

          // Reintentar la petición original con nuevo token
          headers.Authorization = `Bearer ${data.access_token}`;
          response = await originalFetch(url, { ...options, headers });
        } else {
          // Refresh falló → cerramos sesión
  
          localStorage.removeItem("user");
          showErrorToast("Sesión expirada. Inicia sesión de nuevo.");
          window.location.replace("/");
          return Promise.reject("Unauthorized");
        }
      }

      return response; // 🔹 Devolver la respuesta sin modificarla
    } catch (error) {
      console.error("⚠️ Error en fetch:", error);
      showErrorToast("Ocurrió un error en la solicitud.");
      return Promise.reject(error);
    }
  };
}
