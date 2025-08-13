import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Settings, 
  Users, 
  Store, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  Shield, 
  Ticket,
  MapPin,
  Gift,
  CreditCard
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { Badge } from '@/components/ui/badge';

export const RoleBasedNav = () => {
  const { user } = useAuthStore();

  if (!user) return null;

  const isAdmin = user.role === 'ROLE_ADMIN';
  const isShopOwner = user.role === 'ROLE_SHOP_OWNER';
  const isShopEmployee = user.role === 'ROLE_SHOP_EMPLOYEE';
  const isClient = user.role === 'ROLE_CLIENT';

  return (
    <div className="flex items-center gap-2">
      {/* Admin Navigation */}
      {isAdmin && (
        <>
          <Link to="/admin/dashboard">
            <Button variant="ghost" size="sm" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              Admin Dashboard
            </Button>
          </Link>
          <Link to="/admin/users">
            <Button variant="ghost" size="sm" className="gap-2">
              <Users className="w-4 h-4" />
              Users
            </Button>
          </Link>
          <Link to="/admin/shops">
            <Button variant="ghost" size="sm" className="gap-2">
              <Store className="w-4 h-4" />
              Shops
            </Button>
          </Link>
          <Link to="/admin/coupons">
            <Button variant="ghost" size="sm" className="gap-2">
              <Gift className="w-4 h-4" />
              Coupons
            </Button>
          </Link>
          <Link to="/admin/promotions">
            <Button variant="ghost" size="sm" className="gap-2">
              <CreditCard className="w-4 h-4" />
              Promotions
            </Button>
          </Link>
        </>
      )}

      {/* Shop Owner Navigation */}
      {isShopOwner && (
        <>
          <Link to="/shop-owner/dashboard">
            <Button variant="ghost" size="sm" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </Button>
          </Link>
          <Link to="/shops">
            <Button variant="ghost" size="sm" className="gap-2">
              <Store className="w-4 h-4" />
              My Shops
            </Button>
          </Link>
          <Link to="/products/manage">
            <Button variant="ghost" size="sm" className="gap-2">
              <Package className="w-4 h-4" />
              Products
            </Button>
          </Link>
          <Link to="/shop-orders">
            <Button variant="ghost" size="sm" className="gap-2">
              <ShoppingCart className="w-4 h-4" />
              Orders
            </Button>
          </Link>
        </>
      )}

      {/* Shop Employee Navigation */}
      {isShopEmployee && (
        <>
          <Link to="/products/manage">
            <Button variant="ghost" size="sm" className="gap-2">
              <Package className="w-4 h-4" />
              Products
            </Button>
          </Link>
          <Link to="/shop-orders">
            <Button variant="ghost" size="sm" className="gap-2">
              <ShoppingCart className="w-4 h-4" />
              Orders
            </Button>
          </Link>
        </>
      )}

      {/* Client Navigation */}
      {isClient && (
        <>
          <Link to="/orders">
            <Button variant="ghost" size="sm" className="gap-2">
              <ShoppingCart className="w-4 h-4" />
              My Orders
            </Button>
          </Link>
          <Link to="/wishlist">
            <Button variant="ghost" size="sm" className="gap-2">
              <Package className="w-4 h-4" />
              Wishlist
            </Button>
          </Link>
          <Link to="/addresses">
            <Button variant="ghost" size="sm" className="gap-2">
              <MapPin className="w-4 h-4" />
              Addresses
            </Button>
          </Link>
        </>
      )}

      {/* Support Tickets - Available to all authenticated users */}
      <Link to="/support-tickets">
        <Button variant="ghost" size="sm" className="gap-2">
          <Ticket className="w-4 h-4" />
          Support
        </Button>
      </Link>

      {/* Role Badge */}
      <Badge variant={isAdmin ? 'default' : isShopOwner ? 'secondary' : 'outline'}>
        {user.role.replace('ROLE_', '')}
      </Badge>
    </div>
  );
};