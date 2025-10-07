import { useState, useEffect } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuthStore } from '@/stores/authStore'; // Keep useAuthStore for user.shops
import { useShopStore } from '@/stores/shopStore'; // Added useShopStore
import { Permission, ShopUser, ShopUserRole, ShopUserRoleEnum } from '@/types/api';
import { toast } from '@/hooks/use-toast';
import { Link, useParams } from 'react-router-dom'; // Added useParams
import { Checkbox } from '@/components/ui/checkbox'; // Added Checkbox
import { Badge } from '@/components/ui/badge'; // Added Badge
import { useTranslation } from 'react-i18next'; // Added useTranslation

export const ShopUserManagement = () => {
  const { user, allPermissions, fetchAllPermissions, updateShopUserPermissions } = useAuthStore(); // To get user.shops and permissions
  const { fetchShopUsers, addShopUser, updateShopUser, deleteShopUser, isLoading } = useShopStore(); // Modified
  const { t } = useTranslation();
  const { shopId: paramShopId } = useParams<{ shopId: string }>(); // Get shopId from URL

  const [selectedShopId, setSelectedShopId] = useState<string | null>(paramShopId || null);
  const [editingShopUser, setEditingShopUser] = useState<ShopUser | null>(null);
  const [shopUsers, setLocalShopUsers] = useState<ShopUser[]>([]); // Local state for shop users
  // Hardcoded list of shop-specific permissions for demonstration
  const shopPermissionsList = [
    'product:read',
    'product:write',
    'product:delete',
    'order:read',
    'order:update_status',
    'shop_user:read',
    'shop_user:manage',
  ];



  useEffect(() => {
    fetchAllPermissions(); // Fetch all permissions on component mount
    if (selectedShopId) {
      const fetchUsers = async () => {
        const response = await fetchShopUsers(selectedShopId);
        if (response.success && response.data) {
          setLocalShopUsers(response.data.map(su => ({
            id: su.userId, // Use userId as id for consistency with User type
            name: su.name || '',
            email: su.email || '',
            role: su.role as ShopUserRole,
            shopId: su.shopId,
            createdAt: su.createdAt,
            permissions: su.permissions || [],
          })));
        } else {
          toast({
            title: t('fetch_shop_users_error'),
            description: response.error,
            variant: 'destructive',
          });
        }
      };
      fetchUsers();
    } else {
      setLocalShopUsers([]); // Clear users if no shop selected
    }
  }, [selectedShopId, fetchShopUsers, t, fetchAllPermissions]);

  const handleAddShopUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedShopId) return;

    const formData = new FormData(e.currentTarget);
    const newShopUser: Omit<ShopUser, 'id' | 'createdAt'> = {
      name: formData.get('userName') as string,
      email: formData.get('userEmail') as string,
      role: formData.get('userRole') as ShopUserRole,
      shopId: selectedShopId,
      permissions: editingShopUser?.permissions || [], // Use permissions from state
    };

    const response = await addShopUser(selectedShopId, newShopUser);
    if (response.success) {
      toast({
        title: t('shop_user_added_success'),
        description: t('shop_user_added_success_description', { userName: newShopUser.name }),
      });
      e.currentTarget.reset();
      setEditingShopUser(null); // Clear form
      // Re-fetch users to update the list
      const updatedResponse = await fetchShopUsers(selectedShopId);
      if (updatedResponse.success && updatedResponse.data) {
        setLocalShopUsers(updatedResponse.data.map(su => ({
          id: su.userId,
          name: su.name || '',
          email: su.email || '',
          role: su.role as ShopUserRole,
          shopId: su.shopId,
          createdAt: su.createdAt,
          permissions: su.permissions || [],
        })));
      }
    } else {
      toast({
        title: t('shop_user_added_error'),
        description: response.error,
        variant: 'destructive',
      });
    }
  };

  const handleUpdateShopUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedShopId || !editingShopUser) return;

    const formData = new FormData(e.currentTarget);
    const updatedShopUser: Partial<ShopUser> = {
      name: formData.get('userName') as string,
      email: formData.get('userEmail') as string,
      role: formData.get('userRole') as ShopUserRole,
    };

    // Update user details (name, email, role) via shopStore
    const userDetailsResponse = await updateShopUser(selectedShopId, editingShopUser.id, updatedShopUser);

    // Update permissions via authStore
    const permissionsResponse = await updateShopUserPermissions(selectedShopId, editingShopUser.id, editingShopUser.permissions || []);

    if (userDetailsResponse.success && permissionsResponse.success) {
      toast({
        title: t('shop_user_updated_success'),
        description: t('shop_user_updated_success_description', { userName: editingShopUser.name }),
      });
      setEditingShopUser(null); // Clear form
      // Re-fetch users to update the list
      const updatedResponse = await fetchShopUsers(selectedShopId);
      if (updatedResponse.success && updatedResponse.data) {
        setLocalShopUsers(updatedResponse.data.map(su => ({
          id: su.userId,
          name: su.name || '',
          email: su.email || '',
          role: su.role as ShopUserRole,
          shopId: su.shopId,
          createdAt: su.createdAt,
          permissions: su.permissions || [],
        })));
      }
    } else {
      toast({
        title: t('shop_user_updated_error'),
        description: userDetailsResponse.error || permissionsResponse.error,
        variant: 'destructive',
      });
    }
  };

  const handleDeleteShopUser = async (shopUserId: string) => {
    if (!selectedShopId) return;
    if (confirm(t('confirm_delete_shop_user'))) {
      const response = await deleteShopUser(selectedShopId, shopUserId);
      if (response.success) {
        toast({
          title: t('shop_user_deleted_success'),
          description: t('shop_user_deleted_success_description'),
        });
        // Re-fetch users to update the list
        const updatedResponse = await fetchShopUsers(selectedShopId);
        if (updatedResponse.success && updatedResponse.data) {
          setLocalShopUsers(updatedResponse.data.map(su => ({
            id: su.userId,
            name: su.name || '',
            email: su.email || '',
            role: su.role as ShopUserRole,
            shopId: su.shopId,
            createdAt: su.createdAt,
            permissions: su.permissions || [],
          })));
        }
      } else {
        toast({
          title: t('shop_user_deleted_error'),
          description: response.error,
          variant: 'destructive',
        });
      }
    }
  };

  const handlePermissionChange = (permission: string, checked: boolean) => {
    setEditingShopUser((prev) => {
      if (!prev) return null;
      const currentPermissions = prev.permissions || [];
      if (checked) {
        return { ...prev, permissions: [...currentPermissions, permission] };
      } else {
        return {
          ...prev,
          permissions: currentPermissions.filter((p) => p !== permission),
        };
      }
    });
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">{t('manage_shop_users')}</h1>
            <p className="text-muted-foreground">{t('add_manage_shop_users_description')}</p>
          </div>
          <Link to="/backoffice">
            <Button variant="outline">{t('back_to_backoffice')}</Button>
          </Link>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>{t('select_shop')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedShopId || ''} onValueChange={setSelectedShopId}>
                <SelectTrigger className="w-full lg:w-1/3">
                  <SelectValue placeholder={t('select_a_shop')} />
                </SelectTrigger>
                <SelectContent>
                  {user?.shops?.map((shop) => (
                    <SelectItem key={shop.id} value={shop.id}>
                      {shop.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {selectedShopId && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>{editingShopUser ? t('edit_user') : t('add_user')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={editingShopUser ? handleUpdateShopUser : handleAddShopUser} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="userName">{t('name')}</Label>
                        <Input id="userName" name="userName" defaultValue={editingShopUser?.name || ''} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="userEmail">{t('email')}</Label>
                        <Input id="userEmail" name="userEmail" type="email" defaultValue={editingShopUser?.email || ''} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="userRole">{t('role')}</Label>
                        <Select
                          value={editingShopUser?.role || ShopUserRoleEnum.ROLE_SHOP_EMPLOYEE}
                          onValueChange={async (value: ShopUserRole) => {
                            setEditingShopUser(prev => prev ? { ...prev, role: value } : null);
                            // Fetch permissions for the selected shop user role dynamically
                            try {
                              const response = await apiGet<Permission[]>(`/permissions/roles/${value.toLowerCase().replace('role_', '')}`);
                              if (response.success && response.data) {
                                setEditingShopUser(prev => ({
                                  ...prev!,
                                  permissions: response.data.map(p => p.name),
                                }));
                              } else {
                                toast({
                                  title: "Failed to fetch role permissions",
                                  description: response.error || "An unknown error occurred.",
                                  variant: "destructive",
                                });
                              }
                            } catch (error) {
                              toast({
                                title: "Error fetching role permissions",
                                description: "An error occurred while fetching permissions for the selected role.",
                                variant: "destructive",
                              });
                            }
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={ShopUserRoleEnum.ROLE_SHOP_ADMIN}>{t('shop_admin')}</SelectItem>
                            <SelectItem value={ShopUserRoleEnum.ROLE_SHOP_EMPLOYEE}>{t('shop_employee')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>{t('permissions')}</Label>
                        <div className="grid grid-cols-1 gap-2">
                          {allPermissions.map((permission) => (
                            <div key={permission.name} className="flex items-center space-x-2">
                              <Checkbox
                                id={permission.name}
                                checked={editingShopUser?.permissions?.includes(permission.name) || false}
                                onCheckedChange={(checked) =>
                                  handlePermissionChange(permission.name, checked as boolean)
                                }
                              />
                              <Label htmlFor={permission.name}>{permission.name}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? t('saving') : (editingShopUser ? t('update') : t('add_user_button'))}
                      </Button>
                      {editingShopUser && (
                        <Button type="button" variant="outline" onClick={() => setEditingShopUser(null)} disabled={isLoading}>
                          {t('cancel')}
                        </Button>
                      )}
                    </form>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('shop_users')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {shopUsers && shopUsers.length > 0 ? (
                        shopUsers.map((shopUser) => (
                          <div key={shopUser.id} className="flex flex-col lg:flex-row lg:items-center lg:justify-between p-4 border rounded-lg">
                            <div className="space-y-1 flex-1">
                              <h4 className="font-medium">{shopUser.name} ({t(`role_${shopUser.role.toLowerCase()}`)})</h4>
                              <p className="text-sm text-muted-foreground">{shopUser.email}</p>
                              {shopUser.permissions && shopUser.permissions.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {shopUser.permissions.map((perm) => (
                                    <Badge key={perm} variant="secondary" className="text-xs">
                                      {perm}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="flex gap-2 lg:flex-shrink-0">
                              <Button variant="outline" size="sm" onClick={() => setEditingShopUser(shopUser)} disabled={isLoading}>
                                {t('edit')}
                              </Button>
                              <Button variant="destructive" size="sm" onClick={() => handleDeleteShopUser(shopUser.id)} disabled={isLoading}>
                                {t('delete')}
                              </Button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground text-center">{t('no_shop_users')}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
