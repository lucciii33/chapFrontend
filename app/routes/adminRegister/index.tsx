/* eslint-disable jsx-a11y/label-has-associated-control */
import loginImage from "../../images/imageLogin4.png";
import { useState } from "react";
import { useGlobalContext } from "../../context/GlobalProvider"; // Ajusta el path
import { Link, useNavigate } from "@remix-run/react";

export default function Register() {
  const { authAdmin } = useGlobalContext();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    country: "",
    email: "",
    password: "",
  });

  console.log("formData", formData);

  const onChangeAdmin = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegisterClick = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await authAdmin.registerAdmin(formData);
      console.log("Result", result);
      if (result) {
        console.log("Login exitoso", result);
        navigate("/loginAdmin");
      } else {
        console.error("Credenciales incorrectas");
      }
    } catch (error) {
      console.error("Error en login:", error);
    }
  };

  return (
    <div className="flex ">
      {/* Imagen a la izquierda */}
      <div className="w-1/2 flex items-center justify-center">
        <img
          src={loginImage}
          alt="Login"
          className="min-w-full h-screen object-cover"
        />
      </div>

      {/* Formulario a la derecha */}
      <div className="w-1/2 flex items-center justify-center bg-neutral-950">
        <div className="w-full max-w-lg px-4 ">
          <div className="flex items-center justify-center">
            <h1 className="text-2xl font-bold mb-4 text-slate-50">Register</h1>
          </div>

          {/* Aquí puedes agregar tus campos de formulario */}
          <div className="mb-4">
            <label className="block text-slate-50">Firts Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Enter your username"
              onChange={onChangeAdmin}
              name="first_name"
              value={formData.first_name}
            />
          </div>
          <div className="mb-4">
            <label className="block text-slate-50">Last Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Enter your username"
              onChange={onChangeAdmin}
              name="last_name"
              value={formData.last_name}
            />
          </div>
          <div className="mb-4">
            <label className="block text-slate-50">Email</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Enter your username"
              onChange={onChangeAdmin}
              name="email"
              value={formData.email}
            />
          </div>
          <div className="mb-4">
            <label className="block text-slate-50">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Enter your password"
              onChange={onChangeAdmin}
              name="password"
              value={formData.password}
            />
          </div>
          <div className="mb-4">
            <label className="block text-slate-50">Country</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Enter your password"
              onChange={onChangeAdmin}
              name="country"
              value={formData.country}
            />
          </div>
          <div className="mb-1 flex align-middle">
            <div>
              <label className="block text-slate-50">
                I agree to the terms and conditions
              </label>
            </div>
            <div>
              <input
                type="checkbox"
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Enter your password"
              />
            </div>
          </div>
          <div className="mb-2">
            <Link to="/login">Alredy have an account? Login here</Link>
          </div>

          <div className="w-full">
            <button
              className="w-full border-none py-3 px-4  bg-teal-500 text-white rounded-lg"
              onClick={handleRegisterClick}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
