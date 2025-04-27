import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: 'GoEuroRail - Plan Your European Rail Adventure',
  description: 'Plan your European rail journey with GoEuroRail. Explore train routes, schedules, and tickets for train travel across Europe.',
  icons: {
    icon: '/logo.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen font-sans flex flex-col overflow-hidden">
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
