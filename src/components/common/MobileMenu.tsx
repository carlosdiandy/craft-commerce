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
import { useCartStore } from '@/stores/cartStore';
import { useFavoritesStore } from '@/stores/favoritesStore';

export const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const { getItemsCount } = useCartStore();
  const { items: favoriteItems } = useFavoritesStore();
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
    if (user?.role === 'admin') return '/admin';
    if (user?.role === 'shopOwner') return '/backoffice';
    return '/account';
  };

  const getDashboardLabel = () => {
    if (user?.role === 'admin') return 'Admin Dashboard';
    if (user?.role === 'shopOwner') return 'Mon Backoffice';
    return 'Mon Compte';
  };

  const isMarketplace = location.pathname === '/' ||
    location.pathname.startsWith('/products') ||
    location.pathname.startsWith('/shops');

  const menuItems = [
    { label: 'Accueil', path: '/', icon: Home, show: true },
    { label: 'Produits', path: '/products', icon: Package, show: isMarketplace },
    { label: 'Boutiques', path: '/shops/manage', icon: Store, show: isMarketplace },
  ];

  const userMenuItems = [
    { 
      label: getDashboardLabel(), 
      path: getDashboardPath(), 
      icon: user?.role === 'admin' ? BarChart3 : user?.role === 'shopOwner' ? Package : User,
      show: isAuthenticated 
    },
    { label: 'Mes commandes', path: '/account/orders', icon: Package, show: isAuthenticated },
    { label: 'Paramètres', path: '/account/settings', icon: Settings, show: isAuthenticated && user?.role === 'client' },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
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

        <div className="mt-6 space-y-6">
          {/* User Info */}
          {isAuthenticated && user ? (
            <div className="bg-muted rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{user.name}</p>
                  <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                  <Badge variant="outline" className="mt-1">
                    {user.role === 'admin' ? 'Administrateur' :
                      user.role === 'shopOwner' ? 'Propriétaire' :
                        'Client'}
                  </Badge>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Button 
                className="w-full justify-start"
                variant="outline"
                onClick={() => {
                  navigate('/login');
                  setIsOpen(false);
                }}
              >
                <User className="w-4 h-4 mr-2" />
                Connexion
              </Button>
              <Button 
                className="w-full justify-start"
                variant="gradient"
                onClick={() => {
                  navigate('/register');
                  setIsOpen(false);
                }}
              >
                <User className="w-4 h-4 mr-2" />
                Inscription
              </Button>
            </div>
          )}

          {/* Navigation */}
          <div className="space-y-1">
            <h3 className="font-medium text-sm text-muted-foreground mb-2">Navigation</h3>
            {menuItems.map((item) => 
              item.show ? (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              ) : null
            )}
          </div>

          {/* Shopping Actions */}
          {isMarketplace && (
            <div className="space-y-1">
              <h3 className="font-medium text-sm text-muted-foreground mb-2">Shopping</h3>
              <Link
                to="/cart"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <ShoppingCart className="w-5 h-5" />
                  <span>Panier</span>
                </div>
                {cartItemsCount > 0 && (
                  <Badge variant="destructive" className="h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {cartItemsCount}
                  </Badge>
                )}
              </Link>
              <Link
                to="/favorites"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Heart className="w-5 h-5" />
                  <span>Favoris</span>
                </div>
                {favoriteItemsCount > 0 && (
                  <Badge variant="destructive" className="h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {favoriteItemsCount}
                  </Badge>
                )}
              </Link>
            </div>
          )}

          {/* User Menu */}
          {isAuthenticated && (
            <div className="space-y-1">
              <h3 className="font-medium text-sm text-muted-foreground mb-2">Mon Compte</h3>
              {userMenuItems.map((item) => 
                item.show ? (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-muted transition-colors"
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                ) : null
              )}
              
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="w-full justify-start p-3 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Se déconnecter
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};