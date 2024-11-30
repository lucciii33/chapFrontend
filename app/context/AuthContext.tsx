import { useState } from "react";

type User = {
  access_token: string;
  token_type: string;
  full_name: string;
  id: number;
};

type RegisterData = {
  name: string;
  email: string;
  hashed_password: string;
  country: string;
  age: number;
};

type RegisterResponse = {
  id: number;
  email: string;
  full_name: string;
  country: string;
  age: number;
};

type LoginData = {
  email: string;
  hashed_password: string;
};

type LoginResponse = {
  access_token: string;
  token_type: string;
  full_name: string;
  id: number;
};

export const useAuthContext = () => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (data: LoginData): Promise<LoginResponse | null> => {
    try {
      const response = await fetch("http://127.0.0.1:8000/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data), // Enviar LoginData
      });

      if (!response.ok) {
        throw new Error("Error en login");
      }

      const responseData: LoginResponse = await response.json(); // Recibir LoginResponse
      setUser({
        access_token: responseData.access_token,
        token_type: responseData.token_type,
        full_name: responseData.full_name,
        id: responseData.id,
      });
      return responseData;
    } catch (error) {
      console.error("Error en login:", error);
      return null;
    }
  };

  const register = async (
    data: RegisterData
  ): Promise<RegisterResponse | null> => {
    try {
      const response = await fetch("http://127.0.0.1:8000/users/register", {
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

  const logout = () => {
    setUser(null);
  };

  return { user, login, register, logout };
};
