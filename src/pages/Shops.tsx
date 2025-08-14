import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Store, RefreshCw, AlertCircle } from 'lucide-react';
import { useShopStore } from '@/stores/shopStore';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

export const Shops = () => {
  const { t } = useTranslation();
  const [shopPage, setShopPage] = useState(1);
  const SHOP_LIMIT = 9; // Number of shops per page

  const { fetchShops, shops, isLoading: isLoadingShops, error: shopsError, currentPage: currentShopPage, totalPages: totalShopPages, totalShops: shopsCount } = useShopStore();

  useEffect(() => {
    fetchShops({ page: shopPage, limit: SHOP_LIMIT });
  }, [shopPage, fetchShops]);

  const handleShopPageChange = (page: number) => {
    setShopPage(page);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Toutes nos boutiques</h1>
            <p className="text-muted-foreground">Découvrez les vendeurs de notre plateforme</p>
          </div>
          <Link to="/">
            <Button variant="outline">Retour à la marketplace</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoadingShops ? (
            Array.from({ length: SHOP_LIMIT }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-3" />
                  <Skeleton className="h-4 w-1/2 mb-3" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : shopsError ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>{shopsError}</span>
                <Button variant="outline" size="sm" onClick={() => fetchShops({ page: shopPage, limit: SHOP_LIMIT })}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {t('retry')}
                </Button>
              </AlertDescription>
            </Alert>
          ) : shops.length === 0 ? (
            <div className="text-center py-12">
              <Store className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t('no_shops_available')}</h3>
              <p className="text-muted-foreground">{t('check_back_later_for_new_shops')}</p>
            </div>
          ) : (
            shops.map((shop) => (
              <Card key={shop.id} className="overflow-hidden hover:shadow-hover transition-all duration-300">
                <div className="h-48 overflow-hidden">
                  <img
                    src={shop.image}
                    alt={shop.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg">{shop.name}</h3>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium ml-1">{shop.rating}</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm mb-3">{shop.description}</p>
                  <div className="flex items-center text-sm text-muted-foreground mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    {shop.location}
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{shop.productsCount} {t('products')}</Badge>
                    <Link to={`/shops/${shop.id}`}>
                      <Button size="sm" variant="outline">{t('visit')}</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
        {totalShopPages > 1 && (
          <div className="flex justify-center mt-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious onClick={() => handleShopPageChange(currentShopPage - 1)} />
                </PaginationItem>
                {[...Array(totalShopPages)].map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink isActive={i + 1 === currentShopPage} onClick={() => handleShopPageChange(i + 1)}>
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext onClick={() => handleShopPageChange(currentShopPage + 1)} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
};
