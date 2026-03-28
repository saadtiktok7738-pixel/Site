import React from "react";
import { Link } from "wouter";
import {   MapPin, Phone, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground pt-12 pb-8 mb-14 md:mb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">

          {/* Brand & Contact */}
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-2">
              <img src="/logo.png" alt="Value Cart" className="h-9 w-auto" style={{ filter: "brightness(0) invert(1)" }} />
              <span className="font-display font-bold text-xl tracking-tight text-white">Value Cart</span>
            </Link>
            <p className="text-primary-foreground/70 text-sm max-w-xs leading-relaxed">
              Premium quality essentials designed for modern living. Elevate your everyday style.
            </p>
            <div className="space-y-2 text-primary-foreground/80 text-sm">
              <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-accent shrink-0" /> 123 Fashion Ave, Karachi</p>
              <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-accent shrink-0" /> +92 300 1234567</p>
              <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-accent shrink-0" /> support@store.pk</p>
            </div>
            
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-sm font-semibold mb-4 uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2.5">
              <li><Link href="/" className="text-primary-foreground/70 hover:text-white transition-colors text-sm">Home</Link></li>
              <li><Link href="/catalog" className="text-primary-foreground/70 hover:text-white transition-colors text-sm">Catalog</Link></li>
              <li><Link href="/wishlist" className="text-primary-foreground/70 hover:text-white transition-colors text-sm">Wishlist</Link></li>
              <li><Link href="/account" className="text-primary-foreground/70 hover:text-white transition-colors text-sm">My Account</Link></li>
              <li><Link href="/checkout" className="text-primary-foreground/70 hover:text-white transition-colors text-sm">Checkout</Link></li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h4 className="font-display text-sm font-semibold mb-4 uppercase tracking-wider">Information</h4>
            <ul className="space-y-2.5">
              <li><Link href="/contact" className="text-primary-foreground/70 hover:text-white transition-colors text-sm">Contact Us</Link></li>
              <li><Link href="/privacy-policy" className="text-primary-foreground/70 hover:text-white transition-colors text-sm">Privacy Policy</Link></li>
              <li><Link href="/refund-policy" className="text-primary-foreground/70 hover:text-white transition-colors text-sm">Refund Policy</Link></li>
              <li><Link href="/terms-of-service" className="text-primary-foreground/70 hover:text-white transition-colors text-sm">Terms of Service</Link></li>
            </ul>
          </div>

        </div>

        <div className="pt-6 border-t border-white/10 text-center text-primary-foreground/40 text-xs flex flex-col md:flex-row justify-between items-center gap-2">
          <p>&copy; {new Date().getFullYear()} Value Cart. All rights reserved.</p>
          <p>Made with ❤️ in Pakistan</p>
        </div>
      </div>
    </footer>
  );
}