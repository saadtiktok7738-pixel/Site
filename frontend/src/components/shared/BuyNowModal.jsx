import React, { useState } from "react";
import { X, CheckCircle2, Package } from "lucide-react";
import { Link } from "wouter";
import { useCreateOrder } from "../apis/index.js";
import { formatPrice } from "../libs/utils.js";
import { Button } from "../ui/button.jsx";
import { Input } from "../ui/input.jsx";
import { toast } from "../hooks/use-toast.js";
import { useAuth } from "../hooks/use-store.js";

export function BuyNowModal({ product, selectedColor = "", onClose }) {
  const { mutate: createOrder, isPending } = useCreateOrder();
  const { currentUser } = useAuth();
  const [success, setSuccess] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState(null);
  const [form, setForm] = useState({
    customerName: currentUser?.name || "",
    customerEmail: currentUser?.email || "",
    customerPhone: "",
    customerAddress: "",
    customerCity: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createOrder({
      data: {
        ...form,
        items: [{
          productId: String(product.id),
          productName: product.name,
          price: product.price,
          quantity: 1,
          imageUrl: product.imageUrl,
          color: selectedColor,
        }],
        total: product.price,
        paymentMethod: "cod",
      }
    }, {
      onSuccess: (data) => {
        setPlacedOrderId(data?.orderId || null);
        setSuccess(true);
        toast({ title: "Order Placed!", description: `Your order #${data?.orderId || ""} has been placed successfully.` });
      },
      onError: () => {
        toast({ title: "Order Failed", description: "Something went wrong. Please try again.", variant: "destructive" });
      },
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {success ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold mb-1">Order Placed!</h3>
            {placedOrderId && (
              <p className="text-sm font-mono font-bold text-accent mb-3">Order ID: #{placedOrderId}</p>
            )}
            <p className="text-muted-foreground text-sm mb-5">We'll contact you soon to confirm your order.</p>
            <div className="bg-secondary/50 rounded-lg p-3 mb-5 text-left flex gap-3 items-start">
              <Package className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">{currentUser ? "Track your order" : "Want to track this order?"}</p>
                <p className="text-xs text-muted-foreground">{currentUser ? "View this order in your account history." : "Sign in with the same email to see your orders."}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href="/account" className="flex-1">
                <Button className="w-full bg-black text-white hover:bg-accent text-sm" onClick={onClose}>
                  {currentUser ? "My Orders" : "Sign In"}
                </Button>
              </Link>
              <Button variant="outline" onClick={onClose} className="flex-1 text-sm">Close</Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-3">
                <img src={product.imageUrl} alt={product.name} className="w-12 h-12 object-cover" />
                <div>
                  <p className="font-semibold text-sm line-clamp-1">{product.name}</p>
                  <p className="text-accent font-bold">{formatPrice(product.price)}</p>
                  {selectedColor && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="w-3 h-3 rounded-full border border-border inline-block" style={{ backgroundColor: selectedColor }} />
                      <span className="text-xs text-muted-foreground capitalize">{selectedColor}</span>
                    </div>
                  )}
                </div>
              </div>
              <button onClick={onClose}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-3">
              <h3 className="font-bold text-base mb-2">Order Details (COD)</h3>
              <Input placeholder="Full Name" required value={form.customerName} onChange={e => setForm(f => ({...f, customerName: e.target.value}))} />
              <Input placeholder="Email (optional)" type="email" value={form.customerEmail} onChange={e => setForm(f => ({...f, customerEmail: e.target.value}))} />
              <Input placeholder="Phone Number" required value={form.customerPhone} onChange={e => setForm(f => ({...f, customerPhone: e.target.value}))} />
              <Input placeholder="Full Address" required value={form.customerAddress} onChange={e => setForm(f => ({...f, customerAddress: e.target.value}))} />
              <Input placeholder="City" required value={form.customerCity} onChange={e => setForm(f => ({...f, customerCity: e.target.value}))} />
              <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-white" disabled={isPending}>
                {isPending ? "Placing Order..." : "Place Order (COD)"}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}