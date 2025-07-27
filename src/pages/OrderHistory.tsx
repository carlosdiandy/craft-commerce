
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Package, CalendarDays } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Mock data for orders (replace with real data from backend)
const mockOrders = [
  {
    id: 'ORD001',
    date: '2024-07-20',
    total: 150.00,
    status: 'Delivered',
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
    items: [
      { id: 'prod3', name: 'USB-C Cable', quantity: 2, price: 15.00 },
    ],
  },
];

export const OrderHistory = () => {
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Historique des commandes</h1>
            <p className="text-muted-foreground">Retrouvez toutes vos commandes passées</p>
          </div>
          <Link to="/account">
            <Button variant="outline">Retour au compte</Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Mes commandes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockOrders.length > 0 ? (
                mockOrders.map((order) => (
                  <div key={order.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Commande #{order.id}</h4>
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
                  <h3 className="text-lg font-semibold mb-2">Aucune commande trouvée</h3>
                  <p>Vous n'avez pas encore passé de commande.</p>
                  <Link to="/">
                    <Button className="mt-4">Commencer mes achats</Button>
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
