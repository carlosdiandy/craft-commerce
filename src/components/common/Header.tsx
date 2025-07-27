import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, 
  Heart, 
  User, 
  Search, 
  Menu,
  LogOut,
  Settings,
  Package,
  BarChart3
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuthStore } from '@/stores/authStore';
import { useCartStore } from '@/stores/cartStore';
import { useFavoritesStore } from '@/stores/favoritesStore';
import { AuthModal } from '@/components/auth/AuthModal';

export const Header = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');
  
  const { user, isAuthenticated, logout } = useAuthStore();
  const { getItemsCount, toggleCart } = useCartStore();
  const { items: favoriteItems } = useFavoritesStore();
  const navigate = useNavigate();
  const location = useLocation();

  const cartItemsCount = getItemsCount();
  const favoriteItemsCount = favoriteItems.length;

  const handleAuthClick = (tab: 'login' | 'register') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardPath = () => {
    if (user?.role === 'admin') return '/admin';
    if (user?.role === 'shopOwner') return '/backoffice';
    return '/account';
  };

  const getDashboardLabel = () => {
    if (user?.role === 'admin') return 'Admin';
    if (user?.role === 'shopOwner') return 'Backoffice';
    return 'Mon compte';
  };

  const isMarketplace = location.pathname === '/' || 
                       location.pathname.startsWith('/products') || 
                       location.pathname.startsWith('/shops');

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl bg-gradient-primary bg-clip-text text-transparent">
              MarketPlace
            </span>
          </Link>

          {/* Navigation centrale - uniquement pour marketplace */}
          {isMarketplace && (
            <nav className="hidden md:flex items-center space-x-6">
              <Link 
                to="/" 
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Accueil
              </Link>
              <Link 
                to="/products" 
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Produits
              </Link>
              <Link 
                to="/shops" 
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Boutiques
              </Link>
            </nav>
          )}

          {/* Barre de recherche - uniquement pour marketplace */}
          {isMarketplace && (
            <div className="hidden md:flex items-center space-x-2 flex-1 max-w-sm mx-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  type="text"
                  placeholder="Rechercher des produits..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Actions à droite */}
          <div className="flex items-center space-x-4">
            {/* Panier et favoris - uniquement pour marketplace */}
            {isMarketplace && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  onClick={() => navigate('/favorites')}
                >
                  <Heart className="w-5 h-5" />
                  {favoriteItemsCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                      {favoriteItemsCount}
                    </Badge>
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  onClick={toggleCart}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {cartItemsCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                      {cartItemsCount}
                    </Badge>
                  )}
                </Button>
              </>
            )}

            {/* Menu utilisateur */}
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="hidden md:inline font-medium">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.name}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user.email}
                      </p>
                      <Badge variant="outline" className="w-fit">
                        {user.role === 'admin' ? 'Administrateur' : 
                         user.role === 'shopOwner' ? 'Propriétaire' : 
                         'Client'}
                      </Badge>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem onClick={() => navigate(getDashboardPath())}>
                    {user.role === 'admin' ? <BarChart3 className="mr-2 h-4 w-4" /> :
                     user.role === 'shopOwner' ? <Package className="mr-2 h-4 w-4" /> :
                     <User className="mr-2 h-4 w-4" />}
                    {getDashboardLabel()}
                  </DropdownMenuItem>
                  
                  {user.role === 'client' && (
                    <DropdownMenuItem onClick={() => navigate('/account/settings')}>
                      <Settings className="mr-2 h-4 w-4" />
                      Paramètres
                    </DropdownMenuItem>
                  )}
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Se déconnecter
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  onClick={() => handleAuthClick('login')}
                >
                  Connexion
                </Button>
                <Button 
                  variant="gradient" 
                  onClick={() => handleAuthClick('register')}
                >
                  Inscription
                </Button>
              </div>
            )}

            {/* Menu mobile */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultTab={authModalTab}
      />
    </>
  );
};