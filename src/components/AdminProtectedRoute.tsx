"use client";

import { useStore } from "@/context/StoreContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const { currentUser, isAuthLoading } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthLoading) {
      if (!currentUser) {
        router.replace("/login");
      } else if (currentUser.role !== "super_admin") {
        router.replace("/"); // Normal employee → homepage pe bhejo
      }
    }
  }, [currentUser, isAuthLoading, router]);

  // Loading state
  if (isAuthLoading || !currentUser) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#0f172a",
        gap: "1.5rem"
      }}>
        <div style={{
          width: "50px", height: "50px",
          border: "3px solid rgba(255,255,255,0.1)",
          borderTopColor: "#00593b",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite"
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Access Denied for non-admins
  if (currentUser.role !== "super_admin") {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#0f172a",
        gap: "1.5rem",
        textAlign: "center",
        padding: "2rem"
      }}>
        <div style={{
          width: "100px", height: "100px",
          background: "rgba(239,68,68,0.1)",
          border: "1px solid rgba(239,68,68,0.3)",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "1rem"
        }}>
          <i className="bx bx-lock" style={{ fontSize: "3rem", color: "#ef4444" }} />
        </div>
        <h1 style={{
          color: "white",
          fontSize: "2.5rem",
          fontFamily: "var(--font-heading)",
          fontWeight: "800"
        }}>
          Access Denied
        </h1>
        <p style={{
          color: "rgba(255,255,255,0.5)",
          fontSize: "1.1rem",
          maxWidth: "400px",
          lineHeight: "1.6"
        }}>
          You don't have permission to access the Admin Dashboard.
          <br />Only Super Admins can view this page.
        </p>
        <Link href="/" className="btn btn-glow" style={{ marginTop: "1rem", padding: "0.8rem 2rem" }}>
          <i className="bx bx-home" /> Return to Shop
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
