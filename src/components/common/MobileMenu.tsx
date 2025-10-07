import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Menu,
  Home,
  Package,
  Store,
  ShoppingCart,
  Heart,
  User,
  LogOut,
  Settings,
  BarChart3,
  X
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useSupabaseCartStore } from '@/stores/supabase/cartStore';
import { useSupabaseWishlistStore } from '@/stores/supabase/wishlistStore';

interface MobileMenuProps {
  onAuthClick?: (tab: 'login' | 'register') => void;
}

export const MobileMenu = ({ onAuthClick }: MobileMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const { getItemsCount } = useSupabaseCartStore();
  const { items: favoriteItems } = useSupabaseWishlistStore();
  const navigate = useNavigate();
  const location = useLocation();

  const cartItemsCount = getItemsCount();
  const favoriteItemsCount = favoriteItems.length;

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const getDashboardPath = () => {
    if (user?.role === 'ROLE_ADMIN') return '/admin';
    if (user?.role === 'ROLE_SHOP_OWNER') return '/backoffice';
    return '/account';
  };

  const getDashboardLabel = () => {
    if (user?.role === 'ROLE_ADMIN') return 'Admin Dashboard';
    if (user?.role === 'ROLE_SHOP_OWNER') return 'Mon Backoffice';
    return 'Mon Compte';
  };

  const isMarketplace = location.pathname === '/' ||
    location.pathname.startsWith('/products') ||
    location.pathname.startsWith('/shops');

  // Focus on secondary/user-specific actions (not in bottom nav)
  const userMenuItems = [
    { 
      label: getDashboardLabel(), 
      path: getDashboardPath(), 
      icon: user?.role === 'ROLE_ADMIN' ? BarChart3 : user?.role === 'ROLE_SHOP_OWNER' ? Package : User,
      show: isAuthenticated 
    },
    { label: 'Mes commandes', path: '/account/orders', icon: Package, show: isAuthenticated },
    { label: 'Mes adresses', path: '/account/addresses', icon: Settings, show: isAuthenticated },
    { label: 'Support', path: '/support', icon: Settings, show: isAuthenticated },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden relative">
          <Menu className="w-5 h-5" />
          {/* Notification dot if user has notifications */}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[340px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            Menu
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-6 w-6"
            >
              <X className="h-4 w-4" />
            </Button>
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6 pb-6">
          {/* User Info or Auth buttons */}
          {isAuthenticated && user ? (
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl p-4 border border-border/50">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center shrink-0">
                  <User className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate text-foreground">{user.name}</p>
                  <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                  <Badge variant="outline" className="mt-1.5">
                    {user.role === 'ROLE_ADMIN' ? 'Administrateur' :
                      user.role === 'ROLE_SHOP_OWNER' ? 'Propriétaire' :
                        'Client'}
                  </Badge>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3 px-2">
              <p className="text-sm text-muted-foreground mb-3">Connectez-vous pour accéder à toutes les fonctionnalités</p>
              <Button 
                className="w-full justify-center gap-2"
                variant="outline"
                onClick={() => {
                  onAuthClick?.('login');
                  setIsOpen(false);
                }}
              >
                <User className="w-4 h-4" />
                Connexion
              </Button>
              <Button 
                className="w-full justify-center gap-2 bg-gradient-primary hover:opacity-90"
                onClick={() => {
                  onAuthClick?.('register');
                  setIsOpen(false);
                }}
              >
                <User className="w-4 h-4" />
                Inscription
              </Button>
            </div>
          )}

          {/* Quick Actions - Only if authenticated */}
          {isAuthenticated && (
            <div className="space-y-2 px-2">
              <h3 className="font-semibold text-sm text-muted-foreground mb-3 px-2">Menu</h3>
              {userMenuItems.map((item) => 
                item.show ? (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-3 w-full p-3 rounded-xl hover:bg-muted/50 active:bg-muted transition-all group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <item.icon className="w-4 h-4 text-primary" />
                    </div>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ) : null
              )}
              
              {/* Logout button */}
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="w-full justify-start p-3 mt-4 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl"
              >
                <div className="w-9 h-9 rounded-lg bg-destructive/10 flex items-center justify-center mr-3">
                  <LogOut className="w-4 h-4" />
                </div>
                Se déconnecter
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};