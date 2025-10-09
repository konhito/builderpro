import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono, Montserrat } from "next/font/google";
import "./globals.css";
import AppRouteLoader from "./ui/AppRouteLoader";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/contexts/CartContext";
import AuthProvider from "@/components/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const brand = Montserrat({
  variable: "--font-brand",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BuildPro - Professional Building Supplies & Hardware",
  description: "Your trusted partner for quality screws, fasteners, tools, and building supplies. Professional-grade products for trade and construction.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://timco.co.uk" />
        <link
          rel="preload"
          as="image"
          href="https://timco.co.uk/Themes/uptown/Content/img/timco-loading.gif"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${brand.variable} antialiased min-h-screen flex flex-col`}
      >
        <AuthProvider>
          <CartProvider>
            <Suspense fallback={null}>
              <AppRouteLoader />
            </Suspense>
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
