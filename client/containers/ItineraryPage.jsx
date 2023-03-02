// require("dotenv").config();
import React, { useState, useMemo } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import Geocode from "react-geocode";

const apiKey = "AIzaSyAFJmCtle - yWm4y0f2R2mURCuE3z_IoWb4";
const mapApiJs = "https://maps.googleapis.com/maps/api/js";
Geocode.setApiKey(apiKey);

export default function ItineraryPage() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries: ["places"],
  });

  if (!isLoaded) return <div>Loading...</div>;

  function Map() {
    // place the lat and lng at the destination as the center?
    const center = useMemo(() => ({ lat: 44, lng: -80 }), []);

    return (
      <GoogleMap
        zoom={10}
        center={center}
        mapContainerClassName="mapContainer"
      ></GoogleMap>
    );
  }

  function loadAsyncScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      Object.assign(script, {
        type: "text/javascript",
        async: true,
        src,
      });
      script.addEventListener("load", () => resolve(script));
      document.head.appendChild(script);
    });
  }

  return (
    <div>
      <h1>Render testing</h1>
      <Map />
    </div>
  );
}
