import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import PatientDashboard from "./pages/PatientDashboard";
import PharmacyDashboard from "./pages/PharmacyDashboard";
import { Toaster } from "react-hot-toast";

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("plat_user");
    return saved ? JSON.parse(saved) : null;
  });

  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<LoginPage setUser={setUser} />} />
        <Route
          path="/patient"
          element={user?.role === "patient" ? <PatientDashboard /> : <Navigate to="/" />}
        />
        <Route
          path="/pharmacy"
          element={user?.role === "pharmacy" ? <PharmacyDashboard /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;