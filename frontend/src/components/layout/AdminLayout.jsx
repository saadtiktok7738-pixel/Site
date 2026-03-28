import React from "react";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, Package, ShoppingCart, Image as ImageIcon, LogOut, FolderOpen, Users } from "lucide-react";
import { useAuth } from "../hooks/use-store.js";

export function AdminLayout({ children }) {
  const [location] = useLocation();
  const { logout, logoutUser, adminUser, currentUser } = useAuth();

  const displayEmail = currentUser?.email || adminUser?.email || "";
  const displayInitial = displayEmail.charAt(0).toUpperCase() || "A";

  const handleLogout = () => {
    logout();
    logoutUser();
    window.location.href = "/";
  };

  const nav = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { label: "Banners", href: "/admin/banners", icon: ImageIcon },
    { label: "Categories", href: "/admin/categories", icon: FolderOpen },
    { label: "Products", href: "/admin/products", icon: Package },
    { label: "Users", href: "/admin/users", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-secondary flex text-foreground">
      {/* Sidebar */}
      <aside className="w-60 bg-primary text-primary-foreground flex flex-col shadow-2xl z-10 hidden md:flex fixed inset-y-0">
        <div className="h-16 flex items-center px-5 border-b border-white/10">
          <Link href="/" className="font-display font-bold text-xl tracking-tighter text-white hover:text-accent transition-colors">
            STORE<span className="text-accent">.</span>
          </Link>
          <span className="ml-2 text-xs font-bold bg-accent text-white px-1.5 py-0.5">ADMIN</span>
        </div>
        <div className="p-4 flex-1">
          <p className="text-[10px] text-white/40 uppercase tracking-wider mb-3 px-2 font-semibold">Menu</p>
          <nav className="space-y-1">
            {nav.map((item) => {
              const active = location === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 transition-all duration-200 ${
                    active ? 'bg-accent text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 bg-accent/20 flex items-center justify-center text-accent font-bold text-sm">
              {displayInitial}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-xs font-medium text-white truncate">{displayEmail}</p>
              <p className="text-[10px] text-white/50">Administrator</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-white/70 hover:text-white transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-60 flex flex-col min-h-screen">
        <header className="h-16 bg-white border-b border-border flex items-center px-6 shadow-sm justify-between sticky top-0 z-10">
          <h1 className="text-lg font-bold font-display capitalize">
            {nav.find(n => n.href === location)?.label || "Admin Panel"}
          </h1>
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">← View Store</Link>
        </header>
        <div className="p-6 flex-1 overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}