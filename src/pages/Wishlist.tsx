import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { HeartCrack, ShoppingCart } from 'lucide-react';
import { useWishlistStore } from '@/stores/wishlistStore';
import { useCartStore } from '@/stores/cartStore';
import { toast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

export const Wishlist = () => {
  const { t } = useTranslation();
  const { items, removeItem, updateQuantity } = useWishlistStore();
  const { addItem: addCartItem } = useCartStore();

  const handleMoveToCart = (item: any) => {
    addCartItem({ ...item, id: item.productId }, item.quantity, item.selectedVariants);
    removeItem(item.productId, item.selectedVariants);
    toast({
      title: t('moved_to_cart'),
      description: t('product_moved_to_cart', { productName: item.productName }),
    });
  };

  const handleRemoveItem = (productId: string, variants?: Record<string, string>) => {
    removeItem(productId, variants);
    toast({
      title: t('removed_from_wishlist'),
      description: t('product_removed_from_wishlist'),
    });
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">{t('my_wishlist')}</h1>
            <p className="text-muted-foreground">{t('wishlist_description')}</p>
          </div>
          <Link to="/">
            <Button variant="outline">{t('continue_shopping')}</Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('wishlist_items')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {items.length > 0 ? (
                items.map((item) => (
                  <div key={item.productId + JSON.stringify(item.selectedVariants)} className="flex items-center gap-4 p-4 border rounded-lg">
                    <img src={item.productImage} alt={item.productName} className="w-20 h-20 object-cover rounded-md" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{item.productName}</h3>
                      {item.selectedVariants && (
                        <p className="text-sm text-muted-foreground">
                          {Object.entries(item.selectedVariants).map(([key, value]) => (
                            <span key={key} className="capitalize mr-2">{key}: {value}</span>
                          ))}
                        </p>
                      )}
                      <p className="text-muted-foreground">{item.price}€</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => updateQuantity(item.productId, item.quantity - 1, item.selectedVariants)}>-</Button>
                      <span>{item.quantity}</span>
                      <Button size="sm" variant="outline" onClick={() => updateQuantity(item.productId, item.quantity + 1, item.selectedVariants)}>+</Button>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleMoveToCart(item)}>
                      <ShoppingCart className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.productId, item.selectedVariants)}>
                      <HeartCrack className="w-5 h-5" />
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <HeartCrack className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">{t('empty_wishlist')}</h3>
                  <p>{t('empty_wishlist_description')}</p>
                  <Link to="/">
                    <Button className="mt-4">{t('start_shopping')}</Button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};