
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Package, CalendarDays } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

// Mock data for orders (replace with real data from backend)
const mockOrders = [
  {
    id: 'ORD001',
    date: '2024-07-20',
    total: 150.00,
    status: 'Delivered',
    shopId: 'shop1',
    items: [
      { id: 'prod1', name: 'iPhone 15 Pro', quantity: 1, price: 1199.00 },
      { id: 'prod2', name: 'AirPods Pro', quantity: 1, price: 249.00 },
    ],
  },
  {
    id: 'ORD002',
    date: '2024-07-15',
    total: 50.00,
    status: 'Processing',
    shopId: 'shop1',
    items: [
      { id: 'prod3', name: 'USB-C Cable', quantity: 2, price: 15.00 },
    ],
  },
  {
    id: 'ORD003',
    date: '2024-07-10',
    total: 250.00,
    status: 'Delivered',
    shopId: 'shop2',
    items: [
      { id: 'prod4', name: 'Running Shoes', quantity: 1, price: 100.00 },
      { id: 'prod5', name: 'Sport Socks', quantity: 3, price: 10.00 },
    ],
  },
];

export const ShopOrders = () => {
  const { user } = useAuthStore();

  // Filter orders based on the shops owned by the current user
  const userShopIds = user?.shops?.map(shop => shop.id) || [];
  const filteredOrders = mockOrders.filter(order => userShopIds.includes(order.shopId));

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Gestion des commandes</h1>
            <p className="text-muted-foreground">Gérez les commandes de vos boutiques</p>
          </div>
          <Link to="/backoffice">
            <Button variant="outline">Retour au Backoffice</Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Commandes de mes boutiques</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <div key={order.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Commande #{order.id} - Boutique: {mockShops.find(s => s.id === order.shopId)?.name}</h4>
                      <Badge variant="secondary">{order.status}</Badge>
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
                    <Button variant="outline" size="sm" className="mt-4">Voir les détails</Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">Aucune commande pour vos boutiques.</h3>
                  <p>Les commandes passées sur vos boutiques apparaîtront ici.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Mock shops data (should ideally come from a shared source or authStore)
const mockShops = [
  {
    id: 'shop1',
    name: 'Ma Boutique Mode',
  },
  {
    id: 'shop2',
    name: 'Sport & Style',
  },
];
