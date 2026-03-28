import { Link, useLocation } from "wouter";
import { Home, BookOpen, Heart, ShoppingBag } from "lucide-react";
import { useCart, useWishlist, useUI } from "../hooks/use-store.js";

export function MobileBottomNav() {
  const [location] = useLocation();
  const { setCartOpen } = useUI();
  const cartItems = useCart((s) => s.items);
  const wishlistItems = useWishlist((s) => s.items);
  const cartCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);
  const wishlistCount = wishlistItems.length;

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-white border-t border-border flex items-stretch h-14 safe-area-bottom">
      <Link
        href="/"
        className={`flex-1 flex flex-col items-center justify-center gap-0.5 ${
          location === "/" ? "text-accent" : "text-muted-foreground"
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] font-medium">Home</span>
      </Link>

      <Link
        href="/catalog"
        className={`flex-1 flex flex-col items-center justify-center gap-0.5 ${
          location === "/catalog" ? "text-accent" : "text-muted-foreground"
        }`}
      >
        <BookOpen className="w-5 h-5" />
        <span className="text-[10px] font-medium">Catalog</span>
      </Link>

      <Link
        href="/wishlist"
        className={`flex-1 flex flex-col items-center justify-center gap-0.5 relative ${
          location === "/wishlist" ? "text-accent" : "text-muted-foreground"
        }`}
      >
        <div className="relative">
          <Heart className="w-5 h-5" />
          {wishlistCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-accent text-white text-[8px] font-bold min-w-[14px] h-3.5 rounded-full flex items-center justify-center px-0.5 leading-none">
              {wishlistCount > 9 ? "9+" : wishlistCount}
            </span>
          )}
        </div>
        <span className="text-[10px] font-medium">Wishlist</span>
      </Link>

      <button
        onClick={() => setCartOpen(true)}
        className="flex-1 flex flex-col items-center justify-center gap-0.5 relative text-muted-foreground"
      >
        <div className="relative">
          <ShoppingBag className="w-5 h-5" />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[8px] font-bold min-w-[14px] h-3.5 rounded-full flex items-center justify-center px-0.5 leading-none">
              {cartCount > 9 ? "9+" : cartCount}
            </span>
          )}
        </div>
        <span className="text-[10px] font-medium">Cart</span>
      </button>
    </div>
  );
}