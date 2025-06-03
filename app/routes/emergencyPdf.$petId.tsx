import { useEffect, useState } from "react";
import { useParams } from "@remix-run/react";
import { useGlobalContext } from "~/context/GlobalProvider";
import "../../styles/dashboard.css";
import html2canvas from "html2canvas-pro";

export default function EmegencyPdf() {
  const [lastSeenTime, setLastSeenTime] = useState("");
  const [lastSeenPlace, setLastSeenPlace] = useState("");
  const { pet } = useGlobalContext();
  const { getPetById, petByID, editPet } = pet;
  const { petId } = useParams();
  const backendUrl = import.meta.env.VITE_REACT_APP_URL;

  useEffect(() => {
    if (petId) getPetById(petId);
  }, [petId]);

  useEffect(() => {
    if (petByID) {
      if (petByID.last_time_pet_seen) {
        setLastSeenTime(
          new Date(petByID.last_time_pet_seen).toISOString().slice(0, 16)
        );
      }
      if (petByID.last_place_pet_seen) {
        setLastSeenPlace(petByID.last_place_pet_seen);
      }
    }
  }, [petByID]);

  if (!petByID) {
    return (
      <div className="p-5 text-center">Cargando datos de la mascota...</div>
    );
  }

  const {
    name,
    breed,
    age,
    pet_color,
    profile_photo,
    personality,
    phone_number,
    dad_name,
    mom_name,
  } = petByID;

  const handleLostPetUpdate = async () => {
    if (!petId) return;

    const updateData = {
      last_time_pet_seen: lastSeenTime
        ? new Date(lastSeenTime).toISOString()
        : null,
      last_place_pet_seen: lastSeenPlace || null,
      profile_photo: null,
    };

    const result = await editPet(Number(petId), updateData as any);
    if (result) {
      await getPetById(petId);
      showSuccessToast("Datos del perro perdido actualizados.");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadImage = async () => {
    const element = document.getElementById("pdf-content");
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: null,
      });

      const dataUrl = canvas.toDataURL("image/png");

      // Crear link para descarga
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "lost-pet-poster.png";
      link.click();
    } catch (error) {
      console.error("Error generating image:", error);
    }
  };

  return (
    <>
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #pdf-content, #pdf-content * {
            visibility: visible !important;
          }
          #pdf-content {
            position: absolute !important;
            left: 0;
            top: 0;
            width: 100%;
          }
          button, input, label {
            display: none !important;
          }
        }
      `}</style>

      <div className="p-5">
        <h1 className="text-4xl font-bold text-center text-teal-500 mb-4">
          Lost Pet Emergency Poster
        </h1>
        <p className="text-center text-lg text-white max-w-xl mx-auto">
          Use this page to generate a missing pet poster. You can download it as
          a PDF or share it directly on social media to help find your furry
          friend faster.
        </p>

        <div className="my-5 p-4 border rounded bg-white">
          <h2 className="text-xl font-bold mb-2 text-red-600">
            ¿Cuándo y dónde viste por última vez a tu mascota?
          </h2>
          <label className="block mb-2 text-sm text-gray-700">
            Última vez vista (fecha y hora):
            <input
              type="datetime-local"
              value={lastSeenTime}
              onChange={(e) => setLastSeenTime(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg mb-4 bg-transparent"
            />
          </label>

          <label className="block mb-2 text-sm text-gray-700">
            Último lugar visto:
            <input
              type="text"
              value={lastSeenPlace}
              onChange={(e) => setLastSeenPlace(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg mb-4 bg-transparent"
              placeholder="Ej. Parque Central, Calle 8, etc."
            />
          </label>

          <button
            onClick={handleLostPetUpdate}
            className="mt-3 bg-teal-500 text-white px-4 py-2 rounded"
          >
            Guardar información de pérdida
          </button>
        </div>

        <button
          onClick={handleDownloadImage}
          className="text-teal-500 mt-3 mb-3"
          type="button"
        >
          Imprimir / Guardar como PDF
        </button>

        <div id="pdf-content" className="bg-white p-5 rounded shadow-lg">
          <div className="w-full h-64 bg-[#e60000] flex justify-center items-center flex-col">
            <h1 className="text-4xl md:text-8xl font-extrabold text-white mb-2">
              MISSING PET
            </h1>
            <p className="text-lg font-light text-white">
              A cry for help for our furry friend
            </p>
          </div>

          <div className="w-full flex flex-col md:flex-row justify-center p-5">
            <div>
              <img
                id="pet-photo"
                className="h-[500px]"
                src={`${backendUrl}/api/proxy-image?url=${encodeURIComponent(
                  profile_photo
                )}`}
                alt="pet"
              />
            </div>
            <div className="text-start ms-5">
              <h1 className="text-[#e60000] text-8xl">{name}</h1>
              <p className="text-[#000000] text-lg">
                Breed: <strong>{breed}</strong>
              </p>
              <p className="text-[#000000] text-lg">
                Age: <strong>{age}</strong>
              </p>
              <p className="text-[#000000] text-lg">
                Color: <strong>{pet_color}</strong>
              </p>
              <p className="text-[#000000] text-lg max-w-[300px]">
                Personality: <strong>{personality}</strong>
              </p>
              <div className="bg-[#e60000] w-100 h-2 mt-3 mb-3"></div>
              <h1 className="text-[#e60000] text-6xl">Owners</h1>
              <p className="text-[#000000] text-lg">
                Owner 1: <strong>{dad_name}</strong>
              </p>
              <p className="text-[#000000] text-lg">
                Owner 2: <strong>{mom_name}</strong>
              </p>
              <p className="text-[#000000] text-lg">
                Phone: <strong>{phone_number}</strong>
              </p>
              {petByID.last_place_pet_seen && (
                <p className="text-[#000000] text-lg">
                  Last seen place:{" "}
                  <strong>{petByID.last_place_pet_seen}</strong>
                </p>
              )}
              {petByID.last_time_pet_seen && (
                <p className="text-[#000000] text-lg">
                  Last seen time:{" "}
                  <strong>
                    {new Date(petByID.last_time_pet_seen).toLocaleString(
                      "es-ES"
                    )}
                  </strong>
                </p>
              )}
            </div>
          </div>

          <div className="w-full h-64 bg-[#e60000] flex justify-center items-center flex-col">
            <p className="text-lg font-light text-white text-center">
              Call or text with any information
            </p>
            <h1 className="text-4xl md:text-8xl font-extrabold text-white text-center">
              {phone_number}
            </h1>
          </div>
        </div>
      </div>
    </>
  );
}
