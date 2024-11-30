import { useParams } from "@remix-run/react";
import { useEffect, useState } from "react";

import { useGlobalContext } from "../context/GlobalProvider";

export default function PetDetail() {
  const { pet } = useGlobalContext();
  const { getPetById, petByID } = pet;

  const { petId } = useParams();
  console.log("petttttt", petId);

  useEffect(() => {
    if (petId) {
      getPetById(Number(petId));
    }
  }, []);

  if (!petByID) {
    return <div>Cargando los detalles de la mascota...</div>;
  }

  console.log("petttttt", petId);

  return <div>HOLAAAA BRAHHHHH</div>;
}
