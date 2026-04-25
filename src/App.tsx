import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { Layout } from "./components/Layout";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Combos from "./pages/Combos";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import NotFound from "./pages/NotFound.tsx";
import DeliveryTracking from "./pages/DeliveryTracking";

const AdminLayout = lazy(() => import("@/components/AdminLayout").then(m => ({ default: m.AdminLayout })));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminProducts = lazy(() => import("./pages/admin/Products"));
const AdminSettings = lazy(() => import("./pages/admin/Settings"));
const AdminBusiness = lazy(() => import("./pages/admin/Business"));
const AdminInventory = lazy(() => import("./pages/admin/Inventory"));
const AdminPromotions = lazy(() => import("./pages/admin/Promotions"));
const AdminCombos = lazy(() => import("./pages/admin/Combos"));
const AdminDelivery = lazy(() => import("./pages/admin/Delivery"));
const AdminTestimonials = lazy(() => import("./pages/admin/Testimonials"));
const AdminOrders = lazy(() => import("./pages/admin/Orders"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="animate-spin h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <Suspense fallback={<PageLoader />}>
            <BrowserRouter>
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/combos" element={<Combos />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/orders/:id" element={<OrderDetail />} />
                  <Route path="/track/:id" element={<DeliveryTracking />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="combos" element={<AdminCombos />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="promotions" element={<AdminPromotions />} />
                  <Route path="testimonials" element={<AdminTestimonials />} />
                  <Route path="business" element={<AdminBusiness />} />
                  <Route path="inventory" element={<AdminInventory />} />
                  <Route path="settings" element={<AdminSettings />} />
                  <Route path="delivery" element={<AdminDelivery />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </Suspense>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
