import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Package, CalendarDays, MapPin, CreditCard } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';

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
  shippingAddress: {
    street: string;
    city: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;
  trackingNumber?: string;
  estimatedDeliveryDate?: string;
}

export const OrderDetail = () => {
  const { orderId } = useParams();
  const { t } = useTranslation();
  const { token } = useAuthStore();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrder(response.data);
      } catch (error) {
        console.error("Failed to fetch order:", error);
      }
    };

    if (orderId && token) {
      fetchOrder();
    }
  }, [orderId, token]);

  if (!order) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">{t('order_not_found')}</h1>
          <p className="text-muted-foreground mb-6">{t('order_not_found_description')}</p>
          <Link to="/order-history">
            <Button>{t('back_to_order_history')}</Button>
          </Link>
        </div>
      </div>
    );
  }

  const getStatusBadgeVariant = (status: Order['status']) => {
    switch (status) {
      case 'Delivered':
        return 'default';
      case 'Shipped':
        return 'secondary';
      case 'Processing':
        return 'outline';
      case 'Cancelled':
        return 'destructive';
      case 'Pending':
      default:
        return 'secondary';
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">{t('order_details')} #{order.id}</h1>
            <p className="text-muted-foreground">{t('order_details_description')}</p>
          </div>
          <Link to="/order-history">
            <Button variant="outline">{t('back_to_order_history')}</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Package className="w-5 h-5" /> {t('order_summary')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map(item => (
                    <div key={item.id} className="flex items-center gap-4">
                      <img src={item.image || 'https://via.placeholder.com/80'} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
                      <div className="flex-grow">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">{t('quantity')}: {item.quantity}</p>
                        <p className="font-semibold">{item.price}€</p>
                      </div>
                      <span className="font-bold">{(item.quantity * item.price).toFixed(2)}€</span>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between items-center font-bold text-lg">
                    <span>{t('total')}:</span>
                    <span>{order.total.toFixed(2)}€</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><MapPin className="w-5 h-5" /> {t('shipping_information')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>{order.shippingAddress.street}</p>
                <p>{order.shippingAddress.zipCode} {order.shippingAddress.city}</p>
                <p>{order.shippingAddress.country}</p>
                {order.trackingNumber && (
                  <p className="flex items-center gap-1 text-sm text-muted-foreground">
                    {t('tracking_number')}: <span className="font-medium">{order.trackingNumber}</span>
                  </p>
                )}
                {order.estimatedDeliveryDate && (
                  <p className="flex items-center gap-1 text-sm text-muted-foreground">
                    {t('estimated_delivery')}: <span className="font-medium">{order.estimatedDeliveryDate}</span>
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><CalendarDays className="w-5 h-5" /> {t('order_status')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">{t('order_date')}: {order.date}</p>
                <div className="flex items-center gap-2">
                  <Badge variant={getStatusBadgeVariant(order.status)}>{t(order.status.toLowerCase())}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><CreditCard className="w-5 h-5" /> {t('payment_information')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{t('payment_method')}: {order.paymentMethod}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
