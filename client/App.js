import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ItineraryPage from "./containers/ItineraryPage";
import WelcomePage from "./containers/WelcomePage";
import TestingMap from "./containers/TestingMap.jsx";

function App() {
  return (
    <Routes>
      <Route exact path="/" element={<Login />} />
      <Route exact path="/signup" element={<Signup />} />
      <Route exact path="/welcome" element={<WelcomePage />} />
      {/* <Route path="/itinerary" element={<ItineraryPage />} /> */}
      <Route path="/itinerary" element={<TestingMap />} />
    </Routes>
  );
}

export default App;
