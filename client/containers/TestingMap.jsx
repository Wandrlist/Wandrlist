// require("dotenv").config();
import React, { useState, useRef, useCallback } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";
import Geocode from "react-geocode";

const apiKey = "AIzaSyAFJmCtle - yWm4y0f2R2mURCuE3z_IoWb4";
const mapApiJs = "https://maps.googleapis.com/maps/api/js";

const libraries = ["places"];

const center = {
  lat: 37.7749,
  lng: -122.4194,
};

export default function TestingMap() {
  const [markers, setMarkers] = useState([]); //array of marker coordinates
  const [autocomplete, setAutocomplete] = useState(null); //reference to the Autocomplete component
  const [inputValue, setInputValue] = useState(""); //value of the input field in the search bar
  const [userInputs, setUserInputs] = useState([]); //array of user-entered place names
  const inputRef = useRef(null); //ref to access the input field in the search bar

  //loads map
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries,
    mapIds: ["map"],
  });

  //called when user selects place from autocomplete search bar
  const handlePlaceSelect = useCallback(() => {
    const addressObject = autocomplete.getPlace();
    if (!addressObject) {
      return;
    }
    const { formatted_address, geometry } = addressObject;
    if (geometry) {
      //add marker
      setMarkers((currentMarkers) => [
        ...currentMarkers,
        { lat: geometry.location.lat(), lng: geometry.location.lng() },
      ]);
    }
    //add place name to userInputs state variable
    setUserInputs((prevUserInputs) => [...prevUserInputs, formatted_address]);
    setInputValue("");
  }, [autocomplete]);

  //called when user submits search form instead of clicking from the autocomplete dropdown
  const handleFormSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const searchPlace = inputValue.trim(); //.trim removes whitespace characters before and after to sanitize user input
      if (searchPlace.length === 0) {
        return;
      }

      //creates a new instance of the PlacesService object from the Google Maps JavaScript API, which provides methods for searching and retrieving information about places
      //PlacesService object is used to interact with the Google Places API, which allows developers to search for and retrieve information about places, including their names, addresses, locations, and other details
      const service = new window.google.maps.places.PlacesService(
        document.createElement("div")
      );
      service.textSearch({ query: searchPlace }, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          setMarkers((currentMarkers) => [
            ...currentMarkers,
            {
              lat: results[0].geometry.location.lat(),
              lng: results[0].geometry.location.lng(),
            },
          ]);
          setUserInputs((prevUserInputs) => [...prevUserInputs, searchPlace]);
          setInputValue("");
          inputRef.current.blur();
        }
      });
    },
    [inputValue]
  );

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading Maps...";

  return (
    <div className="itineraryPageContainer">
      <div>
        <GoogleMap
          id="map"
          mapContainerClassName="mapContainer"
          zoom={8}
          center={center}
          onLoad={(map) => {
            map.setOptions({ minZoom: 2, maxZoom: 20 });
          }}
        >
          {markers.map((marker, index) => (
            <Marker
              key={index}
              position={{ lat: marker.lat, lng: marker.lng }}
            />
          ))}
        </GoogleMap>
        <div>
          <form onSubmit={handleFormSubmit}>
            <Autocomplete
              onLoad={(autocomplete) => setAutocomplete(autocomplete)}
              onPlaceChanged={handlePlaceSelect}
            >
              <input
                type="text"
                placeholder="Search for a place"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                ref={inputRef}
              />
            </Autocomplete>
            <button type="submit">Search</button>
          </form>
        </div>
      </div>

      <div className="activitiesColumn">
        <h1>My Activities</h1>
        <div>
          {userInputs.map((input, index) => (
            <div key={index}>{input}</div>
          ))}
        </div>
      </div>

      <div className="itineraryContainer">
        <h1>My Itinerary</h1>
        <div className="itineraryColumns"></div>
      </div>
    </div>
  );
}
