import React, { useState, useRef, useEffect } from "react";
import Login from "./Login";
import AMPForm from "./AMPForm";
import * as XLSX from "xlsx";
import iconImage from "./comcast_logo_icon_170338.png"; // icon path

export default function App() {
  const [user, setUser] = useState(null);
  const [visibleForm, setVisibleForm] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [savedAMP, setSavedAMP] = useState([]);
  const [position, setPosition] = useState({
    x: window.innerWidth - 150,
    y: window.innerHeight - 150,
  });

  const dragInfo = useRef({ isDragging: false, offsetX: 0, offsetY: 0 });
  const ampFormRef = useRef();

  const handleMouseDown = (e) => {
    dragInfo.current = {
      isDragging: true,
      offsetX: e.clientX - position.x,
      offsetY: e.clientY - position.y,
    };
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!dragInfo.current.isDragging) return;
    let newX = e.clientX - dragInfo.current.offsetX;
    let newY = e.clientY - dragInfo.current.offsetY;
    newX = Math.min(Math.max(0, newX), window.innerWidth - 160);
    newY = Math.min(Math.max(0, newY), window.innerHeight - 100);
    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    dragInfo.current.isDragging = false;
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  useEffect(() => {
    let interval;
    if (startTime && !isPaused) {
      interval = setInterval(() => {
        setElapsed(Date.now() - startTime);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [startTime, isPaused]);

  const formatTime = (ms) => {
    const sec = Math.floor(ms / 1000);
    const h = String(Math.floor(sec / 3600)).padStart(2, "0");
    const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const resetTimer = () => {
    setElapsed(0);
    setStartTime(null);
    setIsPaused(false);
  };

  const formatTimeOnly = (date) => {
    if (!(date instanceof Date)) return "";
    return date.toLocaleTimeString("en-GB", { hour12: false });
  };

  const getShiftDate = (startDate) => {
    const hour = startDate.getHours();
    const date = new Date(startDate);
    if (hour < 7) {
      date.setDate(date.getDate() - 1);
    }
    return date.toISOString().slice(0, 10);
  };

  const exportAMP = () => {
    if (savedAMP.length === 0) return alert("No AMP-OE data to export.");
    const worksheetData = savedAMP.map((entry) => {
      const shiftDate = getShiftDate(entry.startDate);
      const month = shiftDate.slice(5, 7);

      return {
        Date: shiftDate,
        Month: month,
        Name: entry.Name || "",
        "AMP Order#": entry["AMP Order#"] || "",
        "Customer Name": entry["Customer Name"] || "",
        "TIM#": entry["TIM#"] || "",
        "TAT miss": entry["TAT miss"] || "",
        "Opportunity Status": entry["Opportunity Status"] || "",
        Market: entry.Market || "",
        "Order Type": entry["Order Type"] || "",
        "$0": entry["$0"] || "",
        "SET lines": entry["SET lines"] || "",
        Phase: entry.Phase || "",
        "Start Time": formatTimeOnly(entry.startDate),
        "End Time": formatTimeOnly(entry.endDate),
        "Total Duration": entry.Duration || "",
      };
    });

    const ws = XLSX.utils.json_to_sheet(worksheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "AMP-OE");
    XLSX.writeFile(wb, "AMP-OE-data.xlsx");
  };

  if (!user) return <Login onLogin={setUser} />;

  return (
    <>
      <div
        style={{
          position: "fixed",
          left: position.x,
          top: position.y,
          width: 180,
          backgroundColor: "#fff",
          borderRadius: 12,
          boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
          padding: 10,
          userSelect: "none",
          zIndex: 1000,
          cursor: dragInfo.current.isDragging ? "grabbing" : "grab",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
        }}
        onMouseDown={handleMouseDown}
      >
        <img
          src={iconImage}
          alt="Widget Icon"
          style={{ width: 40, height: 40, pointerEvents: "none" }}
          draggable={false}
        />
        <div style={{ fontWeight: "600", fontSize: 14 }}>
          ⏱️ {formatTime(elapsed)}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setVisibleForm((prev) => (prev === "AMP-OE" ? null : "AMP-OE"));
          }}
          style={{
            width: "100%",
            padding: "6px 0",
            borderRadius: 6,
            border: "none",
            backgroundColor: visibleForm === "AMP-OE" ? "#2563eb" : "#e0e7ff",
            color: visibleForm === "AMP-OE" ? "white" : "black",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          AMP-OE
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setVisibleForm((prev) => (prev === "Button2" ? null : "Button2"));
          }}
          style={{
            width: "100%",
            padding: "6px 0",
            borderRadius: 6,
            border: "none",
            backgroundColor: visibleForm === "Button2" ? "#16a34a" : "#bbf7d0",
            color: visibleForm === "Button2" ? "white" : "black",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Button2
        </button>
      </div>

      {visibleForm === "AMP-OE" && (
        <div
          style={{
            position: "fixed",
            top: position.y + 110,
            left: position.x,
            width: 380,
            backgroundColor: "white",
            borderRadius: 12,
            boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
            padding: 20,
            zIndex: 999,
          }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="mb-2 font-semibold flex items-center gap-2">
            ⏱️ Timer: {formatTime(elapsed)}
          </div>
          <div className="flex gap-2 mb-2">
            <button
              onClick={() => setStartTime(Date.now())}
              className="bg-green-600 text-white px-2 py-1 rounded"
            >
              Start
            </button>
            <button
              onClick={() => setIsPaused(true)}
              className="bg-yellow-500 text-white px-2 py-1 rounded"
            >
              Pause
            </button>
            <button
              onClick={() => setIsPaused(false)}
              className="bg-blue-500 text-white px-2 py-1 rounded"
            >
              Resume
            </button>
            <button
              onClick={() => {
                if (ampFormRef.current) {
                  ampFormRef.current.triggerSubmit();
                }
                resetTimer();
              }}
              className="bg-red-600 text-white px-2 py-1 rounded"
            >
              Stop
            </button>
          </div>

          <AMPForm
            ref={ampFormRef}
            user={user}
            onSave={(entry) => {
              const now = new Date();
              const startDate = entry.startDate || new Date(startTime || now);
              const endDate = new Date(startDate.getTime() + elapsed);
              const fullEntry = {
                ...entry,
                startDate,
                endDate,
                Duration: formatTime(elapsed),
              };
              setSavedAMP((prev) => [...prev, fullEntry]);
              resetTimer();
            }}
          />
          <button
            onClick={exportAMP}
            className="mt-2 bg-purple-700 text-white py-2 px-4 rounded w-full"
          >
            Export AMP-OE Excel
          </button>
        </div>
      )}

      {visibleForm === "Button2" && (
        <div
          style={{
            position: "fixed",
            top: position.y + 110,
            left: position.x,
            width: 380,
            backgroundColor: "white",
            borderRadius: 12,
            boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
            padding: 20,
            zIndex: 999,
          }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="text-sm text-gray-500 italic">Button2 form coming soon...</div>
        </div>
      )}
    </>
  );
}
