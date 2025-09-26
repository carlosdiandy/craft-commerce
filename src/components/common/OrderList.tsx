import { useSupabaseOrderStore } from '@/stores/supabase/orderStore';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

interface OrderListProps {
  shopId: string;
}

export const OrderList = ({ shopId }: OrderListProps) => {
  const { orders, fetchOrdersByShop } = useSupabaseOrderStore();
  const { t } = useTranslation();

  useEffect(() => {
    fetchOrdersByShop(shopId);
  }, [shopId, fetchOrdersByShop]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('orders')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="flex justify-between items-center">
              <div>
                <p className="font-semibold">{t('order')} #{order.id}</p>
                <p className="text-sm text-muted-foreground">{order.created_at}</p>
              </div>
              <div>
                <Link to={`/account/orders/${order.id}`}>
                  <Button variant="outline">{t('view_details')}</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};