import React, { useState, useEffect } from "react";
import { useParams } from "wouter";
import { useGetProduct } from "../apis/index.js";
import { formatPrice } from "../libs/utils.js";
import { Button } from "../ui/button.jsx";
import { useCart, useWishlist, useUI } from "../hooks/use-store.js";
import { ShoppingBag, Heart, Truck, ShieldCheck, Zap, RotateCcw } from "lucide-react";
import { BuyNowModal } from "../shared/BuyNowModal.jsx";
import { Helmet } from "react-helmet-async";

function StockBadge({ stock, inStock }) {
  if (!inStock) {
    return <span className="px-2.5 py-1 text-xs font-bold bg-red-50 text-red-600 border border-red-200">OUT OF STOCK</span>;
  }
  if (stock != null && stock <= 3) {
    return <span className="px-2.5 py-1 text-xs font-bold bg-red-50 text-red-600 border border-red-200">Only {stock} unit{stock !== 1 ? "s" : ""} remaining</span>;
  }
  if (stock != null && stock < 30) {
    return <span className="px-2.5 py-1 text-xs font-bold bg-yellow-50 text-yellow-600 border border-yellow-200">Limited Pcs</span>;
  }
  return <span className="px-2.5 py-1 text-xs font-bold bg-green-50 text-green-600 border border-green-200">In Stock</span>;
}

export default function ProductDetail({ productId }) {
  const params = useParams();
  const id = productId ?? params?.id;
  const { data: product, isLoading, isError } = useGetProduct(id);

  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("");
  const [showBuyNow, setShowBuyNow] = useState(false);

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { setCartOpen } = useUI();

  useEffect(() => {
    if (product && product.colors?.length > 0) {
      setSelectedColor(product.colors[0]);
    }
  }, [product]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-12 animate-pulse">
        <div className="aspect-square bg-secondary"></div>
        <div className="space-y-6 pt-4">
          <div className="h-8 bg-secondary rounded w-3/4"></div>
          <div className="h-6 bg-secondary rounded w-1/4"></div>
          <div className="h-24 bg-secondary rounded w-full"></div>
          <div className="h-12 bg-secondary rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold mb-3">Product not found.</h2>
        <a href="/catalog" className="text-accent hover:underline text-sm">← Back to Catalog</a>
      </div>
    );
  }

  // Corrected: Calculate displayed price based on discount amount
  const displayedPrice = product.discountPrice != null
    ? product.price - product.discountPrice
    : product.price;

  const currentImage = mainImage || product.imageUrl || `https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80`;
  const allImages = [product.imageUrl, ...(product.images || [])].filter(Boolean);
  if (allImages.length === 0) allImages.push(currentImage);

  const isWished = isInWishlist(product.id);
  const productColors = product.colors || [];

   const title = isLoading
    ? "Loading Product... | Value Cart"
    : isError || !product
    ? "Product Not Found | Value Cart"
    : `${product.name} | Value Cart`;

    const description = isLoading
    ? "Loading product details..."
    : isError || !product
    ? "The product you are looking for could not be found."
    : product.description || "Check out this product in our store";

  const image = product?.imageUrl || "/default-image.jpg";


  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor);
    setCartOpen(true);
  };

  const handleWishlist = () => {
    toggleWishlist(product);
  };

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">

          {/* Left: Gallery */}
          <div className="space-y-3">
            <div className="relative aspect-square bg-secondary overflow-hidden">
              <img
                src={currentImage}
                alt={product.name}
                className="w-full h-full object-cover object-center transition-opacity duration-300"
              />
              <button
                onClick={handleWishlist}
                className="absolute top-3 right-3 w-10 h-10 flex items-center justify-center shadow-md transition-all duration-200 bg-white/90 hover:bg-white"
              >
                <Heart className={`w-5 h-5 transition-colors ${isWished ? "fill-accent text-accent" : "text-foreground hover:text-accent"}`} />
              </button>
              {!product.inStock && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="bg-black text-white font-bold px-4 py-2 text-sm">OUT OF STOCK</span>
                </div>
              )}
            </div>
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setMainImage(img)}
                    className={`w-16 h-16 md:w-20 md:h-20 flex-shrink-0 overflow-hidden border-2 transition-all ${mainImage === img || (!mainImage && i === 0) ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"}`}
                  >
                    <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info */}
          <div className="flex flex-col">
            <div className="text-xs font-semibold tracking-widest text-muted-foreground uppercase mb-1">{product.category}</div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold tracking-tight mb-3 md:mb-4">{product.name}</h1>

            <div className="flex items-end gap-3 mb-3">
              <span className="text-2xl md:text-3xl font-bold text-accent">{formatPrice(displayedPrice)}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-base md:text-xl text-muted-foreground line-through mb-0.5">{formatPrice(product.originalPrice)}</span>
              )}
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs bg-accent/10 text-accent font-bold px-2 py-1 mb-0.5">
                  {Math.round(((product.originalPrice - displayedPrice) / product.originalPrice) * 100)}% OFF
                </span>
              )}
            </div>

            {/* Stock Badge */}
            <div className="mb-4">
              <StockBadge stock={product.stock} inStock={product.inStock} />
            </div>

            {/* Color Selection */}
            {productColors.length > 0 && (
              <div className="mb-5 md:mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-semibold">Color:</span>
                  {selectedColor && (
                    <span className="text-sm text-muted-foreground capitalize">{selectedColor}</span>
                  )}
                </div>
                <div className="flex gap-2 flex-wrap">
                  {productColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      title={color}
                      className={`w-8 h-8 rounded-full border-2 transition-all duration-150 ${selectedColor === color ? "border-foreground scale-110 shadow-md" : "border-border hover:border-muted-foreground hover:scale-105"}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-5 md:mb-6">
              <span className="font-semibold text-sm w-20">Quantity</span>
              <div className="flex items-center border border-input bg-background">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 text-lg hover:text-accent transition-colors">−</button>
                <span className="w-10 text-center font-bold text-sm">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(quantity + 1, product.stock ?? 99))} className="px-3 py-2 text-lg hover:text-accent transition-colors">+</button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-row gap-3 mb-6 md:mb-8">
              <Button size="lg" className="flex-1 h-11 md:h-12 rounded-none text-sm md:text-base" onClick={handleAddToCart} disabled={!product.inStock}>
                <ShoppingBag className="w-4 h-4 mr-2" />
                {product.inStock ? "Add to Cart" : "Out of Stock"}
              </Button>
              <Button size="lg" variant="outline" className="flex-1 h-11 md:h-12 rounded-none border-2 text-sm md:text-base" onClick={() => setShowBuyNow(true)} disabled={!product.inStock}>
                <Zap className="w-4 h-4 mr-2" /> Buy Now
              </Button>
            </div>

            {/* Delivery Info */}
            <div className="pt-5 md:pt-6 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              {[
                { icon: Truck, title: "Free Delivery", desc: "Orders above PKR 2000" },
                { icon: ShieldCheck, title: "Secure Payment", desc: "100% secure checkout" },
                { icon: RotateCcw, title: "Easy Returns", desc: "7-day return policy" },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-secondary flex items-center justify-center text-primary shrink-0">
                    <Icon className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-xs md:text-sm">{title}</p>
                    <p className="text-[11px] text-muted-foreground">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Full Description */}
        {product.description && (
          <div className="mt-10 md:mt-14 pt-8 border-t border-border">
            <h2 className="text-xl md:text-2xl font-display font-bold mb-4">Product Description</h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed whitespace-pre-wrap max-w-3xl">{product.description}</p>
          </div>
        )}
      </div>

      {showBuyNow && (
        <BuyNowModal product={product} selectedColor={selectedColor} onClose={() => setShowBuyNow(false)} />
      )}
    </>
  );
}