import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Heart } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { useWishlistStore } from '@/stores/wishlistStore';
import { useTranslation } from 'react-i18next';

export const ShoppingActions = () => {
  const { getItemsCount } = useCartStore();
  const { items: favoriteItems } = useWishlistStore();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const cartItemsCount = getItemsCount();
  const favoriteItemsCount = favoriteItems.length;

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => navigate('/wishlist')}
        title={t('my_wishlist')}
      >
        <Heart className="w-5 h-5" />
        {favoriteItemsCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs animate-pulse"
          >
            {favoriteItemsCount > 99 ? '99+' : favoriteItemsCount}
          </Badge>
        )}
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => navigate('/cart')}
        title="Mon panier"
      >
        <ShoppingCart className="w-5 h-5" />
        {cartItemsCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs animate-pulse"
          >
            {cartItemsCount > 99 ? '99+' : cartItemsCount}
          </Badge>
        )}
      </Button>
    </div>
  );
};