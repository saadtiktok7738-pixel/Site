import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster.jsx";
import { TooltipProvider } from "./components/ui/tooltip.jsx";
import { useEffect } from "react";
import NotFound from "./components/pages/not-found.jsx";
import Home from "./components/pages/home.jsx";
import Catalog from "./components/pages/catalog.jsx";
import ProductDetail from "./components/pages/product-detail.jsx";
import Checkout from "./components/pages/checkout.jsx";
import Account from "./components/pages/account.jsx";
import Wishlist from "./components/pages/wishlist.jsx";
import Contact from "./components/pages/contact.jsx";
import PrivacyPolicy from "./components/pages/privacy-policy.jsx";
import RefundPolicy from "./components/pages/refund-policy.jsx";
import TermsOfService from "./components/pages/terms-of-service.jsx";
import AdminDashboard from "./components/pages/admin/dashboard.jsx";
import AdminProducts from "./components/pages/admin/products.jsx";
import AdminOrders from "./components/pages/admin/orders.jsx";
import AdminBanners from "./components/pages/admin/banners.jsx";
import AdminCategories from "./components/pages/admin/categories.jsx";
import AdminUsers from "./components/pages/admin/users.jsx";
import { MainLayout } from "./components/layout/MainLayout.jsx";
import { AdminLayout } from "./components/layout/AdminLayout.jsx";
import { WhatsAppButton } from "./components/shared/WhatsAppButton.jsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000,
    },
  },
});

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location]);
  return null;
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <Switch>
        <Route path="/" component={() => <MainLayout><Home /></MainLayout>} />
        <Route path="/catalog" component={() => <MainLayout><Catalog /></MainLayout>} />
        <Route path="/product/:id" component={({ params }) => <MainLayout><ProductDetail productId={params.id} /></MainLayout>} />
        <Route path="/checkout" component={() => <MainLayout><Checkout /></MainLayout>} />
        <Route path="/account" component={() => <MainLayout><Account /></MainLayout>} />
        <Route path="/wishlist" component={() => <MainLayout><Wishlist /></MainLayout>} />
        <Route path="/contact" component={() => <MainLayout><Contact /></MainLayout>} />
        <Route path="/privacy-policy" component={() => <MainLayout><PrivacyPolicy /></MainLayout>} />
        <Route path="/refund-policy" component={() => <MainLayout><RefundPolicy /></MainLayout>} />
        <Route path="/terms-of-service" component={() => <MainLayout><TermsOfService /></MainLayout>} />
        <Route path="/admin/login" component={() => { window.location.replace("/account"); return null; }} />
        <Route path="/admin" component={() => <AdminLayout><AdminDashboard /></AdminLayout>} />
        <Route path="/admin/products" component={() => <AdminLayout><AdminProducts /></AdminLayout>} />
        <Route path="/admin/orders" component={() => <AdminLayout><AdminOrders /></AdminLayout>} />
        <Route path="/admin/banners" component={() => <AdminLayout><AdminBanners /></AdminLayout>} />
        <Route path="/admin/categories" component={() => <AdminLayout><AdminCategories /></AdminLayout>} />
        <Route path="/admin/users" component={() => <AdminLayout><AdminUsers /></AdminLayout>} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <WhatsAppButton />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;