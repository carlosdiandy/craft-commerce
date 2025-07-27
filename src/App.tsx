import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "@/components/common/Header";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";
import { Marketplace } from "@/pages/Marketplace";
import { AdminDashboard } from "@/pages/AdminDashboard";
import { ShopOwnerDashboard } from "@/pages/ShopOwnerDashboard";
import NotFound from "./pages/NotFound";
import { Account } from "@/pages/Account";
import { ShopManagement } from "@/pages/ShopManagement";
import { ProductManagement } from "@/pages/ProductManagement";
import { Cart } from "@/pages/Cart";
import { Favorites } from "@/pages/Favorites";
import { Shops } from "@/pages/Shops";
import { ShopDetail } from "@/pages/ShopDetail";
import { UserManagement } from "@/pages/UserManagement";
import { OrderHistory } from "@/pages/OrderHistory";
import { ShopOrders } from "@/pages/ShopOrders";
import { AdminShopOverview } from "@/pages/AdminShopOverview";
import { Checkout } from "@/pages/Checkout";
import { ProductDetail } from "@/pages/ProductDetail";
import { ShopUserManagement } from "@/pages/ShopUserManagement";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Marketplace />} />
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <UserManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/shops" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminShopOverview />
            </ProtectedRoute>
          } />
          <Route path="/backoffice" element={
            <ProtectedRoute allowedRoles={['shopOwner']}>
              <ShopOwnerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/account" element={
            <ProtectedRoute allowedRoles={['client', 'shopOwner', 'admin']}>
              <Account />
            </ProtectedRoute>
          } />
          <Route path="/account/orders" element={
            <ProtectedRoute allowedRoles={['client', 'shopOwner', 'admin']}>
              <OrderHistory />
            </ProtectedRoute>
          } />
          <Route path="/shops/manage" element={
            <ProtectedRoute allowedRoles={['shopOwner']}>
              <ShopManagement />
            </ProtectedRoute>
          } />
          <Route path="/products/manage" element={
            <ProtectedRoute allowedRoles={['shopOwner']}>
              <ProductManagement />
            </ProtectedRoute>
          } />
          <Route path="/backoffice/orders" element={
            <ProtectedRoute allowedRoles={['shopOwner']}>
              <ShopOrders />
            </ProtectedRoute>
          } />
          <Route path="/backoffice/users" element={
            <ProtectedRoute allowedRoles={['shopOwner']}>
              <ShopUserManagement />
            </ProtectedRoute>
          } />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={
            <ProtectedRoute allowedRoles={['client', 'shopOwner', 'admin']}>
              <Checkout />
            </ProtectedRoute>
          } />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/shops" element={<Shops />} />
          <Route path="/shops/:shopId" element={<ShopDetail />} />
          <Route path="/products/:productId" element={<ProductDetail />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
