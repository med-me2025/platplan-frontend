// PharmacyDashboard.jsx
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ChatThread from "../components/ChatThread";

const BASE = "https://medme-new.onrender.com/api";


export default function PharmacyDashboard() {
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


  const confirm = async (id) => {
    const res = await fetch(`${BASE}/prescriptions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "Confirmed" }),
    });

    const updated = await res.json();
    toast.success("Confirmed!");

    setScripts((prev) =>
      prev.map((s) => (s.id === updated.id ? updated : s))
    );
  };

  return (
    <div className="p-6 bg-sky-50 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-xl font-bold mb-4">Prescriptions to Confirm</h2>

        {scripts.length === 0 && <p>No prescriptions found.</p>}

        {scripts.map((s) => (
          <div key={s.id} className="p-4 mb-3 bg-white rounded shadow">
            <p>
              <strong>{s.medicine}</strong> — Qty: {s.quantity}
            </p>
            <p className="text-sm text-gray-600">
              Repeats: {s.repeats}, Delivery: {s.delivery}
            </p>
            <p className="text-sm text-gray-500">Status: {s.status}</p>
            {s.status !== "Confirmed" && (
              <button
                onClick={() => confirm(s.id)}
                className="mt-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Confirm
                <button
                onClick={() => setChatScriptId(s.id)}
                 className="mt-2 ml-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                 Chat
                </button>

              </button>
              
            )}
          </div>
          
        ))}
      </div>
      {chatScriptId && (
  <ChatThread
    scriptId={chatScriptId}
    sender="pharmacy"
    onClose={() => setChatScriptId(null)}
  />
)}
    </div>
  );
}
