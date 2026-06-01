"use client";

import { useEffect, useState } from "react";

export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Thori der ke liye dikhayein takay premium feel aaye
    const timer = setTimeout(() => {
      setFading(true);
      setTimeout(() => {
        setLoading(false);
      }, 500); // Fade out animation time
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "#0f172a", // Premium dark background
        zIndex: 99999,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        opacity: fading ? 0 : 1,
        transition: "opacity 0.5s ease-in-out",
        pointerEvents: fading ? "none" : "auto",
      }}
    >
      <div style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "3rem" }}>
        {/* Pulsing rings */}
        <div className="preloader-pulse" />
        <div className="preloader-pulse-2" />
        
        {/* Logo Image */}
        <div style={{ zIndex: 1, position: "relative" }}>
          <img 
            src="/logo.png" 
            alt="SRF Logo" 
            style={{ 
              height: "70px", 
              width: "auto", 
              filter: "drop-shadow(0 4px 20px rgba(0,0,0,0.5))" 
            }} 
          />
        </div>
      </div>
      
      {/* Loading text / dots */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem"
      }}>
        <div className="preloader-dot" style={{ animationDelay: "0s" }} />
        <div className="preloader-dot" style={{ animationDelay: "0.2s" }} />
        <div className="preloader-dot" style={{ animationDelay: "0.4s" }} />
      </div>
    </div>
  );
}
