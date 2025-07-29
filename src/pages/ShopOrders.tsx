
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Package, CalendarDays } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

interface Order {
  id: string;
  date: string;
  total: number;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  shopId: string;
  items: OrderItem[];
  trackingNumber?: string;
  estimatedDeliveryDate?: string;
}

export const ShopOrders = () => {
  const { user, token } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const { t } = useTranslation();

  const fetchShopOrders = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/orders/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Filter orders based on the shops owned by the current user
      const userShopIds = user?.shops?.map(shop => shop.id) || [];
      const filteredOrders = response.data.filter((order: Order) => userShopIds.includes(order.shopId));
      setOrders(filteredOrders);
    } catch (error) {
      console.error("Failed to fetch shop orders:", error);
    }
  };

  useEffect(() => {
    if (user && token) {
      fetchShopOrders();
    }
  }, [user, token]);

  const handleOrderUpdate = async (orderId: string, newStatus: Order['status'], trackingNumber: string | null, estimatedDeliveryDate: string | null) => {
    try {
      await axios.put(`http://localhost:8080/api/orders/${orderId}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (trackingNumber !== null || estimatedDeliveryDate !== null) {
        await axios.put(`http://localhost:8080/api/orders/${orderId}/tracking`, {
          trackingNumber,
          estimatedDeliveryDate,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      fetchShopOrders(); // Re-fetch orders to update UI
    } catch (error) {
      console.error("Failed to update order:", error);
    }
  };

  const getStatusBadgeVariant = (status: Order['status']) => {
    switch (status) {
      case 'DELIVERED':
        return 'default';
      case 'SHIPPED':
        return 'secondary';
      case 'PROCESSING':
        return 'outline';
      case 'CANCELLED':
        return 'destructive';
      case 'PENDING':
      default:
        return 'secondary';
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">{t('manage_orders')}</h1>
            <p className="text-muted-foreground">{t('manage_shop_orders_description')}</p>
          </div>
          <Link to="/backoffice">
            <Button variant="outline">{t('back_to_backoffice')}</Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('my_shop_orders')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <div key={order.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{t('order_number')} #{order.id} - {t('shop')}: {user?.shops?.find(s => s.id === order.shopId)?.name}</h4>
                      <Select value={order.status} onValueChange={(newStatus: Order['status']) => handleOrderUpdate(order.id, newStatus, order.trackingNumber || null, order.estimatedDeliveryDate || null)}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder={t('select_status')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PENDING">{t('status_pending')}</SelectItem>
                          <SelectItem value="PROCESSING">{t('status_processing')}</SelectItem>
                          <SelectItem value="SHIPPED">{t('status_shipped')}</SelectItem>
                          <SelectItem value="DELIVERED">{t('status_delivered')}</SelectItem>
                          <SelectItem value="CANCELLED">{t('status_cancelled')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Input
                        placeholder={t('tracking_number')}
                        value={order.trackingNumber || ''}
                        onChange={(e) => handleOrderUpdate(order.id, order.status, e.target.value, order.estimatedDeliveryDate || null)}
                        className="flex-1"
                      />
                      <Input
                        type="date"
                        placeholder={t('estimated_delivery')}
                        value={order.estimatedDeliveryDate || ''}
                        onChange={(e) => handleOrderUpdate(order.id, order.status, order.trackingNumber || null, e.target.value)}
                        className="w-[150px]"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center mb-2">
                      <CalendarDays className="w-4 h-4 mr-1" />
                      {order.date}
                    </p>
                    <p className="text-lg font-bold mb-2">Total: {order.total}€</p>
                    <div className="space-y-1 text-sm">
                      {order.items.map((item) => (
                        <p key={item.id}>{item.name} x {item.quantity} ({item.price}€)</p>
                      ))}
                    </div>
                    <Link to={`/account/orders/${order.id}`}>
                      <Button variant="outline" size="sm" className="mt-4">{t('view_details')}</Button>
                    </Link>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">{t('no_orders_for_your_shops')}</h3>
                  <p>{t('no_orders_for_your_shops_description')}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
