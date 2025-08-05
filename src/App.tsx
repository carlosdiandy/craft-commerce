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
import { Wishlist } from "@/pages/Wishlist";
import { Shops } from "@/pages/Shops";
import { ShopDetail } from "@/pages/ShopDetail";
import { UserManagement } from "@/pages/UserManagement";
import { OrderHistory } from "@/pages/OrderHistory";
import { ShopOrders } from "@/pages/ShopOrders";
import { AdminShopOverview } from "@/pages/AdminShopOverview";
import { Checkout } from "@/pages/Checkout";
import { ProductDetail } from "@/pages/ProductDetail";
import { ShopUserManagement } from "@/pages/ShopUserManagement";
import { OrderDetail } from "@/pages/OrderDetail";
import { AboutUs } from "@/pages/AboutUs";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      {/* <Sonner /> */}
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Marketplace />} />
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
              <UserManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/shops" element={
            <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
              <AdminShopOverview />
            </ProtectedRoute>
          } />
          <Route path="/backoffice" element={
            <ProtectedRoute allowedRoles={['ROLE_SHOP_OWNER']}>
              <ShopOwnerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/account" element={
            <ProtectedRoute allowedRoles={['ROLE_CLIENT', 'ROLE_SHOP_OWNER', 'ROLE_ADMIN']}>
              <Account />
            </ProtectedRoute>
          } />
          <Route path="/account/orders" element={
            <ProtectedRoute allowedRoles={['ROLE_CLIENT', 'ROLE_SHOP_OWNER', 'ROLE_ADMIN']}>
              <OrderHistory />
            </ProtectedRoute>
          } />
          <Route path="/account/orders/:orderId" element={
            <ProtectedRoute allowedRoles={['ROLE_CLIENT', 'ROLE_SHOP_OWNER', 'ROLE_ADMIN']}>
              <OrderDetail />
            </ProtectedRoute>
          } />
          <Route path="/shops/manage/:shopId" element={
            <ProtectedRoute allowedRoles={['ROLE_SHOP_OWNER']}>
              <ShopManagement />
            </ProtectedRoute>
          } />
          <Route path="/products/manage" element={
            <ProtectedRoute allowedRoles={['ROLE_SHOP_OWNER']}>
              <ProductManagement />
            </ProtectedRoute>
          } />
          <Route path="/backoffice/orders" element={
            <ProtectedRoute allowedRoles={['ROLE_SHOP_OWNER']}>
              <ShopOrders />
            </ProtectedRoute>
          } />
          <Route path="/backoffice/users" element={
            <ProtectedRoute allowedRoles={['ROLE_SHOP_OWNER']}>
              <ShopUserManagement />
            </ProtectedRoute>
          } />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={
            <ProtectedRoute allowedRoles={['ROLE_CLIENT', 'ROLE_SHOP_OWNER', 'ROLE_ADMIN']}>
              <Checkout />
            </ProtectedRoute>
          } />
          <Route path="/wishlist" element={<Wishlist />} />
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
