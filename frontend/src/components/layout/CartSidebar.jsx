import React from "react";
import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import { Link } from "wouter";
import { useCart, useUI } from "../hooks/use-store.js";
import { Button } from "../ui/button.jsx";
import { formatPrice } from "../libs/utils.js";

export function CartSidebar() {
  const { isCartOpen, setCartOpen } = useUI();
  const { items, removeFromCart, updateQuantity, getCartTotal } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={() => setCartOpen(false)}
      />
      
      <div className="relative w-full max-w-md bg-background h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 ease-out border-l border-border">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-display font-bold flex items-center">
            <ShoppingBag className="w-5 h-5 mr-3" /> Your Cart
          </h2>
          <button 
            onClick={() => setCartOpen(false)}
            className="p-2 hover:bg-secondary rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-muted-foreground">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <p>Your cart is empty.</p>
              <Button variant="outline" onClick={() => setCartOpen(false)}>
                Continue Shopping
              </Button>
            </div>
          ) : (
            items.map((item, idx) => (
              <div key={`${item.productId}-${idx}`} className="flex gap-4 group">
                <div className="w-20 h-24 rounded-lg bg-secondary overflow-hidden shrink-0">
                  <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex justify-between items-start">
                      <div className="pr-4">
                        <h4 className="font-semibold text-sm line-clamp-2">{item.productName}</h4>
                        {item.color && (
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span
                              className="w-3 h-3 rounded-full border border-border inline-block"
                              style={{ backgroundColor: item.color }}
                            />
                            <span className="text-xs text-muted-foreground capitalize">{item.color}</span>
                          </div>
                        )}
                      </div>
                      <button onClick={() => removeFromCart(item.productId)} className="text-muted-foreground hover:text-destructive transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="font-bold text-accent mt-1">{formatPrice(item.price)}</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-border rounded-lg bg-background">
                      <button 
                        onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                        className="p-1.5 text-muted-foreground hover:text-foreground"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="p-1.5 text-muted-foreground hover:text-foreground"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-border bg-secondary/50">
            <div className="flex justify-between items-center mb-6">
              <span className="font-medium text-muted-foreground">Subtotal</span>
              <span className="text-xl font-bold">{formatPrice(getCartTotal())}</span>
            </div>
            <Link href="/checkout" onClick={() => setCartOpen(false)}>
              <Button size="lg" className="w-full shadow-xl shadow-primary/10 text-lg">
                Checkout Now
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}