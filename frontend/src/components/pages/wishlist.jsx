import React from "react";
import { Link } from "wouter";
import { Heart, Trash2, ShoppingBag } from "lucide-react";
import { useWishlist, useCart, useUI } from "../hooks/use-store.js";
import { ProductCard } from "../shared/ProductCard.jsx";
import { Button } from "../ui/button.jsx";
import { Helmet } from "react-helmet";

export default function Wishlist() {
  const { items, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { setCartOpen } = useUI();

  const handleAddAll = () => {
    items.forEach(product => addToCart(product));
    setCartOpen(true);
  };

  return (
    <>
    <Helmet>
        <title>My Wishlist | Value Cart</title>
        <meta
          name="description"
          content="View and manage the products you have added to your wishlist."
        />
      </Helmet>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="flex items-center justify-between mb-6 md:mb-8 border-b border-border pb-5">
        <div>
          <h1 className="text-2xl md:text-4xl font-display font-bold">My Wishlist</h1>
          <p className="text-muted-foreground text-sm mt-1">{items.length} saved item{items.length !== 1 ? "s" : ""}</p>
        </div>
        {items.length > 0 && (
          <Button size="sm" onClick={handleAddAll} className="hidden sm:flex">
            <ShoppingBag className="w-4 h-4 mr-2" /> Add All to Cart
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-5">
            <Heart className="w-9 h-9 text-muted-foreground opacity-50" />
          </div>
          <h2 className="text-xl font-bold mb-2">Your wishlist is empty</h2>
          <p className="text-muted-foreground text-sm mb-6">Save items you love to come back to them later.</p>
          <Link href="/catalog">
            <Button>Browse Products</Button>
          </Link>
        </div>
      ) : (
        <>
          {items.length > 0 && (
            <Button size="sm" onClick={handleAddAll} className="sm:hidden mb-4 w-full">
              <ShoppingBag className="w-4 h-4 mr-2" /> Add All to Cart
            </Button>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-5">
            {items.map(product => (
              <div key={product.id} className="relative">
                <ProductCard product={product} />
                <button
                  onClick={() => toggleWishlist(product)}
                  className="absolute top-1.5 left-1.5 z-10 w-7 h-7 bg-black/70 text-white flex items-center justify-center hover:bg-destructive transition-colors"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
    </>
  );
}