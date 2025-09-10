import { useEffect } from 'react';
import { useShopStore } from '@/stores/shopStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';

export const AdminShopValidation = () => {
  const { t } = useTranslation();
  const { shops, fetchShops, updateShopStatus } = useShopStore();

  useEffect(() => {
    fetchShops(false);
  }, [fetchShops]);

  const handleUpdateStatus = async (shopId: string, status: 'active' | 'rejected') => {
    await updateShopStatus(shopId, status);
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>{t('admin_shop_validation')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {shops.map((shop) => (
              <div key={shop.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="text-lg font-semibold">{shop.name}</h3>
                  <p className="text-sm text-muted-foreground">{shop.description}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge variant={shop.status === 'pending' ? 'secondary' : 'default'}>
                    {t(`shop_status_${shop.status}`)}
                  </Badge>
                  {shop.status === 'pending' && (
                    <>
                      <Button onClick={() => handleUpdateStatus(shop.id, 'active')} size="sm">
                        {t('approve')}
                      </Button>
                      <Button onClick={() => handleUpdateStatus(shop.id, 'rejected')} size="sm" variant="destructive">
                        {t('reject')}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};