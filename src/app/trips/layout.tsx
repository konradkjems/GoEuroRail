import { Analytics } from "@vercel/analytics/react";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/context/AuthContext";

export default function TripsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="w-full h-screen">
      {children}
    </main>
  );
} 