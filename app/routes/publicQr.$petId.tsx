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
  const [location, setLocation] = useState(null);
  const [ubicacion, setUbicacion] = useState(null);
  console.log("ubicacion", ubicacion);

  console.log("location", location);

  // useEffect(() => {
  //   if (petId) {
  //     fetch(`http://localhost:8000/api/public/pets/${petId}`) // Ajusta la URL si estás en producción
  //       .then((response) => response.json())
  //       .then((data) => setPetData(data))
  //       .catch((error) => {
  //         console.error("Error al obtener la mascota:", error);
  //       });
  //   }
  // }, []);

  // useEffect(() => {
  //   // Fallback automático usando IP para obtener ubicación aproximada
  //   const fetchLocation = async () => {
  //     const response = await fetch("https://ipapi.co/json/");
  //     const data = await response.json();
  //     setLocation({ latitude: data.latitude, longitude: data.longitude });
  //   };

  //   fetchLocation();
  // }, []);

  // useEffect(() => {
  //   const obtenerUbicacionGoogle = async () => {
  //     try {
  //       const response = await fetch(
  //         "https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyAnfAXFYsqhCMliHPvwuxVFe7vSHsv1vT0",
  //         {
  //           method: "POST",
  //         }
  //       );
  //       const data = await response.json();

  //       console.log(
  //         "Ubicación más precisa (Google):",
  //         data.location.lat,
  //         data.location.lng
  //       );
  //       return { lat: data.location.lat, lng: data.location.lng };
  //     } catch (error) {
  //       console.error("Error al obtener ubicación con Google:", error);
  //     }
  //   };

  //   obtenerUbicacionGoogle();
  // }, []);

  // useEffect(() => {
  //   const obtenerUbicacionGoogle = async () => {
  //     try {
  //       const response = await fetch(
  //         "https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyAnfAXFYsqhCMliHPvwuxVFe7vSHsv1vT0",
  //         { method: "POST" }
  //       );
  //       const data = await response.json();
  //       setUbicacion({ lat: data.location.lat, lng: data.location.lng });
  //     } catch (error) {
  //       console.error("Error al obtener ubicación:", error);
  //     }
  //   };

  //   const cargarScriptGoogleMaps = () => {
  //     if (!document.querySelector('[src*="maps.googleapis.com"]')) {
  //       const script = document.createElement("script");
  //       script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCkCrNWHvyOhNXdFBNeDCsRettgIRObUfE&callback=initMap`;
  //       script.async = true;
  //       script.onload = () => {
  //         if (ubicacion) inicializarMapa(ubicacion.lat, ubicacion.lng);
  //       };
  //       document.body.appendChild(script);
  //     } else {
  //       if (ubicacion) inicializarMapa(ubicacion.lat, ubicacion.lng);
  //     }
  //   };

  //   const inicializarMapa = (lat, lng) => {
  //     const map = new google.maps.Map(document.getElementById("map"), {
  //       center: { lat, lng },
  //       zoom: 14,
  //     });

  //     new google.maps.Marker({
  //       position: { lat, lng },
  //       map: map,
  //       title: "Ubicación detectada",
  //     });
  //   };

  //   obtenerUbicacionGoogle();
  //   cargarScriptGoogleMaps();
  // }, []);

  useEffect(() => {
    // 1. Obtén los detalles de la mascota
    if (petId) {
      fetch(`http://localhost:8000/api/public/pets/${petId}`)
        .then((response) => response.json())
        .then((data) => setPetData(data))
        .catch((error) => console.error("Error al obtener la mascota:", error));
    }

    // 2. Obtén la ubicación de Google Geolocation
    const obtenerUbicacionGoogle = async () => {
      try {
        const response = await fetch(
          "https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyAnfAXFYsqhCMliHPvwuxVFe7vSHsv1vT0",
          { method: "POST" }
        );
        const data = await response.json();
        setUbicacion({ lat: data.location.lat, lng: data.location.lng });
      } catch (error) {
        console.error("Error al obtener ubicación:", error);
      }
    };

    obtenerUbicacionGoogle();
  }, [petId]);

  useEffect(() => {
    // 3. Cargar script de Google Maps después de obtener ubicación
    if (!ubicacion) return;

    const cargarScriptGoogleMaps = () => {
      if (!document.querySelector('[src*="maps.googleapis.com"]')) {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCkCrNWHvyOhNXdFBNeDCsRettgIRObUfE&callback=initMap`;
        script.async = true;

        window.initMap = () => inicializarMapa(ubicacion.lat, ubicacion.lng);
        document.body.appendChild(script);
      } else {
        inicializarMapa(ubicacion.lat, ubicacion.lng);
      }
    };

    cargarScriptGoogleMaps();
  }, [ubicacion]);

  const inicializarMapa = (lat, lng) => {
    const mapaContenedor = document.getElementById("map");

    if (!mapaContenedor) {
      console.error("Contenedor del mapa no encontrado.");
      return;
    }

    const map = new google.maps.Map(mapaContenedor, {
      center: { lat, lng },
      zoom: 14,
    });

    new google.maps.Marker({
      position: { lat, lng },
      map: map,
      title: "Ubicación detectada",
    });
  };

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
        <div id="map" style={{ height: "400px", width: "100%" }} />
      </div>
    </div>
  );
}
