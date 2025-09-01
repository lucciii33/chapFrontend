import { useState } from "react";
import { PetTrackerContext } from "../context/PetTrackContext";

export function EmergencyNow({ petId }: { petId: number }) {
  const { getLostDogArea } = PetTrackerContext();
  const [address, setAddress] = useState("");
  const [lostInfo, setLostInfo] = useState<any | null>(null);

  const handleSearch = async () => {
    if (!address.trim()) return;
    const data = await getLostDogArea(petId, address);
    if (data) {
      setLostInfo(data);

      // cargar Google Maps script si no existe
      if (!document.querySelector('[src*="maps.googleapis.com"]')) {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${
          import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_KEY
        }`;
        script.async = true;
        script.onload = () => initMap(data);
        document.body.appendChild(script);
      } else {
        initMap(data);
      }
    }
  };

  const initMap = (data: any) => {
    const { lat, lng, radius } = data;

    const map = new google.maps.Map(
      document.getElementById("map") as HTMLElement,
      {
        zoom: 13,
        center: { lat, lng },
      }
    );

    new google.maps.Marker({
      position: { lat, lng },
      map,
      title: data.pet_name,
    });

    new google.maps.Circle({
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.15,
      map,
      center: { lat, lng },
      radius,
    });
  };

  return (
    <div>
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Ingresa la dirección donde se perdió"
          className="px-3 py-2 border rounded w-full"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-teal-600 text-white rounded"
        >
          Buscar
        </button>
      </div>

      <div id="map" style={{ width: "100%", height: "400px" }} />

      {lostInfo && (
        <div className="mt-3 text-sm text-gray-200">
          <p>
            <strong>Mascota:</strong> {lostInfo.pet_name}
          </p>
          <p>
            <strong>Dirección usada:</strong> {lostInfo.address_used}
          </p>
          <p>
            <strong>Radio estimado:</strong> {lostInfo.max_distance_km} km
          </p>
        </div>
      )}
    </div>
  );
}
