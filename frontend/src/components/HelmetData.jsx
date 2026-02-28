import React from "react";

const HelmetData = ({ helmetData }) => {
  return (
    <div>
      <h1>Smart Helmet Dashboard</h1>
      <div>
        <h2>Live Helmet Data:</h2>
        <p>Speed: {helmetData.speed} km/h</p>
        <p>Acceleration: {helmetData.acceleration}</p>
        <p>Alert: {helmetData.alert ? "Yes" : "No"}</p>
        <p>lat: {helmetData.lat}</p>
        <p>lng: {helmetData.lng} </p>
      </div>
    </div>
  );
};

export default HelmetData;
