import { Link, useLocation } from 'react-router-dom';
import { Home, Store, ShoppingCart, Heart, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/stores/authStore';
import { useSupabaseCartStore } from '@/stores/supabase/cartStore';
import { useSupabaseWishlistStore } from '@/stores/supabase/wishlistStore';
import { cn } from '@/lib/utils';

interface BottomNavProps {
  onAuthClick: (tab: 'login' | 'register') => void;
}

export const BottomNav = ({ onAuthClick }: BottomNavProps) => {
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();
  const { getItemsCount } = useSupabaseCartStore();
  const { items: favoriteItems } = useSupabaseWishlistStore();

  const cartItemsCount = getItemsCount();
  const favoriteItemsCount = favoriteItems.length;

  const navItems = [
    { 
      to: '/', 
      icon: Home, 
      label: 'Home',
      show: true 
    },
    { 
      to: '/shops', 
      icon: Store, 
      label: 'Shops',
      show: true 
    },
    { 
      to: '/cart', 
      icon: ShoppingCart, 
      label: 'Cart',
      show: true,
      badge: cartItemsCount 
    },
    { 
      to: '/wishlist', 
      icon: Heart, 
      label: 'Wishlist',
      show: true,
      badge: favoriteItemsCount 
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border shadow-lg">
      <nav className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => 
          item.show ? (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full relative transition-colors",
                isActive(item.to) 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="relative">
                <item.icon className="w-5 h-5" />
                {item.badge && item.badge > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-4 w-4 flex items-center justify-center p-0 text-[10px]"
                  >
                    {item.badge}
                  </Badge>
                )}
              </div>
              <span className="text-xs mt-1">{item.label}</span>
              {isActive(item.to) && (
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-primary" />
              )}
            </Link>
          ) : null
        )}
        
        {/* Account/Auth button */}
        {isAuthenticated ? (
          <Link
            to="/account"
            className={cn(
              "flex flex-col items-center justify-center flex-1 h-full relative transition-colors",
              isActive('/account') 
                ? "text-primary" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <User className="w-5 h-5" />
            <span className="text-xs mt-1">Account</span>
            {isActive('/account') && (
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-primary" />
            )}
          </Link>
        ) : (
          <button
            onClick={() => onAuthClick('login')}
            className="flex flex-col items-center justify-center flex-1 h-full text-muted-foreground hover:text-foreground transition-colors"
          >
            <User className="w-5 h-5" />
            <span className="text-xs mt-1">Login</span>
          </button>
        )}
      </nav>
    </div>
  );
};
