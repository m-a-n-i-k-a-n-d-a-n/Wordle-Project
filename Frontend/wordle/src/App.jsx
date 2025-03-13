import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import SearchPage from "./pages/SearchPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage"; // Import RegisterPage

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const NAVBAR_ITEMS = [
    { icon: "🏠", text: "", component: <HomePage /> },
    { icon: "📊", text: "", component: <AboutPage /> },
    { icon: "🔍", text: "", component: <SearchPage /> },
    { icon: "👱🏿‍♂️", text: "", component: <ProfilePage /> },
    { icon: "🎮", text: "", component: <SettingsPage /> },
  ];

  return (
    <Router>
      <div className="app">
        {isAuthenticated && <NavBar ITEMS={NAVBAR_ITEMS} />}
        <div className="main-container">
        <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/home" /> : <LoginPage setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/register" element={isAuthenticated ? <Navigate to="/home" /> : <RegisterPage />} /> 
          <Route path="/home" element={isAuthenticated ? <HomePage /> : <Navigate to="/" />} />
        x</Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
