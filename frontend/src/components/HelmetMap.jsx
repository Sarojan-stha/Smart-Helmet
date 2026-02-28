import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { useState } from "react";
import { useEffect } from "react";

const containerStyle = {
  width: "100%",
  height: "500px",
};

const fixedPosition = {
  lat: 27.71929999999,
  lng: 85.324,
};
function HelmetMap({ helmetData: { lat, lng } }) {
  // useEffect(() => {
  //   // Listen for welcome message from backend
  //   socket.on("welcome", (data) => {
  //     console.log(data);
  //     setMessage(data.message);
  //   });

  //   socket.on("helmetData", (data) => {
  //     console.log("helmet data", data);
  //     setHelmetData(data);
  //   });

  //   // Cleanup
  //   return () => {
  //     socket.off("welcome");
  //     socket.off("helmet data");
  //   };
  // }, []);
  const [position, setPosition] = useState({ lat, lng });

  useEffect(() => {
    setPosition({ lat, lng });
  }, [lat, lng]);

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={fixedPosition}
        zoom={15}
      >
        <Marker position={position} />
      </GoogleMap>
    </LoadScript>
  );
}

export default HelmetMap;
