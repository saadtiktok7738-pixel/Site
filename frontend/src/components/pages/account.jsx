import React, { useState, useEffect, useRef } from "react";
import { User, Package, MapPin, LogOut, ChevronRight, CheckCircle2, Download, Calendar, CreditCard, ChevronDown } from "lucide-react";
import { useSendVerificationCode, useVerifyCode } from "../apis/index.js";
import { useAuth } from "../hooks/use-store.js";
import { Button } from "../ui/button.jsx";
import { Input } from "../ui/input.jsx";
import { formatPrice } from "../libs/utils.js";
import { useLocation } from "wouter";
import { toast } from "../hooks/use-toast.js";
import { downloadInvoice } from "../libs/invoice.js";
import { Helmet } from "react-helmet-async";

const SAVED_ADDRESSES_KEY = "store-saved-addresses";

const BASE_URL = import.meta.env.VITE_BASE_URL;

function getSavedAddresses() {
  try { return JSON.parse(localStorage.getItem(SAVED_ADDRESSES_KEY) || "[]"); } catch { return []; }
}
function saveAddresses(addresses) {
  localStorage.setItem(SAVED_ADDRESSES_KEY, JSON.stringify(addresses));
}

const STATUS_COLORS = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-blue-100 text-blue-700",
  shipping: "bg-violet-100 text-violet-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

function LoginPanel() {
  const { setUserAuth } = useAuth();
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [devCode, setDevCode] = useState(null);
  const [error, setError] = useState("");

  const { mutate: sendCode, isPending: isSending } = useSendVerificationCode();
  const { mutate: verifyCode, isPending: isVerifying } = useVerifyCode();

  const handleSendCode = (e) => {
    e.preventDefault();
    setError("");
    sendCode({ data: { email } }, {
      onSuccess: (data) => {
        setStep("code");
        if (data.devCode) setDevCode(data.devCode);
        toast({ title: "Code Sent!", description: `A verification code has been sent to ${email}` });
      },
      onError: () => {
        setError("Failed to send code. Please try again.");
        toast({ title: "Failed to Send", description: "Could not send verification code. Please try again.", variant: "destructive" });
      }
    });
  };

  const handleVerify = (e) => {
    e.preventDefault();
    setError("");
    verifyCode({ data: { email, code } }, {
      onSuccess: (data) => {
        setUserAuth(data.token, data.user);
        toast({ title: "Welcome back!", description: "You have been signed in successfully." });
      },
      onError: () => {
        setError("Invalid or expired code. Please try again.");
        toast({ title: "Login Failed", description: "Invalid or expired code. Please try again.", variant: "destructive" });
      }
    });
  };

  return (
    <>
    <Helmet>
        <title>{"Your Account | Value Cart"}</title>
        <meta
          name="description"
          content={"Manage your account, orders, and address."}
        />
        <meta property="og:title" content={"User Account | Value Cart"} />
        <meta property="og:description" content="View orders, wishlist, and account details." />
        <meta property="og:image" content="/default-account.jpg" />
      </Helmet>
    <div className="max-w-md mx-auto">
      <div className="bg-white border border-border p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-accent/10 flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-accent" />
          </div>
          <h2 className="text-2xl font-display font-bold">Sign In</h2>
          <p className="text-muted-foreground text-sm mt-2">
            {step === "email" ? "Enter your email to receive a login code" : `Enter the 6-digit code sent to ${email}`}
          </p>
        </div>

        {step === "email" ? (
          <form onSubmit={handleSendCode} className="space-y-4">
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="h-11"
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full h-11 bg-black text-white hover:bg-accent" disabled={isSending}>
              {isSending ? "Sending Code..." : "Send Verification Code"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-4">
            {devCode && (
              <div className="bg-accent/10 border border-accent/20 p-3 text-center">
                <p className="text-xs text-muted-foreground">Demo code (no email service):</p>
                <p className="text-2xl font-bold tracking-widest text-accent">{devCode}</p>
              </div>
            )}
            <Input
              type="text"
              placeholder="Enter 6-digit code"
              value={code}
              onChange={e => setCode(e.target.value)}
              required
              maxLength={6}
              className="h-11 text-center text-2xl tracking-widest font-bold"
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full h-11 bg-black text-white hover:bg-accent" disabled={isVerifying}>
              {isVerifying ? "Verifying..." : "Verify & Login"}
            </Button>
            <button type="button" onClick={() => { setStep("email"); setError(""); setDevCode(null); }} className="w-full text-sm text-muted-foreground hover:text-foreground">
              Use different email
            </button>
          </form>
        )}
      </div>
    </div>
    </>
  );
}

function MyOrders({ email }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!email) return;
    setLoading(true);
    fetch(`${BASE_URL}/api/orders?email=${encodeURIComponent(email)}`)
      .then(r => r.json())
      .then((data) => {
        setOrders(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setOrders([]);
        setLoading(false);
      });
  }, [email]);

  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-16 bg-secondary/50 animate-pulse" />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <Package className="w-10 h-10 mx-auto mb-3 opacity-30" />
        <p className="text-sm">No orders yet. Start shopping!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map(order => (
        <div key={order.id} className="border border-border bg-white p-3">
          {/* Order Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono font-bold text-accent text-sm">#{order.orderId}</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-700"}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
            <button
              className="flex items-center gap-1 text-[10px] text-muted-foreground border border-border px-2 py-1 hover:bg-secondary transition-colors"
              onClick={() => downloadInvoice(order)}
            >
              <Download className="w-2.5 h-2.5" /> Invoice
            </button>
          </div>

          {/* Date + Payment */}
          <div className="flex items-center gap-3 text-[10px] text-muted-foreground mb-2">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(order.createdAt).toLocaleDateString("en-PK", { day: "2-digit", month: "short", year: "numeric" })}
            </span>
            <span className="flex items-center gap-1">
              <CreditCard className="w-3 h-3" />
              {order.paymentMethod.toUpperCase()}
            </span>
          </div>

          {/* Items */}
          <div className="space-y-1.5">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                {item.imageUrl && (
                  <img src={item.imageUrl} alt={item.productName} className="w-8 h-8 object-cover bg-secondary flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{item.productName}</p>
                  <div className="flex items-center gap-1.5">
                    {item.color && (
                      <span className="w-2.5 h-2.5 rounded-full border border-border inline-block" style={{ backgroundColor: item.color }} />
                    )}
                    <p className="text-[10px] text-muted-foreground">Qty {item.quantity} × {formatPrice(item.price)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="flex justify-end mt-2 pt-2 border-t border-border">
            <span className="font-bold text-accent text-sm">{formatPrice(order.total)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
function MobileTabDropdown({ activeTab, setActiveTab, onSignOut }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);

  const tabs = [
    { key: "profile", label: "Profile", icon: User },
    { key: "orders", label: "My Orders", icon: Package },
    { key: "addresses", label: "Addresses", icon: MapPin },
  ];

  const active = tabs.find(t => t.key === activeTab);

  React.useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-3 py-2 border border-border bg-white text-sm font-medium shadow-sm"
      >
        {active?.icon && <active.icon className="w-4 h-4 text-accent" />}
        {active?.label}
        <ChevronDown
          className={`w-3.5 h-3.5 ml-1 text-muted-foreground transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-1 z-30 bg-white border border-border shadow-lg w-40">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                setOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "bg-accent/10 text-accent"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
          <div className="border-t border-border mt-1">
            <button
              onClick={() => {
                onSignOut();
                setOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/5 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
function UserPanel() {
  const { currentUser, logoutUser } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("profile");
  const [addresses, setAddresses] = useState(getSavedAddresses());
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({ label: "", name: "", phone: "", address: "", city: "" });

  const handleAddAddress = (e) => {
    e.preventDefault();
    const updated = [...addresses, { ...newAddress, id: Date.now().toString() }];
    setAddresses(updated);
    saveAddresses(updated);
    setNewAddress({ label: "", name: "", phone: "", address: "", city: "" });
    setShowAddAddress(false);
  };

  const handleDeleteAddress = (id) => {
    const updated = addresses.filter(a => a.id !== id);
    setAddresses(updated);
    saveAddresses(updated);
  };

  const tabs = [
    { key: "profile", label: "Profile", icon: User },
    { key: "orders", label: "My Orders", icon: Package },
    { key: "addresses", label: "Addresses", icon: MapPin },
  ];

  if (currentUser?.isAdmin) {
    setLocation("/admin");
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="md:hidden mb-4">
        <MobileTabDropdown activeTab={activeTab} setActiveTab={setActiveTab} onSignOut={logoutUser} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6">
        <div className="hidden md:block bg-white border border-border h-fit">
          <div className="p-5 border-b border-border">
            <div className="w-12 h-12 bg-accent/10 flex items-center justify-center mb-3">
              <User className="w-6 h-6 text-accent" />
            </div>
            <p className="font-semibold text-sm">{currentUser?.name || "My Account"}</p>
            <p className="text-xs text-muted-foreground">{currentUser?.email}</p>
          </div>
          <nav className="p-2">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors ${activeTab === tab.key ? 'bg-accent/10 text-accent' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'}`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                <ChevronRight className="w-3 h-3 ml-auto" />
              </button>
            ))}
            <button
              onClick={logoutUser}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/5 transition-colors mt-2"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </nav>
        </div>

        <div className="bg-white border border-border p-4 md:p-6">
          {activeTab === "profile" && (
            <div>
              <h3 className="text-lg md:text-xl font-display font-bold mb-5">My Profile</h3>
              <div className="space-y-4 max-w-sm">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Email</label>
                  <Input value={currentUser?.email || ""} disabled className="bg-secondary/50" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Name</label>
                  <Input placeholder="Your name" defaultValue={currentUser?.name || ""} />
                </div>
                <Button className="bg-black text-white hover:bg-accent">Save Changes</Button>
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div>
              <h3 className="text-lg md:text-xl font-display font-bold mb-4">My Orders</h3>
              {currentUser?.email ? (
                <MyOrders email={currentUser.email} />
              ) : (
                <div className="text-center py-10 text-muted-foreground">
                  <Package className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Sign in with your email to view your orders.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "addresses" && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg md:text-xl font-display font-bold">Saved Addresses</h3>
                <Button size="sm" onClick={() => setShowAddAddress(!showAddAddress)} className="bg-black text-white hover:bg-accent text-xs">
                  + Add
                </Button>
              </div>

              {showAddAddress && (
                <form onSubmit={handleAddAddress} className="bg-secondary/30 p-4 mb-5 space-y-3">
                  <Input placeholder="Label (e.g. Home, Office)" value={newAddress.label} onChange={e => setNewAddress(f => ({...f, label: e.target.value}))} required />
                  <Input placeholder="Full Name" value={newAddress.name} onChange={e => setNewAddress(f => ({...f, name: e.target.value}))} required />
                  <Input placeholder="Phone" value={newAddress.phone} onChange={e => setNewAddress(f => ({...f, phone: e.target.value}))} required />
                  <Input placeholder="Full Address" value={newAddress.address} onChange={e => setNewAddress(f => ({...f, address: e.target.value}))} required />
                  <Input placeholder="City" value={newAddress.city} onChange={e => setNewAddress(f => ({...f, city: e.target.value}))} required />
                  <div className="flex gap-2">
                    <Button type="submit" size="sm" className="bg-black text-white">Save</Button>
                    <Button type="button" size="sm" variant="outline" onClick={() => setShowAddAddress(false)}>Cancel</Button>
                  </div>
                </form>
              )}

              {addresses.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  <MapPin className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No saved addresses yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {addresses.map(addr => (
                    <div key={addr.id} className="border border-border p-3 flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold bg-accent/10 text-accent px-2 py-0.5">{addr.label}</span>
                        </div>
                        <p className="font-semibold text-sm">{addr.name}</p>
                        <p className="text-xs text-muted-foreground">{addr.address}, {addr.city}</p>
                        <p className="text-xs text-muted-foreground">{addr.phone}</p>
                      </div>
                      <button onClick={() => handleDeleteAddress(addr.id)} className="text-destructive text-xs hover:underline">Remove</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Account() {
  const { currentUser } = useAuth();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
      <h1 className="text-2xl md:text-3xl font-display font-bold mb-6">
        {currentUser ? "My Account" : "Sign In"}
      </h1>
      {currentUser ? <UserPanel /> : <LoginPanel />}
    </div>
  );
}