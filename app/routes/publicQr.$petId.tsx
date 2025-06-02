/* eslint-disable jsx-a11y/label-has-associated-control */
// import { useState } from "react";
// import { Link, useNavigate } from "@remix-run/react";
// import { useGlobalContext } from "../../context/GlobalProvider"; // Ajusta el path
// import loginImage from "../../images/imageLogin4.png";
import { useParams } from "@remix-run/react";
import { useEffect, useState } from "react";
import { useGlobalContext } from "../context/GlobalProvider";
import DogLoader from "../components/petLoader";
import axios from "axios";
import "../../styles/dashboard.css";

export default function PublicQr() {
  const { petId } = useParams();
  const [petData, setPetData] = useState(null);
  const [location, setLocation] = useState(null);
  const [ubicacion, setUbicacion] = useState(null);
  const [mapError, setMapError] = useState(false);
  console.log("petData", petData);

  // useEffect(() => {
  //   if (petId) {
  //     axios
  //       .get(`${import.meta.env.VITE_REACT_APP_URL}/api/public/pets/${petId}`)
  //       .then((response) => setPetData(response.data))
  //       .catch((error) => console.error("Error al obtener la mascota:", error));
  //   }

  //   const obtenerUbicacionGoogle = async () => {
  //     try {
  //       const response = await axios.post(
  //         `https://www.googleapis.com/geolocation/v1/geolocate?key=${
  //           import.meta.env.VITE_REACT_APP_GEOLOCATION_KEY
  //         }`
  //       );
  //       const data = response.data;
  //       setUbicacion({ lat: data.location.lat, lng: data.location.lng });
  //     } catch (error) {
  //       console.error("Error al obtener ubicación:", error);
  //       setUbicacion({ lat: "40.4153528", lng: "-3.7090139" });
  //     }
  //   };

  //   obtenerUbicacionGoogle();
  // }, [petId]);

  useEffect(() => {
    if (petId) {
      axios
        .get(`${import.meta.env.VITE_REACT_APP_URL}/api/public/pets/${petId}`)
        .then((response) => setPetData(response.data))
        .catch((error) => console.error("Error al obtener la mascota:", error));
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUbicacion(coords);
      },
      async (error) => {
        console.warn("❌ Usuario rechazó ubicación o falló:", error);
        await obtenerUbicacionGoogle();
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );

    const obtenerUbicacionGoogle = async () => {
      try {
        const response = await axios.post(
          `https://www.googleapis.com/geolocation/v1/geolocate?key=${
            import.meta.env.VITE_REACT_APP_GEOLOCATION_KEY
          }`
        );
        console.log("✅ Ubicación recibida desde API de Google:", response);

        const data = response.data;
        setUbicacion({ lat: data.location.lat, lng: data.location.lng });
      } catch (error) {
        console.error("Error al obtener ubicación:", error);
        setUbicacion({ lat: "10.500000", lng: "-66.916664" });
      }
    };
  }, [petId]);

  useEffect(() => {
    if (!ubicacion) return;
    const cargarScriptGoogleMaps = () => {
      const existingScript = document.querySelector(
        '[src*="maps.googleapis.com"]'
      );

      if (!existingScript) {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${
          import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_KEY
        }`;
        script.async = true;

        script.onload = () => {
          window.google && inicializarMapa(ubicacion.lat, ubicacion.lng);
        };

        script.onerror = () => {
          console.error("❌ Error al cargar Google Maps");
          setMapError(true);
        };

        document.body.appendChild(script);
      } else {
        // Ya cargado
        if (window.google) {
          inicializarMapa(ubicacion.lat, ubicacion.lng);
        } else {
          existingScript.addEventListener("load", () => {
            inicializarMapa(ubicacion.lat, ubicacion.lng);
          });
        }
      }
    };

    cargarScriptGoogleMaps();
  }, [ubicacion]);

  useEffect(() => {
    if (!ubicacion || !petId) return;
    console.log("ubicacionubicacionubicacion", ubicacion);

    const updateLastLatAndLastLong = async () => {
      try {
        const response = await axios.put(
          `${import.meta.env.VITE_REACT_APP_URL}/api/pets/${petId}/location/`,
          {
            last_latitude: ubicacion.lat,
            last_longitude: ubicacion.lng,
          }
        );
        const updatedData = response.data;
        return updatedData;
        // setPetData(updatedData);
      } catch (error) {
        console.error("Error al actualizar la ubicación:", error);
      }
    };

    updateLastLatAndLastLong();
  }, [ubicacion, petId]);

  const inicializarMapa = (lat, lng) => {
    if (!window.google || !window.google.maps) {
      console.error("Google Maps aún no está cargado");
      return;
    }
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

  return (
    <div className="">
      {!petData ? (
        <div className="">
          <DogLoader />
        </div>
      ) : petData.pay_show_info ? (
        <div>
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

          <div className="flex flex-col gap-8 py-1 px-5 min-h-screen">
            {/* Pets Information */}
            <div className="p-6 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-2xl shadow-lg">
              <h1 className="text-2xl font-bold mb-4 border-b border-white pb-2">
                Pets Information
              </h1>
              <img
                src={
                  petData?.profile_photo
                    ? petData?.profile_photo
                    : "https://chap-blue.s3.us-east-2.amazonaws.com/Group+5350.png"
                }
                alt="dg"
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
              <p className="text-base">
                Neighbourhood: {petData?.neighbourhood}
              </p>
              <p className="text-base">Address: {petData?.address}</p>
            </div>

            <div className="p-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl shadow-lg">
              <h1 className="text-2xl font-bold mb-4 border-b border-white pb-2">
                Medical Notes
              </h1>
              {petData?.medical_history &&
              petData.medical_history.length &&
              petData.show_medical_history > 0 ? (
                <ul className="list-disc ml-6">
                  {petData.medical_history.map((note) => (
                    <li key={note.id} className="text-base mb-4 border-b pb-2">
                      <p>
                        <strong>Description:</strong>{" "}
                        {note.description || "N/A"}
                      </p>
                      <p>
                        <strong>Allergies:</strong> {note.allergies || "N/A"}
                      </p>
                      <p>
                        <strong>Behavior Notes:</strong>{" "}
                        {note.behavior_notes || "N/A"}
                      </p>
                      <p>
                        <strong>Blood Type:</strong> {note.blood_type || "N/A"}
                      </p>
                      <p>
                        <strong>Chronic Conditions:</strong>{" "}
                        {note.chronic_conditions || "N/A"}
                      </p>
                      <p>
                        <strong>Current Treatment:</strong>{" "}
                        {note.current_treatment || "N/A"}
                      </p>
                      <p>
                        <strong>Diet:</strong> {note.diet || "N/A"}
                      </p>
                      <p>
                        <strong>Height:</strong>{" "}
                        {note.height !== null ? `${note.height} cm` : "N/A"}
                      </p>
                      <p>
                        <strong>Important Notes:</strong>{" "}
                        {note.important_notes || "N/A"}
                      </p>
                      <p>
                        <strong>Last Doctor Visit:</strong>{" "}
                        {note.last_doctor_visit || "N/A"}
                      </p>
                      <p>
                        <strong>Medications:</strong>{" "}
                        {note.medications || "N/A"}
                      </p>
                      <p>
                        <strong>Surgical History:</strong>{" "}
                        {note.surgical_history || "N/A"}
                      </p>
                      <p>
                        <strong>Vaccination Status:</strong>{" "}
                        {note.vaccination_status || "N/A"}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-base">No medical history available.</p>
              )}
            </div>

            <div className="p-6 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-2xl shadow-lg">
              <h1 className="text-2xl font-bold mb-4 border-b border-white pb-2">
                TRAVEL MODE
              </h1>
              {petData?.care_profile && petData.show_travel_mode ? (
                <div>
                  <p>
                    <strong>Feeding Instructions: </strong>
                    {petData?.care_profile.feeding_instructions}
                  </p>
                  <p>
                    <strong> Walk instructions: </strong>
                    {petData?.care_profile.walk_instructions}
                  </p>
                  <p>
                    <strong>Medication Instructions: </strong>
                    {petData?.care_profile.medication_instructions}
                  </p>
                  <p>
                    <strong>allergies: </strong>
                    {petData?.care_profile.allergies}
                  </p>
                  <p>
                    <strong>notes: </strong>
                    {petData?.care_profile.notes}
                  </p>
                  <p>
                    <strong>Emergency Contac:: </strong>
                    {petData?.care_profile.emergency_contac}
                  </p>
                </div>
              ) : (
                <p className="text-base">
                  no travel mode at the moment available.
                </p>
              )}
            </div>

            {/* <div id="map" style={{ height: "400px", width: "100%" }} /> */}
            {mapError ? (
              <div className="text-center text-red-500 font-bold">
                ❌ No se pudo cargar Google Maps.
              </div>
            ) : (
              <div id="map" style={{ height: "400px", width: "100%" }} />
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            QR Not Activated
          </h1>
          <p className="text-lg text-gray-700 max-w-md">
            This QR code has not been activated yet. Please ask the pet owner to
            complete the purchase and activation process.
          </p>
        </div>
      )}
    </div>
  );
}
