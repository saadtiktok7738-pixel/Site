import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Search, User, Heart, ShoppingBag, Menu, X } from "lucide-react";
import { useCart, useWishlist, useUI, useAuth } from "../hooks/use-store.js";
import { Input } from "../ui/input.jsx";
import { useListCategories } from "../apis/index.js";

export function Header() {
  const [location, setLocation] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef(null);

  const { setCartOpen, isSearchOpen, setSearchOpen } = useUI();
  const cartItems = useCart((s) => s.items) || [];
  const wishlistItems = useWishlist((s) => s.items) || [];
  const { currentUser, adminUser } = useAuth();
  const { data: categories } = useListCategories();

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Catalog", href: "/catalog" },
  ];

  const isLoggedIn = !!currentUser;
  const isAdmin = currentUser?.isAdmin || !!adminUser;
  const accountHref = isAdmin ? "/admin" : "/account";

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchOpen(false);
      setLocation(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-primary text-primary-foreground text-xs font-semibold py-2 overflow-hidden whitespace-nowrap relative">
        <div className="inline-block animate-marquee w-[200%]">
          {[
            "FREE DELIVERY ALL OVER PAKISTAN",
            "7-DAY EASY RETURNS",
            "COD AVAILABLE NATIONWIDE",
            "CUSTOMER SUPPORT 24/7",
          ].map((msg, i) => (
            <span key={i} className="mr-16 tracking-wider">
              {msg}
            </span>
          ))}
          {[
            "FREE DELIVERY ALL OVER PAKISTAN",
            "7-DAY EASY RETURNS",
            "COD AVAILABLE NATIONWIDE",
            "CUSTOMER SUPPORT 24/7",
          ].map((msg, i) => (
            <span key={`r-${i}`} className="mr-16 tracking-wider">
              {msg}
            </span>
          ))}
        </div>
      </div>

      {/* Main Header */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled ? "glass-header shadow-sm" : "bg-white border-b border-border"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 md:h-18">

            {/* Mobile Menu Button */}
            <div className="flex-1 md:hidden">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 -ml-2"
                aria-label="Open mobile menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex flex-1 gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-semibold uppercase tracking-wide transition-colors relative group py-2 ${
                    location === link.href
                      ? "text-primary"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute bottom-0 left-0 w-full h-0.5 bg-accent transform origin-left transition-transform duration-300 ${
                      location === link.href
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              ))}
            </nav>

            {/* Logo */}
            <Link href="/" className="flex-shrink-0 flex items-center gap-2">
              <img src="/logo.png" alt="Value Cart" className="h-9 md:h-10 w-auto" />
              <span className="font-display font-bold text-lg md:text-xl tracking-tight hidden sm:inline">
                Value Cart
              </span>
            </Link>

            {/* Actions */}
            <div className="flex-1 flex justify-end items-center gap-0.5 md:gap-2">
              <button
                onClick={() => setSearchOpen(!isSearchOpen)}
                className="p-2 text-foreground hover:text-accent transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>

              <Link
                href={accountHref}
                className="hidden md:flex p-2 text-foreground hover:text-accent transition-colors"
              >
                <User className="w-5 h-5" />
              </Link>

              <Link
                href="/wishlist"
                className="p-2 text-foreground hover:text-accent transition-colors relative hidden md:flex"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-accent text-white text-[9px] font-bold min-w-[16px] h-4 rounded-full flex items-center justify-center px-0.5 leading-none">
                    {wishlistCount > 9 ? "9+" : wishlistCount}
                  </span>
                )}
              </Link>

              <button
                onClick={() => setCartOpen(true)}
                className="hidden md:flex p-2 text-foreground hover:text-accent transition-colors relative"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[9px] font-bold min-w-[16px] h-4 rounded-full flex items-center justify-center px-0.5 leading-none">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Expandable Search */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out bg-white border-b border-border ${
            isSearchOpen ? "max-h-20 py-3 opacity-100" : "max-h-0 py-0 opacity-0 border-transparent"
          }`}
        >
          <form
            onSubmit={handleSearch}
            className="max-w-3xl mx-auto px-4 relative flex gap-2"
          >
            <div className="relative flex-1">
              <button
                type="submit"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-accent transition-colors"
                tabIndex={-1}
              >
                <Search className="w-4 h-4" />
              </button>
              <Input
                ref={inputRef}
                placeholder="Search products and press Enter..."
                className="pl-10 bg-secondary/50 border-transparent focus-visible:bg-white h-11"
                autoFocus={isSearchOpen}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="p-2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </form>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Side Menu */}
          <div className="relative z-50 w-4/5 max-w-sm bg-background shadow-2xl flex flex-col overflow-y-auto animate-slide-in-left">
            <div className="p-4 border-b border-border flex justify-between items-center">
              <div className="flex items-center gap-2">
                <img src="/logo.png" alt="Value Cart" className="h-8 w-auto" />
                <span className="font-display font-bold text-lg tracking-tight">Value Cart</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="p-4 flex flex-col gap-1 overflow-y-auto flex-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-base font-semibold py-3 border-b border-border ${
                    location === link.href ? "text-accent" : "text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/wishlist"
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-semibold py-3 border-b border-border"
              >
                Wishlist {wishlistCount > 0 && <span className="text-accent text-sm">({wishlistCount})</span>}
              </Link>
              {Array.isArray(categories) && categories.length > 0 && (
                <div className="pt-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Categories</p>
                  <div className="flex flex-col gap-0.5">
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/catalog?category=${encodeURIComponent(cat.name)}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-sm text-muted-foreground hover:text-foreground py-1.5"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </nav>
            <div className="p-4 border-t border-border space-y-2">
              <Link
                href={accountHref}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 font-medium text-sm"
              >
                <User className="w-4 h-4 text-accent" /> {isLoggedIn ? "My Account" : "Login"}
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 font-medium text-sm text-muted-foreground"
                >
                  <User className="w-4 h-4" /> Admin Panel
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}