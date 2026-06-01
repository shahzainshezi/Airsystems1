"use client";

import { useStore } from "@/context/StoreContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { currentUser, isAuthLoading } = useStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthLoading) {
      if (!currentUser) {
        router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      } else if (currentUser.role === 'super_admin' && !pathname.startsWith('/admin')) {
        router.replace('/admin');
      }
    }
  }, [currentUser, isAuthLoading, router, pathname]);

  // Show loading spinner while checking auth
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
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.95rem", letterSpacing: "1px" }}>
          Verifying access...
        </p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return <>{children}</>;
}
