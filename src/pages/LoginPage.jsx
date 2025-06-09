import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function LoginPage({ setUser }) {
  const [contact, setContact] = useState("");
  const [role, setRole] = useState("patient");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (!contact) {
      toast.error("Please enter email or phone");
      return;
    }

    const user = { contact, role };
    localStorage.setItem("plat_user", JSON.stringify(user));
    setUser(user);

    toast.success("Logged in successfully");
    navigate(`/${role}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-sky-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded shadow-lg w-full max-w-md space-y-4"
      >
        <h2 className="text-xl font-bold text-center">Login to PlatPlan</h2>

        <input
          type="text"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder="Email or phone"
          className="w-full p-2 border rounded"
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="patient">Patient</option>
          <option value="pharmacy">Pharmacy</option>
        </select>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
}