
import { useSupabaseShopStore } from '@/stores/supabase/shopStore';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ShopUser } from '@/types/api';

interface UserListProps {
  shopId: string;
}

export const UserList = ({ shopId }: UserListProps) => {
  const { fetchShopUsers, deleteShopUser } = useSupabaseShopStore();
  const [users, setUsers] = useState<ShopUser[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    const loadUsers = async () => {
      const response = await fetchShopUsers(shopId);
      // Transform Supabase response to ShopUser
      const transformedUsers: ShopUser[] = response.map((user: any) => ({
        id: user.id,
        name: user.profiles?.first_name && user.profiles?.last_name 
          ? `${user.profiles.first_name} ${user.profiles.last_name}`
          : user.profiles?.email || 'Unknown User',
        email: user.profiles?.email || '',
        role: user.role as 'SHOP_ADMIN' | 'SHOP_EMPLOYEE',
        shopId: user.shop_id,
        createdAt: user.created_at,
        permissions: user.permissions || []
      }));
      setUsers(transformedUsers);
    };
    loadUsers();
  }, [shopId, fetchShopUsers]);

  const handleDeleteUser = async (userId: string) => {
    await deleteShopUser(shopId, userId);
    setUsers(users.filter(user => user.id !== userId));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{t('shop_users')}</CardTitle>
          {/* Add user button will be implemented later */}
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            {t('add_user')}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.id} className="flex justify-between items-center">
              <div>
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <div>
                <Button variant="destructive" onClick={() => handleDeleteUser(user.id)}>
                  {t('delete')}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
