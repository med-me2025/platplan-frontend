// ChatThread.jsx
import React, { useEffect, useState, useRef } from "react";

const BASE = "https://medme-new.onrender.com/api";

export default function ChatThread({ scriptId, sender, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    fetch(`${BASE}/messages/${scriptId}`)
      .then((res) => res.json())
      .then(setMessages);
  }, [scriptId]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const res = await fetch(`${BASE}/messages/${scriptId}/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sender, text: input }),
    });

    const msg = await res.json();
    setMessages((prev) => [...prev, msg]);
    setInput("");

    setTimeout(() => {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded shadow w-full max-w-md">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-bold">Chat – Script #{scriptId}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-black">✖</button>
        </div>
        <div className="h-64 overflow-y-auto border p-2 bg-gray-50 mb-3 rounded">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`my-1 ${msg.sender === sender ? "text-right" : "text-left"}`}
            >
              <div className={`inline-block px-3 py-1 rounded-lg ${msg.sender === sender ? "bg-blue-200" : "bg-gray-200"}`}>
                <p>{msg.text}</p>
                <p className="text-xs text-gray-500">{new Date(msg.timestamp).toLocaleTimeString()}</p>
              </div>
            </div>
          ))}
          <div ref={scrollRef}></div>
        </div>
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 border p-2 rounded"
            placeholder="Type message..."
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
