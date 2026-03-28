import React, { useState } from "react";
import { Link } from "wouter";
import { ShoppingBag, Heart, Zap } from "lucide-react";
import { formatPrice } from "../libs/utils.js";
import { useCart, useWishlist, useUI } from "../hooks/use-store.js";
import { BuyNowModal } from "./BuyNowModal.jsx";

export function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { setCartOpen } = useUI();
  const [showBuyNow, setShowBuyNow] = useState(false);

  const isWished = isInWishlist(product.id);
  const discountPct = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const firstColor = product?.colors?.[0] || "";

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1, firstColor);
    setCartOpen(true);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowBuyNow(true);
  };

  return (
    <>
      <Link href={`/product/${product.id}`} className="group relative flex flex-col gap-2 cursor-pointer">
        {/* Image */}
        <div className="relative aspect-[4/5] bg-secondary overflow-hidden shadow-sm transition-shadow duration-300 group-hover:shadow-md">
          <img
            src={product.imageUrl || `https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80`}
            alt={product.name}
            className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
          />

          {/* Badges */}
          <div className="absolute top-1.5 left-1.5 flex flex-col gap-1">
            {discountPct && (
              <span className="bg-accent text-white text-[10px] md:text-xs font-bold px-1.5 py-0.5">{discountPct}% OFF</span>
            )}
            {!product.inStock && (
              <span className="bg-black/80 text-white text-[10px] md:text-xs font-bold px-1.5 py-0.5">Sold Out</span>
            )}
          </div>

          {/* Wishlist */}
          <button
            onClick={handleWishlist}
            className="absolute top-0.5 right-0 md:top-1.5 md:right-1.5 w-7 h-7 md:w-8 md:h-8 flex items-center justify-center z-10 drop-shadow-md"
          >
            <Heart className={`w-4 h-4 md:w-5 md:h-5 transition-colors ${isWished ? 'fill-accent text-accent' : 'text-white'}`} />
          </button>

          {/* Desktop hover button */}
          <div className="hidden md:flex absolute inset-x-0 bottom-0 p-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out pointer-events-none group-hover:pointer-events-auto">
            <button
              className="w-full bg-black text-white py-2 text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-accent transition-colors"
              onClick={handleAddToCart}
              disabled={!product.inStock}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              {product.inStock ? "Add to Cart" : "Out of Stock"}
            </button>
          </div>

          {/* Mobile bottom buttons */}
          <div className="md:hidden absolute inset-x-0 bottom-0 flex divide-x divide-white/30">
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="flex-1 bg-black/85 text-white py-1.5 text-[10px] font-semibold flex items-center justify-center gap-0.5"
            >
              <ShoppingBag className="w-3 h-3" /> Cart
            </button>
            <button
              onClick={handleBuyNow}
              disabled={!product.inStock}
              className="flex-1 bg-accent text-white py-1.5 text-[10px] font-semibold flex items-center justify-center gap-0.5"
            >
              <Zap className="w-3 h-3" /> Buy Now
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="px-0.5">
          <div className="text-[10px] font-medium text-muted-foreground mb-0.5 uppercase tracking-wider truncate">{product.category}</div>
          <h3 className="font-semibold text-xs md:text-sm text-foreground line-clamp-2 leading-snug">{product.name}</h3>
          <div className="flex gap-1.5 items-center mt-1">
            <span className="font-bold text-foreground text-xs md:text-sm">{formatPrice(product.price)}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[10px] md:text-xs text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
        </div>
      </Link>

      {showBuyNow && (
        <BuyNowModal product={product} selectedColor={firstColor} onClose={() => setShowBuyNow(false)} />
      )}
    </>
  );
}