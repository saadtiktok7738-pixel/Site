import React from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { CartSidebar } from "./CartSidebar";
import { MobileBottomNav } from "./MobileBottomNav";

export function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col relative">
      <Header />
      <CartSidebar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}