
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Package } from 'lucide-react';
import { AuthModal } from '@/components/auth/AuthModal';
import { RoleBasedNav } from './RoleBasedNav';
import { MobileMenu } from './MobileMenu';
import { SearchBar } from './SearchBar';
import { UserMenu } from './UserMenu';
import { ShoppingActions } from './ShoppingActions';
import { useAuthStore } from '@/stores/authStore';
import { NotificationBell } from './NotificationBell';
import { BlackFridayBanner } from './BlackFridayBanner';
import { ElosaBrand } from './ElosaBrand';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';

export const Header = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');
  const location = useLocation();
  const { user, isAuthenticated } = useAuthStore();
  const { t } = useTranslation();

  const handleAuthClick = (tab: 'login' | 'register') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const isMarketplace = location.pathname === '/' ||
    location.pathname.startsWith('/products') ||
    location.pathname.startsWith('/shops');

  const navLinks = [
    { to: '/', label: t('products') },
    { to: '/shops', label: t('shops') },
  ];

  if (isAuthenticated && user) {
    if (user.role === 'ROLE_ADMIN') {
      navLinks.push({ to: '/admin', label: t('dashboard') });
      // navLinks.push({ to: '/admin/coupons', label: 'Coupons' });
      // navLinks.push({ to: '/admin/promotions', label: 'Promotions' });
    }
    if (user.role === 'ROLE_SHOP_OWNER') {
      navLinks.push({ to: '/backoffice', label: t('backoffice') });
    }
    // Support is available for all authenticated users
    navLinks.push({ to: '/support', label: t('support') });
  }

  return (
    <>
      <BlackFridayBanner />
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="container-responsive">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="mr-10 flex-shrink-0">
              <ElosaBrand variant="header" size="md" />
            </div>

            {/* Navigation centrale - uniquement pour marketplace */}
            {isMarketplace && (
              <nav className="hidden lg:flex items-center space-x-8">
                {navLinks.map(link => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors relative group"
                  >
                    {link.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                ))}
              </nav>
            )}

            {/* Barre de recherche - uniquement pour marketplace */}
            {isMarketplace && (
              <div className="hidden md:block flex-1 max-w-md mx-6">
                 <SearchBar
                  placeholder={t('search_products_shops')}
                  className="w-full glass-card border-0"
                />
              </div>
            )}

            {/* Actions à droite */}
            <div className="flex items-center space-x-3">
              {/* Panier et favoris - uniquement pour marketplace */}
              {isMarketplace && (
                <div className="hidden sm:flex items-center space-x-2">
                  <ShoppingActions />
                  {isAuthenticated && <NotificationBell />}
                </div>
              )}

              {/* Language Switcher */}
              <div className="hidden md:block">
                <LanguageSwitcher />
              </div>

              {/* Menu utilisateur */}
              <div className="hidden md:block">
                <UserMenu onAuthClick={handleAuthClick} />
              </div>

              {/* Menu mobile */}
              <MobileMenu />
            </div>
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
