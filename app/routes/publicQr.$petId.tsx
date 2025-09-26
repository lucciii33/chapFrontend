/* eslint-disable jsx-a11y/label-has-associated-control */
import { useParams } from "@remix-run/react";
import { useEffect, useState } from "react";
import { useGlobalContext } from "../context/GlobalProvider";
import DogLoader from "../components/petLoader";
import axios from "axios";
import "../../styles/dashboard.css";
import { useTranslation } from "react-i18next";

export default function PublicQr() {
  const { t } = useTranslation();

  const { petId } = useParams();
  const [petData, setPetData] = useState(null);
  console.log("petData", petData);
  const [location, setLocation] = useState(null);
  const [ubicacion, setUbicacion] = useState(null);
  const [mapError, setMapError] = useState(false);
  const [storedUser, setStoredUser] = useState(null);
  console.log("storedUser", storedUser);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setStoredUser(localStorage.getItem("user"));
    }
  }, []);
  useEffect(() => {
    if (petId) {
      axios
        .get(`${import.meta.env.VITE_REACT_APP_URL}/api/public/pets/${petId}`)
        .then((response) => setPetData(response.data))
        .catch((error) => console.error("Error al obtener la mascota:", error));
    }
    if (!petId || storedUser) return;
    if (!storedUser) {
      const obtenerUbicacionGoogle = async () => {
        try {
          const response = await axios.post(
            `https://www.googleapis.com/geolocation/v1/geolocate?key=${
              import.meta.env.VITE_REACT_APP_GEOLOCATION_KEY
            }`
          );
          const data = response.data;
          setUbicacion({ lat: data.location.lat, lng: data.location.lng });
        } catch (error) {
          console.error("Error al obtener ubicación:", error);
          setUbicacion({ lat: "10.500000", lng: "-66.916664" });
        }
      };

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
    }

    // const watcher = navigator.geolocation.watchPosition(
    //   (position) => {
    //     const coords = {
    //       lat: position.coords.latitude,
    //       lng: position.coords.longitude,
    //     };
    //     setUbicacion(coords);
    //   },
    //   (error) => {
    //     console.warn("❌ Error en watchPosition:", error);
    //   },
    //   { enableHighAccuracy: true }
    // );
    // return () => navigator.geolocation.clearWatch(watcher);
  }, [petId]);

  useEffect(() => {
    if (!petData?.last_latitude || !petData?.last_longitude) return;
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
          window.google &&
            inicializarMapa(petData.last_latitude, petData.last_longitude);
        };

        script.onerror = () => {
          console.error("❌ Error al cargar Google Maps");
          setMapError(true);
        };

        document.body.appendChild(script);
      } else {
        // Ya cargado
        if (window.google) {
          // inicializarMapa(ubicacion.lat, ubicacion.lng);
          inicializarMapa(petData.last_latitude, petData.last_longitude);
        } else {
          existingScript.addEventListener("load", () => {
            // inicializarMapa(ubicacion.lat, ubicacion.lng);
            inicializarMapa(petData.last_latitude, petData.last_longitude);
          });
        }
      }
    };

    cargarScriptGoogleMaps();
  }, [ubicacion]);

  useEffect(() => {
    if (!ubicacion || !petId) return;

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

  useEffect(() => {
    if (!petData || !petId || !ubicacion?.lat || !ubicacion?.lng) return;

    if (!storedUser) {
      fetch(
        `${
          import.meta.env.VITE_REACT_APP_URL
        }/api/public/pets/${petId}/notify-scan`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            latitude: ubicacion?.lat,
            longitude: ubicacion?.lng,
          }),
        }
      )
        .then((res) => {
          if (!res.ok) {
            console.error("❌ Error notificando escaneo");
          } else {
            console.log("✅");
          }
        })
        .catch((err) => {
          console.error("❌ Error al hacer fetch para notificar escaneo:", err);
        });
    } else {
      console.log("🐶");
    }
  }, [petData]);

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
                  {t("qr_code_view.lost_title")}
                </h4>
                <p className="text-center text-base">
                  {t("qr_code_view.lost_subtitle")}
                </p>
                <a
                  href={`tel:${petData?.phone_number}`}
                  className="mt-4 px-2 py-2 bg-white text-red-500 font-semibold rounded-lg hover:bg-gray-200 transition"
                >
                  {t("qr_code_view.lost_button")}
                </a>
              </div>
            ) : null}
          </div>

          <div className="flex flex-col gap-8 py-1 px-5 min-h-screen">
            {/* Pets Information */}
            <div className="p-6 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-2xl shadow-lg">
              <h1 className="text-2xl font-bold mb-4 border-b border-white pb-2">
                {t("qr_code_view.title_pet")}
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
              <h3 className="text-lg font-semibold">
                {t("qr_code_view.name")}: {petData?.name}
              </h3>
              <p className="text-base">
                {t("qr_code_view.age")}: {petData?.age}
              </p>
              <p className="text-base">
                {t("qr_code_view.pet_color")}: {petData?.pet_color}
              </p>
              <p className="text-base">
                {t("qr_code_view.breed")}: {petData?.breed}
              </p>
              <p className="text-base">
                {t("qr_code_view.personality")}: {petData?.personality}
              </p>
              <p className="text-base">
                {t("qr_code_view.chip_number")}: {petData?.chip_number}
              </p>
              <p className="text-base">
                {t("qr_code_view.lost")}: {petData?.lost ? "Yes" : "No"}
              </p>
            </div>

            {/* Parents Information */}
            <div className="p-6 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-2xl shadow-lg">
              <h1 className="text-2xl font-bold mb-4 border-b border-white pb-2">
                {t("qr_code_view.title_owners")}
              </h1>
              <h3 className="text-lg font-semibold">
                {t("qr_code_view.owner_1")}: {petData?.dad_name}
              </h3>
              <p className="text-base">
                {" "}
                {t("qr_code_view.owner_2")}: {petData?.mom_name}
              </p>
              <p className="text-base">
                {t("qr_code_view.phone")}: {petData?.phone_number}
              </p>
              <p className="text-base">
                {t("qr_code_view.neighbourhood")}: {petData?.neighbourhood}
              </p>
              <p className="text-base">
                {t("qr_code_view.address")}: {petData?.address}
              </p>
            </div>

            <div className="p-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl shadow-lg">
              <h1 className="text-2xl font-bold mb-4 border-b border-white pb-2">
                {t("qr_code_view.title_medical")}
              </h1>
              {petData?.medical_history &&
              petData.medical_history.length &&
              petData.show_medical_history > 0 ? (
                <ul className="list-disc ml-6">
                  {petData.medical_history.map((note) => (
                    <li key={note.id} className="text-base mb-4 border-b pb-2">
                      <p>
                        <strong>{t("qr_code_view.description")}:</strong>{" "}
                        {note.description || "N/A"}
                      </p>
                      <p>
                        <strong>{t("qr_code_view.allergies")}:</strong>{" "}
                        {note.allergies || "N/A"}
                      </p>
                      <p>
                        <strong>{t("qr_code_view.behavior_notes")}:</strong>{" "}
                        {note.behavior_notes || "N/A"}
                      </p>
                      <p>
                        <strong>{t("qr_code_view.blood_type")}:</strong>{" "}
                        {note.blood_type || "N/A"}
                      </p>
                      <p>
                        <strong>{t("qr_code_view.chronic_treatment")}:</strong>{" "}
                        {note.chronic_conditions || "N/A"}
                      </p>
                      <p>
                        <strong>{t("qr_code_view.current_treatment")}:</strong>{" "}
                        {note.current_treatment || "N/A"}
                      </p>
                      <p>
                        <strong>{t("qr_code_view.diet")}:</strong>{" "}
                        {note.diet || "N/A"}
                      </p>
                      <p>
                        <strong>{t("qr_code_view.height")}:</strong>{" "}
                        {note.height !== null ? `${note.height} cm` : "N/A"}
                      </p>
                      <p>
                        <strong>{t("qr_code_view.weight")}:</strong>{" "}
                        {note.weight !== null ? `${note.weight} kg` : "N/A"}
                      </p>
                      <p>
                        <strong>{t("qr_code_view.important_notes")}:</strong>{" "}
                        {note.important_notes || "N/A"}
                      </p>
                      {/* <p>
                        <strong>{t("qr_code_view.medications")}:</strong>{" "}
                        {note.last_doctor_visit || "N/A"}
                      </p> */}
                      <p>
                        <strong>{t("qr_code_view.medications")}:</strong>{" "}
                        {note.medications || "N/A"}
                      </p>
                      <p>
                        <strong>{t("qr_code_view.surgical_history")}:</strong>{" "}
                        {note.surgical_history || "N/A"}
                      </p>
                      <p>
                        <strong>{t("qr_code_view.vaccination_status")}:</strong>{" "}
                        {note.vaccination_status || "N/A"}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-base">
                  {t("qr_code_view.medical_empty_message")}.
                </p>
              )}
            </div>

            {petData?.show_vet_visit && petData.medical_history?.length > 0 && (
              <div
                className="p-6
                bg-gradient-to-r
                from-purple-500
                to-pink-500
                text-white
                rounded-2xl
                shadow-lg"
              >
                <h2 className="text-xl font-bold mb-4">
                  {" "}
                  {t("vet_visits_public.title")}
                </h2>

                <div className="overflow-x-auto flex gap-4 pb-2">
                  {petData.medical_history.map((mh) =>
                    mh.vets.map((vet) => (
                      <div
                        key={vet.id}
                        className="min-w-[300px] bg-white rounded-lg text-black shadow-md p-4 flex-shrink-0"
                      >
                        <p>
                          <strong>{t("vet_visits_public.fields.date")}:</strong>{" "}
                          {vet.date
                            ? new Date(vet.date).toLocaleDateString()
                            : "N/A"}
                        </p>
                        <p>
                          <strong>
                            {t("vet_visits_public.fields.address")}:
                          </strong>{" "}
                          {vet.address || "N/A"}
                        </p>
                        <p>
                          <strong>
                            {t("vet_visits_public.fields.treatment")}:
                          </strong>{" "}
                          {vet.treatment || "N/A"}
                        </p>
                        <p>
                          <strong>
                            {t("vet_visits_public.fields.notes")}:
                          </strong>{" "}
                          {vet.notes || "N/A"}
                        </p>
                        <p>
                          <strong>
                            {t("vet_visits_public.fields.cause")}:
                          </strong>{" "}
                          {vet.cause || "N/A"}
                        </p>
                        <p>
                          <strong>{t("vet_visits_public.fields.cost")}:</strong>{" "}
                          {vet.cost ? `$${vet.cost}` : "N/A"}
                        </p>
                        {vet.documents.length > 0 && (
                          <div className="mt-2">
                            <p className="font-semibold">
                              {t("vet_visits_public.fields.documents")}:
                            </p>
                            <ul className="list-disc list-inside">
                              {vet.documents.map((doc) => (
                                <li key={doc.id}>
                                  <a
                                    href={doc.file_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline"
                                  >
                                    {doc.filename}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            <div className="p-6 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-2xl shadow-lg">
              <h1 className="text-2xl font-bold mb-4 border-b border-white pb-2">
                {t("qr_code_view.title_travel_mode")}.
              </h1>
              {petData?.care_profile && petData.show_travel_mode ? (
                <div>
                  <p>
                    <strong> {t("qr_code_view.feeding_instructions")}: </strong>
                    {petData?.care_profile.feeding_instructions}
                  </p>
                  <p>
                    <strong>{t("qr_code_view.walk_instructions")}: </strong>
                    {petData?.care_profile.walk_instructions}
                  </p>
                  <p>
                    <strong>
                      {t("qr_code_view.medication_instructions")}:{" "}
                    </strong>
                    {petData?.care_profile.medication_instructions}
                  </p>
                  <p>
                    <strong>{t("qr_code_view.allergies")}: </strong>
                    {petData?.care_profile.allergies}
                  </p>
                  <p>
                    <strong>{t("qr_code_view.important_notes")}: </strong>
                    {petData?.care_profile.notes}
                  </p>
                  <p>
                    <strong>{t("qr_code_view.emergency_contact")}: </strong>
                    {petData?.care_profile.emergency_contact}
                  </p>
                </div>
              ) : (
                <p className="text-base">{t("qr_code_view.important_notes")}</p>
              )}
            </div>

            {/* <div id="map" style={{ height: "400px", width: "100%" }} /> */}
            {/* {mapError ? (
              <div className="text-center text-red-500 font-bold">
                ❌ No se pudo cargar Google Maps.
              </div>
            ) : (
              <div>
                <div className="">
                  <p className="text-white">Last location Scan:</p>
                </div>
                <div
                  className="mt-3"
                  id="map"
                  style={{ height: "400px", width: "100%" }}
                />
              </div>
            )} */}
            {mapError ? (
              <div className="text-center text-red-500 font-bold">
                ❌ No se pudo cargar Google Maps.
              </div>
            ) : !petData?.last_latitude || !petData?.last_longitude ? (
              <div className="text-center text-gray-500">
                ⏳ Cargando mapa...
              </div>
            ) : (
              <div>
                <p className="text-white">Last location Scan:</p>
                <div
                  id="map"
                  style={{ height: "400px", width: "100%" }}
                  className="mt-3"
                />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            {t("qr_code_view.not_active")}
          </h1>
          <p className="text-lg text-gray-700 max-w-md">
            {t("qr_code_view.not_Active_description")}
          </p>
        </div>
      )}
    </div>
  );
}
