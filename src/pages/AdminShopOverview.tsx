
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Store, Edit } from 'lucide-react';
import { useState, useEffect } from 'react';
import { shopService } from '@/services/supabase/shopService';
import { useAuthStore, User, UserRole } from '@/stores/authStore';
import { PaginatedResponse, ShopResponse } from '@/types/api';

interface Shop {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  ownerName: string;
  status: 'active' | 'suspended' | 'validated' | 'pending';
  createdAt: string;
  owner: User;
}

export const AdminShopOverview = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const { accessToken } = useAuthStore();

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await shopService.getAllShops();
        // Transform Supabase data to component interface
        const transformedShops: Shop[] = response.data?.map(shop => {
          const profile = shop.profiles as any;
          return {
            id: shop.id,
            name: shop.name,
            description: shop.description || '',
            ownerId: shop.owner_id,
            ownerName: profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Unknown Owner' : 'Unknown Owner',
            status: shop.is_validated ? 'validated' : 'pending',
            createdAt: shop.created_at,
            owner: {
              id: shop.owner_id,
              name: profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : 'Unknown',
              firstName: profile?.first_name || '',
              lastName: profile?.last_name || '',
              email: profile?.email || '',
              role: 'shopOwner' as UserRole,
              createdAt: shop.created_at,
              phoneNumber: profile?.phone || '',
              avatar: profile?.avatar_url || ''
            } as User
          };
        }) || [];
        setShops(transformedShops);
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
                    <Badge variant={shop.status === 'validated' || shop.status === 'active' ? 'default' : 'destructive'}>
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
