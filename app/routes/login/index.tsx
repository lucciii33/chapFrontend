/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState } from "react";
import { Link, useNavigate } from "@remix-run/react";
import { useGlobalContext } from "../../context/GlobalProvider"; // Ajusta el path
import loginImage from "../../images/imageLogin4.png";
import "../../../styles/dashboard.css";

export default function Login() {
  const { auth } = useGlobalContext();
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    email: "",
    hashed_password: "",
  });

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleLoginClick = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await auth.login(loginData);
      console.log("Result", result);
      if (result) {
        console.log("Login exitoso", result);
        navigate("/dashboard");
      } else {
        console.error("Credenciales incorrectas");
      }
    } catch (error) {
      console.error("Error en login:", error);
    }
  };
  return (
    <div className="flex flex-col md:flex-row">
      <div className=" w-full md:w-1/2 flex items-center justify-center">
        <img
          src={loginImage}
          alt="Login"
          className="min-w-full h-80 md:h-screen object-cover"
        />
      </div>
      <div className=" w-full md:w-1/2 flex items-center justify-center bg-neutral-950">
        <div className="w-full max-w-lg px-4 py-5 md:py-0">
          <div className="flex items-center justify-center">
            <h1
              className="text-4xl font-bold mb-4 text-slate-50"
              style={{ fontFamily: "chapFont" }}
            >
              LOGIN
            </h1>
          </div>
          <div className="mb-4">
            <label className="block text-slate-50">Email</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Enter your username"
              name="email"
              value={loginData.email}
              onChange={handleOnChange}
            />
          </div>
          <div className="mb-2">
            <label className="block text-slate-50">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Enter your password"
              name="hashed_password"
              value={loginData.hashed_password}
              onChange={handleOnChange}
            />
          </div>
          <div className="mb-2">
            <Link to="/register">dont have an account yet? Register here</Link>
          </div>
          <div className="w-full">
            <button
              className="w-full border-none py-3 px-4  bg-teal-500 text-white rounded-lg"
              onClick={handleLoginClick}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
