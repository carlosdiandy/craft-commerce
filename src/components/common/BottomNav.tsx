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
  const { isAuthenticated, user } = useAuthStore();
  const { getItemsCount } = useSupabaseCartStore();
  const { items: favoriteItems } = useSupabaseWishlistStore();

  const cartItemsCount = getItemsCount();
  const favoriteItemsCount = favoriteItems.length;

  const getDashboardPath = () => {
    if (user?.role === 'ROLE_ADMIN') return '/admin';
    if (user?.role === 'ROLE_SHOP_OWNER') return '/backoffice';
    return '/account';
  };

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

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
      {/* Background with blur effect */}
      <div className="absolute inset-0 bg-background/95 backdrop-blur-lg border-t border-border/50" />
      
      {/* Navigation items */}
      <nav className="relative flex justify-around items-center h-16 px-2 safe-area-bottom">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              "flex flex-col items-center justify-center flex-1 h-full relative transition-all duration-300 group",
              isActive(item.to) 
                ? "text-primary scale-105" 
                : "text-muted-foreground active:scale-95"
            )}
          >
            {/* Active indicator - top bar */}
            {isActive(item.to) && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-primary rounded-full animate-fade-in" />
            )}
            
            {/* Icon container with badge */}
            <div className="relative mb-1">
              <div className={cn(
                "p-2 rounded-xl transition-all duration-300",
                isActive(item.to) 
                  ? "bg-primary/10" 
                  : "group-active:bg-muted"
              )}>
                <item.icon className={cn(
                  "w-5 h-5 transition-all duration-300",
                  isActive(item.to) && "scale-110"
                )} />
              </div>
              
              {/* Enhanced Badge for cart and wishlist */}
              {item.badge !== undefined && item.badge > 0 && (
                <div className="absolute -top-0.5 -right-0.5 animate-scale-in">
                  <div className="relative">
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-destructive rounded-full blur-sm opacity-60 animate-pulse" />
                    
                    {/* Badge */}
                    <Badge 
                      variant="destructive" 
                      className="relative h-5 min-w-[20px] flex items-center justify-center p-0 px-1.5 text-[10px] font-bold border-2 border-background shadow-lg"
                    >
                      {item.badge > 99 ? '99+' : item.badge}
                    </Badge>
                  </div>
                </div>
              )}
            </div>
            
            {/* Label */}
            <span className={cn(
              "text-[11px] font-medium transition-all duration-300",
              isActive(item.to) 
                ? "font-semibold" 
                : "font-normal"
            )}>
              {item.label}
            </span>
          </Link>
        ))}
        
        {/* Account/Auth button */}
        {isAuthenticated ? (
          <Link
            to={getDashboardPath()}
            className={cn(
              "flex flex-col items-center justify-center flex-1 h-full relative transition-all duration-300 group",
              (location.pathname.startsWith('/account') || 
               location.pathname.startsWith('/admin') || 
               location.pathname.startsWith('/backoffice'))
                ? "text-primary scale-105" 
                : "text-muted-foreground active:scale-95"
            )}
          >
            {/* Active indicator - top bar */}
            {(location.pathname.startsWith('/account') || 
              location.pathname.startsWith('/admin') || 
              location.pathname.startsWith('/backoffice')) && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-primary rounded-full animate-fade-in" />
            )}
            
            {/* Icon container */}
            <div className="relative mb-1">
              <div className={cn(
                "p-2 rounded-xl transition-all duration-300",
                (location.pathname.startsWith('/account') || 
                 location.pathname.startsWith('/admin') || 
                 location.pathname.startsWith('/backoffice'))
                  ? "bg-primary/10" 
                  : "group-active:bg-muted"
              )}>
                <User className={cn(
                  "w-5 h-5 transition-all duration-300",
                  (location.pathname.startsWith('/account') || 
                   location.pathname.startsWith('/admin') || 
                   location.pathname.startsWith('/backoffice')) && "scale-110"
                )} />
              </div>
            </div>
            
            {/* Label */}
            <span className={cn(
              "text-[11px] font-medium transition-all duration-300",
              (location.pathname.startsWith('/account') || 
               location.pathname.startsWith('/admin') || 
               location.pathname.startsWith('/backoffice'))
                ? "font-semibold" 
                : "font-normal"
            )}>
              Account
            </span>
          </Link>
        ) : (
          <button
            onClick={() => onAuthClick('login')}
            className="flex flex-col items-center justify-center flex-1 h-full text-muted-foreground active:scale-95 transition-all duration-300 group"
          >
            <div className="relative mb-1">
              <div className="p-2 rounded-xl transition-all duration-300 group-active:bg-muted">
                <User className="w-5 h-5" />
              </div>
            </div>
            <span className="text-[11px] font-medium">Login</span>
          </button>
        )}
      </nav>
    </div>
  );
};
