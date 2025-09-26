import { useEffect, useState } from "react";
import { PetTrackerContext } from "../context/PetTrackContext";

export function EmergencyNow({
  petId,
  weeklyActivity,
  t,
}: {
  petId: number;
  weeklyActivity: any;
  t: any;
}) {
  const { getLostDogArea, getLastLostDogEvent } = PetTrackerContext();
  const [address, setAddress] = useState("");
  const [lostInfo, setLostInfo] = useState<any | null>(null);

  const fetchLastEvent = async () => {
    const lastEvent = await getLastLostDogEvent(petId);
    if (lastEvent) {
      setLostInfo(lastEvent);

      if (!document.querySelector('[src*="maps.googleapis.com"]')) {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${
          import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_KEY
        }&libraries=geometry`;
        script.async = true;
        script.onload = () => initMap(lastEvent);
        document.body.appendChild(script);
      } else {
        initMap(lastEvent);
      }
    }
  };
  useEffect(() => {
    fetchLastEvent();
  }, [petId]);

  const handleSearch = async () => {
    if (!address.trim()) return;
    const data = await getLostDogArea(petId, address);
    if (data) {
      setLostInfo(data.event);
      await getLastLostDogEvent(petId);

      if (!document.querySelector('[src*="maps.googleapis.com"]')) {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${
          import.meta.env.VITE_REACT_APP_GOOGLE_MAPS_KEY
        }`;
        script.async = true;
        script.onload = () => initMap(data.event);
        document.body.appendChild(script);
      } else {
        initMap(data);
      }
    }
  };

  // const createColoredCircle = (map: any, center: any, radius: number) => {
  // esto no sirve
  //   const colors = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00"]; // rojo, verde, azul, amarillo

  //   // 4 cuadrantes de 90°
  //   for (let i = 0; i < 4; i++) {
  //     const startAngle = i * 90;
  //     const endAngle = (i + 1) * 90;

  //     const path = [center];

  //     // ir creando puntos del arco desde startAngle hasta endAngle
  //     for (let angle = startAngle; angle <= endAngle; angle += 10) {
  //       const point = google.maps.geometry.spherical.computeOffset(
  //         center,
  //         radius,
  //         angle
  //       );
  //       path.push(point);
  //     }

  //     // cerrar con el centro
  //     path.push(center);

  //     // dibujar el polígono
  //     new google.maps.Polygon({
  //       paths: path,
  //       strokeColor: colors[i],
  //       strokeOpacity: 0.8,
  //       strokeWeight: 2,
  //       fillColor: colors[i],
  //       fillOpacity: 0.35,
  //       map,
  //     });
  //   }
  // };

  const initMap = (data: any) => {
    const event = data.event ? data.event : data;

    const { lat, lng, radius } = event;

    // const { lat, lng, radius } = data;
    const map = new google.maps.Map(
      document.getElementById("map") as HTMLElement,
      {
        zoom: 10,
        center: { lat, lng },
      }
    );

    new google.maps.Marker({
      position: { lat, lng },
      map,
      title: event.pet_name,
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

    const north = google.maps.geometry.spherical.computeOffset(
      { lat, lng },
      radius,
      0
    );
    const south = google.maps.geometry.spherical.computeOffset(
      { lat, lng },
      radius,
      180
    );
    const east = google.maps.geometry.spherical.computeOffset(
      { lat, lng },
      radius,
      90
    );
    const west = google.maps.geometry.spherical.computeOffset(
      { lat, lng },
      radius,
      270
    );

    // línea N-S
    new google.maps.Polyline({
      path: [north, south],
      geodesic: true,
      strokeColor: "#00FF00", // verde
      strokeOpacity: 1.0,
      strokeWeight: 2,
      map,
    });

    // línea E-O
    new google.maps.Polyline({
      path: [east, west],
      geodesic: true,
      strokeColor: "#0000FF", // azul
      strokeOpacity: 1.0,
      strokeWeight: 2,
      map,
    });
    // createColoredCircle(map, { lat, lng }, radius); // esto no sirve
  };

  return (
    <div>
      <div className="flex gap-2 mb-3 mt-3">
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
          {t("emergency_tracker.actions.search")}
        </button>
      </div>

      {lostInfo && (
        <div
          id="map"
          style={{
            width: "100%",
            height: lostInfo ? "400px" : "none",
          }}
        />
      )}

      {lostInfo && (
        <div className="mt-3 text-sm text-gray-200">
          <p>
            <strong>{t("emergency_tracker.small.pet")}:</strong>{" "}
            {lostInfo.pet_name}
          </p>
          <p>
            <strong>{t("emergency_tracker.small.addr")}:</strong>{" "}
            {lostInfo.address_used}
          </p>
          <p>
            <strong>{t("emergency_tracker.small.radio")}:</strong>{" "}
            {lostInfo.max_distance_km} km
          </p>
        </div>
      )}
    </div>
  );
}
