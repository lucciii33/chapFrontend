/* eslint-disable jsx-a11y/label-has-associated-control */
// import { useState } from "react";
// import { Link, useNavigate } from "@remix-run/react";
// import { useGlobalContext } from "../../context/GlobalProvider"; // Ajusta el path
// import loginImage from "../../images/imageLogin4.png";
import { useParams } from "@remix-run/react";
import { useEffect, useState } from "react";
import { useGlobalContext } from "../context/GlobalProvider";

export default function PublicQr() {
  //   const navigate = useNavigate();
  //   const { pet, cart, auth } = useGlobalContext();
  //   const { getPetById, petByID, editPet } = pet;
  //   const { createCart, cartProfile, getCartByUser } = cart;
  //   const { user } = auth;

  const { petId } = useParams();
  //   console.log("petttttt", petId);
  //   console.log("petByID", petByID);
  //   console.log("cartProfile", cartProfile);
  const [petData, setPetData] = useState(null);

  useEffect(() => {
    if (petId) {
      fetch(`http://localhost:8000/api/public/pets/${petId}`) // Ajusta la URL si estás en producción
        .then((response) => response.json())
        .then((data) => setPetData(data))
        .catch((error) => {
          console.error("Error al obtener la mascota:", error);
        });
    }
  }, []);

  if (!petData) {
    return <div>Cargando los detalles de la mascota...</div>;
  }

  console.log("petData", petData);

  return <div className="flex ">holaaaaaa</div>;
}
