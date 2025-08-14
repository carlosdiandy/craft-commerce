import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, RefreshCw, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Import Carousel components
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Button } from '../ui/button';
import { Shop } from '@/stores/authStore';

interface BestShopsSliderProps {
  limit?: number;
  shops: Shop[];
  isLoading: boolean;
  error: string;
}

export const BestShopsSlider: React.FC<BestShopsSliderProps> = ({ limit = 10, shops, isLoading, error }) => {
  const { t } = useTranslation();
  // const { fetchShops, shops, isLoading: isLoadingShops, error: shopsError } = useShopStore();

  // useEffect(() => {
  //   fetchShops({ page: 1, limit, isFeatured: true, sortBy: 'rating', sortOrder: 'desc' });
  // }, [fetchShops, limit]);

  if (!isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(limit)].map((_, i) => (
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
        ))}
      </div>
    );
  }

  // if (error) {
  //   return (
  //     <Alert variant="destructive">
  //       <AlertCircle className="h-4 w-4" />
  //       <AlertDescription className="flex items-center justify-between">
  //         <span>{t('failed_to_load_shops')}: {error}</span>
  //         <Button variant="outline" size="sm" onClick={() => location.reload}>
  //           <RefreshCw className="h-4 w-4 mr-2" />
  //           {t('retry')}
  //         </Button>
  //       </AlertDescription>
  //     </Alert>
  //   );
  // }

  if (shops.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2">{t('no_shops_available')}</h3>
        <p className="text-muted-foreground">{t('check_back_later_for_new_shops')}</p>
      </div>
    );
  }

  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full"
    >
      <CarouselContent className="-ml-4">
        {shops.slice(0, 10).map((shop) => (
          <CarouselItem key={shop.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
            <Card className="overflow-hidden h-full flex flex-col">
              <div className="h-48 overflow-hidden">
                <img
                  src={shop.image}
                  alt={shop.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-lg mb-1">{shop.name}</h3>
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span>{shop.rating?.toFixed(1) || 'N/A'}</span>
                  </div>
                  <p className="text-muted-foreground text-sm line-clamp-2">{shop.description}</p>
                </div>
                <div className="mt-4">
                  <Link to={`/shops/${shop.id}`}>
                    <Button size="sm" variant="outline" className="w-full">
                      {t('visit_shop')}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};
