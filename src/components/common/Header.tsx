import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Package } from 'lucide-react';
import { AuthModal } from '@/components/auth/AuthModal';
import { MobileMenu } from './MobileMenu';
import { SearchBar } from './SearchBar';
import { UserMenu } from './UserMenu';
import { ShoppingActions } from './ShoppingActions';

export const Header = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');
  const location = useLocation();

  const handleAuthClick = (tab: 'login' | 'register') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const isMarketplace = location.pathname === '/' ||
    location.pathname.startsWith('/products') ||
    location.pathname.startsWith('/shops');

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
                to="/shops/manage"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Boutiques
              </Link>
              <Link
                to="/about"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                À Propos
              </Link>
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