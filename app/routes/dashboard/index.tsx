/* eslint-disable jsx-a11y/label-has-associated-control */
// import { useState } from "react";
// import { Link } from "@remix-run/react";
// import { useGlobalContext } from "../../context/GlobalProvider"; // Ajusta el path
// import loginImage from "../../images/imageLogin4.png";
import { useGlobalContext } from "../../context/GlobalProvider";

export default function Dashboard() {
  const { auth } = useGlobalContext(); // Accede a la info del usuario
  const user = auth.user;
  return (
    <div className="flex ">
      <h1>tu dashboard aqui</h1>
      {user ? (
        <p>Hola, {user.full_name}!</p> // Renderiza el nombre si el usuario está logueado
      ) : (
        <p>Por favor, inicia sesión.</p> // Mensaje si el usuario no está logueado
      )}
    </div>
  );
}
