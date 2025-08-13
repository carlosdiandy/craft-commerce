
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Store, Edit } from 'lucide-react';
import { useState, useEffect } from 'react';
import { apiGet } from '@/services/apiService';
import { useAuthStore, User } from '@/stores/authStore';

interface Shop {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  ownerName: string;
  status: 'active' | 'suspended';
  createdAt: string;
  owner: User;
}

export const AdminShopOverview = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const { accessToken } = useAuthStore();

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await apiGet<Shop[]>("/shops/");
        setShops(response.data);
      } catch (error) {
        console.error("Failed to fetch shops:", error);
      }
    };

    if (accessToken) {
      fetchShops();
    }
  }, [accessToken]);

  const handleEditShop = (shopId: string) => {
    console.log('Edit shop:', shopId);
    // In a real app, this would navigate to a shop edit page or open a modal
  };

  const handleChangeShopStatus = (shopId: string, currentStatus: string) => {
    console.log(`Change status for shop ${shopId} from ${currentStatus}`);
    // In a real app, this would call an API to update the shop status
    alert(`Simulating status change for shop ${shopId}`);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Vue d'overview des boutiques</h1>
            <p className="text-muted-foreground">Gérez toutes les boutiques de la plateforme</p>
          </div>
          <Link to="/admin">
            <Button variant="outline">Retour au Dashboard Admin</Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Toutes les boutiques</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {shops.map((shop) => (
                <div key={shop.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <h4 className="font-medium">{shop.name}</h4>
                    <p className="text-sm text-muted-foreground">Propriétaire: {shop.ownerName}</p>
                    <Badge variant={shop.status === 'active' ? 'default' : 'destructive'}>
                      Statut: {shop.status}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditShop(shop.id)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Modifier
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleChangeShopStatus(shop.id, shop.status)}
                    >
                      Changer statut
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
