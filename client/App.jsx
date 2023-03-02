import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";
import ItineraryPage from "./containers/ItineraryPage.jsx";
import WelcomePage from "./containers/WelcomePage.jsx";
import TestingMap from "./containers/TestingMap.jsx";

function App() {
  return (
    <Routes>
      <Route exact path="/" element={<Login />} />
      <Route exact path="/signup" element={<Signup />} />
      <Route exact path="/welcome" element={<WelcomePage />} />
      <Route path="/itinerary" element={<TestingMap />} />
    </Routes>
  );
}

export default App;
