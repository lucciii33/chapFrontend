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

  return (
    <div className=" ">
      <div className="p-5">
        {petData?.lost ? (
          <div className="p-4 bg-red-500 text-white rounded-2xl shadow-lg flex flex-col items-center">
            <h4 className="text-2xl font-bold mb-2 border-b border-white pb-2 text-center">
              This pet is lost, please help!
            </h4>
            <p className="text-center text-base">
              Contact the parent of the pet directly to help them find their
              pet.
            </p>
            <button className="mt-4 px-2 py-2 bg-white text-red-500 font-semibold rounded-lg hover:bg-gray-200 transition">
              Contact Now
            </button>
          </div>
        ) : null}
      </div>
      {/* <div className="flex justify-center py-5">
        <img
          src={petData.profile_photo}
          atl="dg"
          className="w-32 h-32 object-cover rounded-full mb-2"
        />
      </div> */}
      <div className="flex flex-col gap-8 py-1 px-5 min-h-screen">
        {/* Pets Information */}
        <div className="p-6 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-2xl shadow-lg">
          <h1 className="text-2xl font-bold mb-4 border-b border-white pb-2">
            Pets Information
          </h1>
          <img
            src={petData.profile_photo}
            atl="dg"
            className="w-32 h-32 object-cover rounded-full mb-2"
          />
          <h3 className="text-lg font-semibold">Name: {petData?.name}</h3>
          <p className="text-base">Age: {petData?.age}</p>
          <p className="text-base">Pet Color: {petData?.pet_color}</p>
          <p className="text-base">Breed: {petData?.breed}</p>
          <p className="text-base">Personality: {petData?.personality}</p>
          <p className="text-base">Chip Number: {petData?.chip_number}</p>
          <p className="text-base">Lost?: {petData?.lost ? "Yes" : "No"}</p>
        </div>

        {/* Parents Information */}
        <div className="p-6 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-2xl shadow-lg">
          <h1 className="text-2xl font-bold mb-4 border-b border-white pb-2">
            Parents Information
          </h1>
          <h3 className="text-lg font-semibold">
            Dad Name: {petData?.dad_name}
          </h3>
          <p className="text-base">Mom Name: {petData?.mom_name}</p>
          <p className="text-base">Phone Number: {petData?.phone_number}</p>
          <p className="text-base">Neighbourhood: {petData?.neighbourhood}</p>
          <p className="text-base">Address: {petData?.address}</p>
        </div>

        <div className="p-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl shadow-lg">
          <h1 className="text-2xl font-bold mb-4 border-b border-white pb-2">
            Medical Notes
          </h1>
          {petData?.medical_history && petData.medical_history.length > 0 ? (
            <ul className="list-disc ml-6">
              {petData.medical_history.map((note) => (
                <li key={note.id} className="text-base mb-2">
                  {note.description}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-base">No medical history available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
