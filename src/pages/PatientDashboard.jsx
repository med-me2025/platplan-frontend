// PatientDashboard.jsx

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ChatThread from "../components/ChatThread";
const BASE = "https://medme-new.onrender.com/api";


export default function PatientDashboard() {
  const [form, setForm] = useState({
    medicine: "",
    quantity: 1,
    repeats: 0,
    delivery: "pickup",
  });
  const [scripts, setScripts] = useState([]);
  const [chatScriptId, setChatScriptId] = useState(null);
  const user = JSON.parse(localStorage.getItem("plat_user") || "{}");

  const fetchScripts = async () => {
    const res = await fetch(`${BASE}/prescriptions?userId=${user.contact}`);
    const data = await res.json();
    setScripts(data);
  };
// eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchScripts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${BASE}/prescriptions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, userId: user.contact }),
    });
    const newScript = await res.json();
    setScripts([newScript, ...scripts]);
    toast.success("Prescription submitted");
    setForm({ medicine: "", quantity: 1, repeats: 0, delivery: "pickup" });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-xl font-bold mb-4">Submit a Prescription</h2>
        <form onSubmit={handleSubmit} className="space-y-3 bg-white p-4 rounded shadow">
          <input
            name="medicine"
            value={form.medicine}
            onChange={handleChange}
            placeholder="Medicine"
            className="w-full p-2 border rounded"
            required
          />
          <input
            name="quantity"
            type="number"
            value={form.quantity}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            min={1}
            required
          />
          <input
            name="repeats"
            type="number"
            value={form.repeats}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <select
            name="delivery"
            value={form.delivery}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="pickup">Pickup</option>
            <option value="delivery">Delivery</option>
          </select>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </form>

        <h3 className="text-lg font-semibold mt-6 mb-2">Your Prescriptions</h3>
        <ul className="space-y-2">
          {scripts.map((s) => (
            <li key={s.id} className="p-3 bg-white shadow rounded">
              <p><strong>{s.medicine}</strong> — Qty: {s.quantity}</p>
              <p className="text-sm text-gray-600">Repeats: {s.repeats}, Delivery: {s.delivery}</p>
              <p className="text-sm text-gray-500">Status: {s.status}</p>
              <button
               onClick={() => setChatScriptId(s.id)}
                className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Chat
              </button>
            </li>
            
          ))}
        </ul>
      </div>
      {chatScriptId && (
    <ChatThread
    scriptId={chatScriptId}
    sender="patient"
    onClose={() => setChatScriptId(null)}
    />
    )}
    </div>
  );
}
