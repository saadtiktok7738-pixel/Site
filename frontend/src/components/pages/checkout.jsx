import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCart, useAuth } from "../hooks/use-store.js";
import { useCreateOrder } from "../apis/index.js";
import { formatPrice } from "../libs/utils.js";
import { Button } from "../ui/button.jsx";
import { Input } from "../ui/input.jsx";
import { ShoppingBag, CheckCircle2, Package, User } from "lucide-react";
import { toast } from "../hooks/use-toast.js";
import React from "react";
import { Helmet } from "react-helmet-async";

const checkoutSchema = z.object({
  customerName: z.string().min(2, "Name is required"),
  customerEmail: z.string().email("Valid email required").optional().or(z.literal("")),
  customerPhone: z.string().min(10, "Valid phone number is required"),
  customerAddress: z.string().min(5, "Full address is required"),
  customerCity: z.string().min(2, "City is required"),
  paymentMethod: z.enum(["cod", "online"]),
  notes: z.string().optional(),
});

function ThankYouPage({ orderId, isLoggedIn }) {
  const [, setLocation] = useLocation();

  // Scroll to top when thank you page shows
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <>
     <Helmet>
        <title>Checkout | Value Cart</title>
        <meta
          name="description"
          content="Securely checkout your items at Value Cart. Easy payment and delivery options."
        />
        <meta property="og:title" content="Checkout | Value Cart" />
        <meta property="og:description" content="Complete your purchase securely." />
        <meta property="og:image" content="/default-checkout.jpg" />
      </Helmet>
    <div className="max-w-lg mx-auto px-4 py-12 md:py-20">
      {/* Success Icon */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">Thank You!</h1>
        <p className="text-muted-foreground text-base">Your order has been placed successfully.</p>
        {orderId && (
          <div className="mt-3 inline-block bg-accent/10 px-4 py-2 border border-accent/20">
            <span className="text-xs text-muted-foreground">Order ID</span>
            <p className="font-mono font-bold text-accent text-lg">#{orderId}</p>
          </div>
        )}
      </div>

      {/* What happens next */}
      <div className="bg-white border border-border p-5 mb-5">
        <h2 className="font-bold text-sm mb-3 uppercase tracking-wider text-muted-foreground">What's Next</h2>
        <ul className="space-y-2.5 text-sm">
          <li className="flex gap-2.5 items-start">
            <span className="w-5 h-5 bg-accent text-white text-xs font-bold rounded-full flex items-center justify-center shrink-0 mt-0.5">1</span>
            <span>Our team will confirm your order within a few hours.</span>
          </li>
          <li className="flex gap-2.5 items-start">
            <span className="w-5 h-5 bg-accent text-white text-xs font-bold rounded-full flex items-center justify-center shrink-0 mt-0.5">2</span>
            <span>Your order will be packed and dispatched within 1–2 working days.</span>
          </li>
          <li className="flex gap-2.5 items-start">
            <span className="w-5 h-5 bg-accent text-white text-xs font-bold rounded-full flex items-center justify-center shrink-0 mt-0.5">3</span>
            <span>Delivery takes 3–5 working days depending on your location.</span>
          </li>
        </ul>
      </div>

      {/* Track Order CTA */}
      <div className="bg-secondary/50 border border-border p-4 mb-6 flex gap-3 items-start">
        {isLoggedIn ? (
          <>
            <Package className="w-5 h-5 text-accent shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm">Track your order</p>
              <p className="text-xs text-muted-foreground mt-0.5">Your order is now in your account history. Click below to view and track it.</p>
            </div>
          </>
        ) : (
          <>
            <User className="w-5 h-5 text-accent shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm">Want to track your order?</p>
              <p className="text-xs text-muted-foreground mt-0.5">Sign in with the same email you used at checkout to view your order history.</p>
            </div>
          </>
        )}
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        {isLoggedIn ? (
          <Link href="/account" className="flex-1">
            <Button className="w-full bg-black text-white hover:bg-accent">
              <Package className="w-4 h-4 mr-2" /> My Orders
            </Button>
          </Link>
        ) : (
          <Link href="/account" className="flex-1">
            <Button className="w-full bg-black text-white hover:bg-accent">
              <User className="w-4 h-4 mr-2" /> Sign In to Track
            </Button>
          </Link>
        )}
        <Button variant="outline" className="flex-1" onClick={() => setLocation("/catalog")}>
          Continue Shopping
        </Button>
      </div>
    </div>
    </>
  );
}

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { items, getCartTotal, clearCart } = useCart();
  const { currentUser } = useAuth();
  const [isSuccess, setIsSuccess] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState(null);

  const { mutate: createOrder, isPending, error } = useCreateOrder();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: "cod",
      customerEmail: currentUser?.email ?? "",
      customerName: currentUser?.name ?? "",
    }
  });

  const onSubmit = (data) => {
    if (items.length === 0) return;

    const orderItems = items.map(item => ({
      productId: String(item.productId),
      productName: item.productName,
      price: item.price,
      quantity: item.quantity,
      imageUrl: item.imageUrl ?? "",
      color: item.color || "",
    }));

    createOrder({
      data: {
        customerName: data.customerName,
        customerEmail: data.customerEmail || "",
        customerPhone: data.customerPhone,
        customerAddress: data.customerAddress,
        customerCity: data.customerCity,
        paymentMethod: data.paymentMethod,
        notes: data.notes || null,
        items: orderItems,
        total: getCartTotal(),
      }
    }, {
      onSuccess: (responseData) => {
        clearCart();
        setPlacedOrderId(responseData?.orderId ?? null);
        setIsSuccess(true);
        toast({ title: "Order Confirmed!", description: `Your order has been placed successfully.` });
      },
      onError: () => {
        toast({ title: "Order Failed", description: "Failed to place your order. Please try again.", variant: "destructive" });
      },
    });
  };

  if (isSuccess) {
    return <ThankYouPage orderId={placedOrderId} isLoggedIn={!!currentUser} />;
  }

  if (items.length === 0) {
    return (
      <>
      <div className="max-w-2xl mx-auto px-4 py-16 md:py-24 text-center">
        <ShoppingBag className="w-14 h-14 text-muted-foreground mx-auto mb-5 opacity-50" />
        <h2 className="text-xl md:text-2xl font-bold mb-4">Your cart is empty</h2>
        <Button onClick={() => setLocation("/catalog")}>Continue Shopping</Button>
      </div>
      </>
    );
  }

  return (
    <>
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 md:py-12">
      <h1 className="text-2xl md:text-4xl font-display font-bold mb-5 md:mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-12">
        {/* Form */}
        <div className="lg:col-span-7">
          {error && (
            <div className="mb-4 p-3 bg-destructive/10 text-destructive text-xs md:text-sm rounded-lg">
              Failed to place order. Please try again.
            </div>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 md:space-y-8 bg-white p-4 md:p-8 border border-border shadow-sm">

            <div>
              <h3 className="text-base md:text-xl font-bold mb-4 md:mb-6">1. Contact Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-6">
                <div>
                  <label className="block text-xs md:text-sm font-medium mb-1 md:mb-2">Full Name *</label>
                  <Input {...register("customerName")} placeholder="Ahmed Khan" className={errors.customerName ? "border-destructive" : ""} />
                  {errors.customerName && <p className="text-destructive text-[11px] mt-1">{errors.customerName.message}</p>}
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-medium mb-1 md:mb-2">Email <span className="text-muted-foreground font-normal">(optional)</span></label>
                  <Input {...register("customerEmail")} type="email" placeholder="ahmed@example.com" />
                  {errors.customerEmail && <p className="text-destructive text-[11px] mt-1">{errors.customerEmail.message}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs md:text-sm font-medium mb-1 md:mb-2">Phone Number *</label>
                  <Input {...register("customerPhone")} placeholder="0300 1234567" className={errors.customerPhone ? "border-destructive" : ""} />
                  {errors.customerPhone && <p className="text-destructive text-[11px] mt-1">{errors.customerPhone.message}</p>}
                </div>
              </div>
            </div>

            <div className="pt-4 md:pt-6 border-t border-border">
              <h3 className="text-base md:text-xl font-bold mb-4 md:mb-6">2. Shipping Address</h3>
              <div className="grid grid-cols-1 gap-3 md:gap-6">
                <div>
                  <label className="block text-xs md:text-sm font-medium mb-1 md:mb-2">Street Address *</label>
                  <Input {...register("customerAddress")} placeholder="House #123, Street 4..." className={errors.customerAddress ? "border-destructive" : ""} />
                  {errors.customerAddress && <p className="text-destructive text-[11px] mt-1">{errors.customerAddress.message}</p>}
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-medium mb-1 md:mb-2">City *</label>
                  <Input {...register("customerCity")} placeholder="Karachi" className={errors.customerCity ? "border-destructive" : ""} />
                  {errors.customerCity && <p className="text-destructive text-[11px] mt-1">{errors.customerCity.message}</p>}
                </div>
              </div>
            </div>

            <div className="pt-4 md:pt-6 border-t border-border">
              <h3 className="text-base md:text-xl font-bold mb-3 md:mb-6">3. Payment Method</h3>
              <div className="space-y-2 md:space-y-4">
                <label className="flex items-center gap-3 p-3 md:p-4 border-2 border-input cursor-pointer hover:border-primary transition-colors bg-secondary/20">
                  <input type="radio" value="cod" {...register("paymentMethod")} className="w-4 h-4 accent-accent" />
                  <span className="font-semibold text-sm md:text-base">Cash on Delivery (COD)</span>
                </label>
                <label className="flex items-center gap-3 p-3 md:p-4 border-2 border-input cursor-not-allowed opacity-50 bg-secondary/20">
                  <input type="radio" value="online" disabled className="w-4 h-4" />
                  <span className="text-sm md:text-base">Credit Card / Bank Transfer <span className="text-xs text-muted-foreground">(Coming Soon)</span></span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs md:text-sm font-medium mb-1 md:mb-2">Order Notes <span className="text-muted-foreground font-normal">(optional)</span></label>
              <Input {...register("notes")} placeholder="Any special instructions..." />
            </div>

            <Button type="submit" size="lg" className="w-full text-sm md:text-base h-11 md:h-14 shadow-lg mt-2" disabled={isPending}>
              {isPending ? "Processing..." : "Place Order"}
            </Button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-5">
          <div className="bg-secondary/50 p-4 md:p-8 border border-border sticky top-28">
            <h3 className="text-base md:text-xl font-bold mb-4 md:mb-6">Order Summary</h3>
            <div className="space-y-3 mb-4 md:mb-6 max-h-[35vh] overflow-y-auto pr-1">
              {items.map((item, idx) => (
                <div key={`${item.productId}-${idx}`} className="flex gap-3 bg-white p-2.5 md:p-3 shadow-sm">
                  <img src={item.imageUrl} alt={item.productName} className="w-14 h-14 md:w-16 md:h-16 object-cover flex-shrink-0" />
                  <div className="flex-1 py-0.5">
                    <p className="font-semibold text-xs md:text-sm line-clamp-1">{item.productName}</p>
                    {item.color && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="w-2.5 h-2.5 rounded-full border border-border inline-block" style={{ backgroundColor: item.color }} />
                        <span className="text-[10px] text-muted-foreground capitalize">{item.color}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-end mt-1.5">
                      <span className="text-muted-foreground text-[11px] md:text-xs">Qty: {item.quantity}</span>
                      <span className="font-bold text-accent text-xs md:text-sm">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-3 md:pt-4 space-y-2 md:space-y-3">
              <div className="flex justify-between text-muted-foreground text-sm">
                <span>Subtotal</span>
                <span>{formatPrice(getCartTotal())}</span>
              </div>
              <div className="flex justify-between text-muted-foreground text-sm">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="flex justify-between text-base md:text-xl font-bold text-foreground pt-3 border-t border-border mt-1">
                <span>Total</span>
                <span>{formatPrice(getCartTotal())}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}