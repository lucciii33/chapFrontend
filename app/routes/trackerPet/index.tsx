/* eslint-disable jsx-a11y/label-has-associated-control */
import { Link, useNavigate } from "@remix-run/react";
import { useState } from "react";
import { useGlobalContext } from "../../context/GlobalProvider"; // Ajusta el path

import loginImage from "../../images/imageLogin4.png";

export default function Register() {
  //   const { auth } = useGlobalContext();
  //   const navigate = useNavigate();

  //   const [formData, setFormData] = useState({
  //     full_name: "",
  //     country: "",
  //     email: "",
  //     hashed_password: "",
  //     age: 0,
  //   });

  //   console.log("formData", formData);

  //   const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //     const { name, value } = e.target;
  //     setFormData((prev) => ({
  //       ...prev,
  //       [name]: value,
  //     }));
  //   };

  //   const handleRegisterClick = async (e: React.FormEvent) => {
  //     e.preventDefault();
  //     try {
  //       const result = await auth.register(formData);
  //       console.log("Result", result);
  //       if (result) {
  //         console.log("Login exitoso", result);
  //         navigate("/login");
  //       } else {
  //         console.error("Credenciales incorrectas");
  //       }
  //     } catch (error) {
  //       console.error("Error en login:", error);
  //     }
  //   };
  return <div className="flex ">Track here you lovely pet</div>;
}
