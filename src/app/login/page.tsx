"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useStore } from "@/context/StoreContext";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#0f172a' }} />}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const { login, currentUser } = useStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Slider state
  const slides = ['/slide3.jpg', '/slide4.jpg'];
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slide every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // If already logged in, redirect
  useEffect(() => {
    if (currentUser) {
      const redirect = searchParams.get('redirect') || '/';
      router.replace(redirect);
    }
  }, [currentUser, router, searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return setError("Please enter email and password.");
    setIsLoading(true);
    setError("");
    try {
      const success = await login(email.trim(), password.trim());
      if (success) {
        const redirect = searchParams.get('redirect') || '/';
        router.push(redirect);
      } else {
        setError("Invalid email or password. Please try again.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container" style={{
      minHeight: "100vh",
      display: "flex",
      position: "relative",
      overflowX: "hidden",
      overflowY: "auto"
    }}>
      {/* ===== BACKGROUND IMAGE SLIDER ===== */}
      <div style={{
        position: "fixed",
        inset: 0,
        zIndex: 0
      }}>
        {slides.map((slide, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url('${slide}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: index === currentSlide ? 1 : 0,
              transition: "opacity 1.5s ease-in-out",
              transform: index === currentSlide ? "scale(1.05)" : "scale(1)",
              transitionProperty: "opacity, transform",
              transitionDuration: "1.5s, 8s",
              transitionTimingFunction: "ease-in-out, linear"
            }}
          />
        ))}
        {/* Dark overlay */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to right, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.30) 100%)"
        }} />
      </div>

      {/* ===== SLIDE DOTS ===== */}
      <div className="login-dots" style={{
        position: "absolute",
        bottom: "2rem",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        gap: "0.6rem",
        zIndex: 10
      }}>
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            style={{
              width: i === currentSlide ? "28px" : "8px",
              height: "8px",
              borderRadius: "50px",
              background: i === currentSlide ? "#00593b" : "rgba(255,255,255,0.4)",
              border: "none",
              cursor: "pointer",
              padding: 0,
              transition: "all 0.4s ease"
            }}
          />
        ))}
      </div>

      {/* ===== LEFT SIDE — Branding ===== */}
      {/* Mobile Top Logo */}
      <div className="mobile-logo-top" style={{ 
        display: 'none', 
        justifyContent: 'center', 
        padding: '2rem 0',
        position: 'relative',
        zIndex: 10
      }}>
        <img src="/logo.png" alt="Airsystems1" style={{ height: "80px", objectFit: "contain" }} />
      </div>

      <div className="login-left" style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "4rem",
        position: "relative",
        zIndex: 1
      }}>
        <div className="desktop-logo">
          <Link href="/">
            <img src="/logo.png" alt="Airsystems1" className="login-logo" style={{ height: "100px", objectFit: "contain", marginBottom: "3rem" }} />
          </Link>
        </div>

        <div className="portal-badge" style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          background: "rgba(0,89,59,0.4)",
          border: "1px solid rgba(0,89,59,0.6)",
          borderRadius: "50px",
          padding: "0.4rem 1rem",
          marginBottom: "1.5rem",
          width: "fit-content"
        }}>
          <i className="bx bx-shield-quarter" style={{ color: "#a7f3d0", fontSize: "1rem" }} />
          <span style={{ color: "#a7f3d0", fontSize: "0.78rem", fontWeight: "800", letterSpacing: "2px", textTransform: "uppercase" }}>
            Employee Only Portal
          </span>
        </div>

        <h1 style={{
          color: "white",
          fontSize: "3.5rem",
          fontFamily: "var(--font-heading)",
          fontWeight: "900",
          lineHeight: "1.1",
          marginBottom: "1.5rem",
          textTransform: "uppercase",
          letterSpacing: "-1px"
        }}>
          Your Gear.<br />
          <span>Your Credits.</span>
        </h1>

        <p style={{
          color: "rgba(255,255,255,0.6)",
          fontSize: "1.1rem",
          lineHeight: "1.7",
          maxWidth: "420px"
        }}>
          Access your exclusive Airsystems1 employee store. Use your allocated Airsystems Credits to order premium workwear delivered straight to your site.
        </p>

        {/* Feature pills */}
        <div className="feature-pills" style={{ display: "flex", gap: "1rem", marginTop: "2.5rem", flexWrap: "wrap" }}>
          {["No Credit Card", "Free Delivery", "Site Drop-off"].map(tag => (
            <div key={tag} style={{
              display: "flex", alignItems: "center", gap: "0.4rem",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "50px",
              padding: "0.4rem 1rem",
              color: "rgba(255,255,255,0.8)",
              fontSize: "0.85rem",
              fontWeight: "600"
            }}>
              <i className="bx bx-check-circle" style={{ color: "#10b981" }} />
              {tag}
            </div>
          ))}
        </div>
      </div>

      {/* ===== RIGHT SIDE — Login Form ===== */}
      <div className="login-right" style={{
        width: "480px",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "3rem 2.5rem",
        position: "relative",
        zIndex: 1,
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(30px)",
        WebkitBackdropFilter: "blur(30px)",
        borderLeft: "1px solid rgba(255,255,255,0.08)"
      }}>
        <div style={{ width: "100%", maxWidth: "380px" }}>
          <h2 style={{
            color: "white",
            fontSize: "2rem",
            fontFamily: "var(--font-heading)",
            fontWeight: "800",
            marginBottom: "0.5rem"
          }}>
            Welcome Back
          </h2>
          <p style={{ color: "rgba(255,255,255,0.45)", marginBottom: "2.5rem", fontSize: "0.95rem" }}>
            Sign in to access your account
          </p>

          {/* Error Message */}
          {error && (
            <div style={{
              background: "rgba(239,68,68,0.12)",
              border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: "10px",
              padding: "1rem",
              marginBottom: "1.5rem",
              color: "#a7f3d0",
              fontSize: "0.9rem",
              display: "flex",
              alignItems: "center",
              gap: "0.6rem"
            }}>
              <i className="bx bx-error-circle" style={{ fontSize: "1.2rem", flexShrink: 0 }} />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
            {/* Email */}
            <div>
              <label style={{
                display: "block", color: "rgba(255,255,255,0.6)",
                fontSize: "0.82rem", fontWeight: "700",
                marginBottom: "0.6rem", letterSpacing: "0.5px", textTransform: "uppercase"
              }}>
                Employee Email
              </label>
              <div style={{ position: "relative" }}>
                <i className="bx bx-envelope" style={{
                  position: "absolute", left: "1rem", top: "50%",
                  transform: "translateY(-50%)", color: "#94a3b8",
                  fontSize: "1.1rem", pointerEvents: "none"
                }} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="yourname@airsystems1.com"
                  autoComplete="email"
                  style={{
                    width: "100%", padding: "0.9rem 1rem 0.9rem 2.8rem",
                    background: "#ffffff",
                    border: "1px solid rgba(255,255,255,0.3)",
                    borderRadius: "10px", color: "#0f172a",
                    fontSize: "0.95rem", outline: "none",
                    transition: "border-color 0.3s, box-shadow 0.3s",
                    boxSizing: "border-box"
                  }}
                  onFocus={e => { e.target.style.borderColor = "#00593b"; e.target.style.boxShadow = "0 0 0 3px rgba(0,89,59,0.15)"; }}
                  onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.3)"; e.target.style.boxShadow = "none"; }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{
                display: "block", color: "rgba(255,255,255,0.6)",
                fontSize: "0.82rem", fontWeight: "700",
                marginBottom: "0.6rem", letterSpacing: "0.5px", textTransform: "uppercase"
              }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <i className="bx bx-lock-alt" style={{
                  position: "absolute", left: "1rem", top: "50%",
                  transform: "translateY(-50%)", color: "#94a3b8",
                  fontSize: "1.1rem", pointerEvents: "none"
                }} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  style={{
                    width: "100%", padding: "0.9rem 3rem 0.9rem 2.8rem",
                    background: "#ffffff",
                    border: "1px solid rgba(255,255,255,0.3)",
                    borderRadius: "10px", color: "#0f172a",
                    fontSize: "0.95rem", outline: "none",
                    transition: "border-color 0.3s, box-shadow 0.3s",
                    boxSizing: "border-box"
                  }}
                  onFocus={e => { e.target.style.borderColor = "#00593b"; e.target.style.boxShadow = "0 0 0 3px rgba(0,89,59,0.15)"; }}
                  onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.3)"; e.target.style.boxShadow = "none"; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute", right: "0.9rem", top: "50%",
                    transform: "translateY(-50%)", background: "none",
                    border: "none", color: "#94a3b8",
                    cursor: "pointer", fontSize: "1.1rem", padding: 0,
                    display: "flex", alignItems: "center"
                  }}
                >
                  <i className={`bx ${showPassword ? "bx-hide" : "bx-show"}`} />
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: "100%", padding: "1rem",
                background: isLoading
                  ? "rgba(0,89,59,0.5)"
                  : "linear-gradient(135deg, #00593b 0%, #00a86b 100%)",
                border: "none", borderRadius: "10px", color: "white",
                fontSize: "0.95rem", fontWeight: "800",
                letterSpacing: "1.5px", textTransform: "uppercase",
                cursor: isLoading ? "not-allowed" : "pointer",
                transition: "all 0.3s",
                marginTop: "0.5rem",
                boxShadow: isLoading ? "none" : "0 8px 25px rgba(0,89,59,0.45)",
                display: "flex", alignItems: "center",
                justifyContent: "center", gap: "0.8rem"
              }}
            >
              {isLoading ? (
                <>
                  <div style={{
                    width: "16px", height: "16px",
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTopColor: "white", borderRadius: "50%",
                    animation: "spin 0.8s linear infinite"
                  }} />
                  Signing In...
                </>
              ) : (
                <>Sign In <i className="bx bx-log-in-circle" style={{ fontSize: "1.1rem" }} /></>
              )}
            </button>
          </form>

          <div style={{
            marginTop: "2.5rem",
            padding: "1rem",
            background: "rgba(255,255,255,0.04)",
            borderRadius: "10px",
            border: "1px solid rgba(255,255,255,0.08)",
            textAlign: "center"
          }}>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.8rem", lineHeight: "1.6" }}>
              🔒 Access restricted to SRF employees only.<br />
              Contact your admin if you need access.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder { color: #94a3b8 !important; }
        input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 30px #ffffff inset !important;
          -webkit-text-fill-color: #0f172a !important;
        }
        @media (max-width: 992px) {
          .login-container { 
            flex-direction: column !important; 
            height: auto !important; 
            min-height: 100vh !important;
            overflow-y: visible !important; 
          }
          .mobile-logo-top { display: flex !important; }
          .desktop-logo { display: none !important; }
          .login-left { 
            padding: 1rem 2rem 3rem !important; 
            flex: none !important; 
            width: 100% !important; 
            text-align: center !important; 
            min-height: auto !important;
            order: 1 !important; /* Content under logo */
          }
          .login-left h1 { font-size: 2.6rem !important; margin-bottom: 1.5rem !important; }
          .login-left p { margin-left: auto !important; margin-right: auto !important; font-size: 1.05rem !important; margin-bottom: 1rem !important; }
          .login-left .feature-pills { display: none !important; }
          .portal-badge { margin: 0 auto 1.5rem !important; }
          
          .login-right { 
            width: 100% !important; 
            border-left: none !important; 
            border-top: 1px solid rgba(255,255,255,0.1) !important; 
            padding: 2rem 1.5rem 3rem !important; 
            background: rgba(255, 255, 255, 0.04) !important; 
            backdrop-filter: blur(30px) !important;
            order: 2 !important; /* Form at the bottom */
          }
          .login-dots { bottom: 1rem !important; }
        }
        @media (max-width: 768px) {
          .login-left h1 { font-size: 2.2rem !important; }
          .mobile-logo-top img { height: 90px !important; }
          .login-right h2 { font-size: 1.6rem !important; }
          .login-right { padding: 2rem 1.2rem 3rem !important; }
          .login-dots { display: none !important; }
          .portal-badge { margin: 0 auto 1.5rem !important; }
        }
      `}</style>
    </div>
  );
}
