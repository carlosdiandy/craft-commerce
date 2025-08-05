import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Package } from 'lucide-react';
import { AuthModal } from '@/components/auth/AuthModal';
import { MobileMenu } from './MobileMenu';
import { SearchBar } from './SearchBar';
import { UserMenu } from './UserMenu';
import { ShoppingActions } from './ShoppingActions';
import { useAuthStore } from '@/stores/authStore';
import { NotificationBell } from './NotificationBell';

export const Header = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');
  const location = useLocation();
  const { user, isAuthenticated } = useAuthStore();

  const handleAuthClick = (tab: 'login' | 'register') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const isMarketplace = location.pathname === '/' ||
    location.pathname.startsWith('/products') ||
    location.pathname.startsWith('/shops');

  const navLinks = [
    { to: '/', label: 'Accueil' },
    { to: '/products', label: 'Produits' },
    { to: '/shops', label: 'Boutiques' },
    { to: '/about', label: 'À Propos' },
  ];

  if (isAuthenticated && user) {
    if (user.role === 'ROLE_ADMIN') {
      navLinks.push({ to: '/admin', label: 'Dashboard' });
    }
    if (user.role === 'ROLE_SHOP_OWNER') {
      navLinks.push({ to: '/backoffice', label: 'Backoffice' });
    }
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl bg-gradient-primary bg-clip-text text-transparent hidden sm:block">
              MarketPlace
            </span>
            <span className="font-bold text-lg bg-gradient-primary bg-clip-text text-transparent sm:hidden">
              MP
            </span>
          </Link>

          {/* Navigation centrale - uniquement pour marketplace */}
          {isMarketplace && (
            <nav className="hidden lg:flex items-center space-x-6">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}

          {/* Barre de recherche - uniquement pour marketplace */}
          {isMarketplace && (
            <div className="hidden md:block flex-1 max-w-md mx-4">
              <SearchBar
                placeholder="Rechercher des produits..."
                className="w-full"
              />
            </div>
          )}

          {/* Actions à droite */}
          <div className="flex items-center space-x-2">
            {/* Panier et favoris - uniquement pour marketplace */}

            {isMarketplace && (
              <div className="hidden sm:block">
                <ShoppingActions />
                <NotificationBell />
              </div>
            )}

            {/* Menu utilisateur */}
            <div className="hidden md:block">
              <UserMenu onAuthClick={handleAuthClick} />
            </div>

            {/* Menu mobile */}
            <MobileMenu />
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