import { useState, useEffect } from "react";

type AdminUser = {
  access_token: string;
  token_type: string;
  //   full_name: string;
  admin_id: number;
};

type RegisterData = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  country: string;
};

type RegisterResponse = {
  message: string;
  id: number;
};

type LoginData = {
  email: string;
  password: string;
};

type LoginResponse = {
  access_token: string;
  token_type: string;
  admin_id: number;
};

export const useAuthAdminContext = () => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const baseUrl = import.meta.env.VITE_REACT_APP_URL;

  useEffect(() => {
    const storedUser = localStorage.getItem("adminUser");
    if (storedUser) {
      setAdminUser(JSON.parse(storedUser));
    }
  }, []);

  const loginAdmin = async (data: LoginData): Promise<LoginResponse | null> => {
    console.log("data", data);
    try {
      const response = await fetch(`${baseUrl}/admin/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Error en login");
      }

      const responseData: LoginResponse = await response.json(); // Recibir LoginResponse
      const userData: AdminUser = {
        access_token: responseData.access_token,
        token_type: responseData.token_type,
        // full_name: responseData.full_name,
        admin_id: responseData.admin_id,
      };
      setAdminUser(userData);
      localStorage.setItem("adminUser", JSON.stringify(userData));
      return responseData;
    } catch (error) {
      console.error("Error en login:", error);
      return null;
    }
  };

  const registerAdmin = async (
    data: RegisterData
  ): Promise<RegisterResponse | null> => {
    try {
      const response = await fetch(`${baseUrl}/admin/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data), // Enviar RegisterData
      });

      if (!response.ok) {
        throw new Error("Error al registrar");
      }

      const responseData: RegisterResponse = await response.json(); // Recibir RegisterResponse
      return responseData;
    } catch (error) {
      console.error("Error en registro:", error);
      return null;
    }
  };

  const logoutAdmin = () => {
    setAdminUser(null); // Eliminar el usuario del estado
    localStorage.removeItem("access_token"); // Eliminar el token del Local Storage
  };

  return { adminUser, loginAdmin, registerAdmin, logoutAdmin };
};
