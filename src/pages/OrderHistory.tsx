
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Package, CalendarDays } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/stores/authStore';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

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
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  items: OrderItem[];
  shippingAddress?: {
    street: string;
    city: string;
    zipCode: string;
    country: string;
  };
  paymentMethod?: string;
  trackingNumber?: string;
  estimatedDeliveryDate?: string;
}

export const OrderHistory = () => {
  const { token } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/orders/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };

    if (token) {
      fetchOrders();
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">{t('order_history')}</h1>
            <p className="text-muted-foreground">{t('order_history_description')}</p>
          </div>
          <Link to="/account">
            <Button variant="outline">{t('back_to_account')}</Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('my_orders')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <div key={order.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{t('order_number')} #{order.id}</h4>
                      <Badge variant="secondary">{order.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center mb-2">
                      <CalendarDays className="w-4 h-4 mr-1" />
                      {order.date}
                    </p>
                    {order.trackingNumber && (
                      <p className="text-sm text-muted-foreground flex items-center mb-2">
                        {t('tracking_number')}: {order.trackingNumber}
                      </p>
                    )}
                    {order.estimatedDeliveryDate && (
                      <p className="text-sm text-muted-foreground flex items-center mb-2">
                        {t('estimated_delivery')}: {order.estimatedDeliveryDate}
                      </p>
                    )}
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
                  <h3 className="text-lg font-semibold mb-2">{t('no_orders_found')}</h3>
                  <p>{t('no_orders_found_description')}</p>
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
