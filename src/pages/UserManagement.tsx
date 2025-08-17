import { apiGet } from '@/services/apiService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuthStore, User, UserRole, ShopOwnerStatus } from '@/stores/authStore';
import { toast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { Users, Edit, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react'; // Added useState, useEffect
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'; // Added Dialog components
import { Input } from '@/components/ui/input'; // Added Input
import { Label } from '@/components/ui/label'; // Added Label
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'; // Added Select components
import { Checkbox } from '@/components/ui/checkbox'; // Added Checkbox
import { Permission, UserRoleEnum } from '@/types/api';



export const UserManagement = () => {
  const { fetchAllUsers, users, deleteUser, adminUpdateUser, isLoading, allPermissions, fetchAllPermissions } = useAuthStore(); // Modified
  const { t } = useTranslation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUserToEdit, setCurrentUserToEdit] = useState<User | null>(null);
  const [editedUser, setEditedUser] = useState<Partial<User>>({});

  useEffect(() => {
    fetchAllUsers(); // Fetch all users on component mount
    fetchAllPermissions(); // Fetch all permissions on component mount
  }, [fetchAllUsers, fetchAllPermissions]);

  const handleEditUser = async (userToEdit: User) => {
    setCurrentUserToEdit(userToEdit);
    setEditedUser({ ...userToEdit }); // Initialize editedUser with current user data

    setEditedUser({ ...userToEdit, globalPermissions: userToEdit.globalPermissions || [] }); // Initialize editedUser with current user data and its globalPermissions
    setIsModalOpen(true);
  };

  const handleModalInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = async (value: UserRole) => {
    setEditedUser((prev) => ({ ...prev, role: value }));


  };

  const handlePermissionChange = (permission: Permission, checked: boolean) => {
    setEditedUser((prev) => {
      const currentPermissions = prev.globalPermissions || [];
      if (checked) {
        // Add the full permission object
        return { ...prev, globalPermissions: [...currentPermissions, permission] };
      } else {
        // Filter by permission.id to remove the object
        return {
          ...prev,
          globalPermissions: currentPermissions.filter((p) => p.id !== permission.id),
        };
      }
    });
  };

  const handleSaveUser = async () => {
    if (currentUserToEdit?.id && editedUser) {
      const response = await adminUpdateUser(currentUserToEdit.id, editedUser);
      if (response.success) {
        toast({
          title: t('user_updated_success'),
          description: t('user_updated_success_description', { userName: editedUser.name || currentUserToEdit.name }),
        });
        setIsModalOpen(false);
        setCurrentUserToEdit(null);
        setEditedUser({});
        fetchAllUsers(); // Refresh the list
      } else {
        toast({
          title: t('user_updated_error'),
          description: response.error,
          variant: 'destructive',
        });
      }
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm(t('confirm_delete_user'))) {
      const response = await deleteUser(userId);
      if (response.success) {
        toast({
          title: t('user_deleted_success'),
          description: t('user_deleted_success_description'),
        });
      } else {
        toast({
          title: t('user_deleted_error'),
          description: response.error,
          variant: 'destructive',
        });
      }
    }
  };

  const getStatusVariant = (status: ShopOwnerStatus | undefined) => {
    switch (status) {
      case 'approved': return 'default';
      case 'pending': return 'destructive';
      case 'rejected': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container px-4 py-6 lg:py-8">
        <div className="mb-6 lg:mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">{t('user_management')}</h1>
            <p className="text-muted-foreground">{t('manage_platform_users')}</p>
          </div>
          <Link to="/admin">
            <Button variant="outline" className="w-fit">
              {t('back_to_admin_dashboard')}
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <CardTitle className="text-lg lg:text-xl">{t('all_users')}</CardTitle>
              <Badge variant="outline" className="w-fit">
                {users.length} {t('user_count', { count: users.length })}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.length > 0 ? (
                users.map((user) => (
                  <div key={user.id} className="flex flex-col lg:flex-row lg:items-center lg:justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors gap-3">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{user.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {t(`role_${user.role.toLowerCase()}`)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      {user.role === UserRoleEnum.ROLE_SHOP_OWNER && (
                        <Badge variant={getStatusVariant(user.shopOwnerStatus)} className="text-xs">
                          {t('status')}: {t(`shop_owner_status_${user.shopOwnerStatus}`)}
                        </Badge>
                      )}
                      {user.globalPermissions && user.globalPermissions.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {user.globalPermissions.map((perm) => (
                            <Badge key={perm.id} variant="secondary" className="text-xs">
                              {perm.name}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 lg:flex-shrink-0">
                      <Button variant="outline" size="sm" onClick={() => handleEditUser(user)}>
                        <Edit className="w-4 h-4 mr-2" />
                        {t('edit')}
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteUser(user.id)}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        {t('delete')}
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 lg:py-12 text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <h3 className="font-medium text-lg mb-2">{t('no_users_found')}</h3>
                  <p className="text-sm">{t('no_users_found_description')}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t('edit_user')}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                {t('name')}
              </Label>
              <Input
                id="name"
                name="name"
                value={editedUser.name || ''}
                onChange={handleModalInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                {t('email')}
              </Label>
              <Input
                id="email"
                name="email"
                value={editedUser.email || ''}
                onChange={handleModalInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                {t('role')}
              </Label>
              <Select value={editedUser.role} onValueChange={handleRoleChange}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder={t('select_role')} />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(UserRoleEnum).map((role) => (
                    <SelectItem key={role} value={role}>
                      {t(`${role.toLowerCase()}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right mt-2">
                {t('global_permissions')}
              </Label>
              <div className="col-span-3 space-y-2">
                {allPermissions.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase())).map((permission) => (
                  <div key={permission.name} className="flex items-center space-x-2">
                    <Checkbox
                      id={permission.name}
                      checked={editedUser.globalPermissions?.some(p => p.id === permission.id) || false}
                      onCheckedChange={(checked) =>
                        handlePermissionChange(permission, checked as boolean)
                      }
                    />
                    <Label htmlFor={permission.name}>{permission.name}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              {t('cancel')}
            </Button>
            <Button onClick={handleSaveUser} disabled={isLoading}>
              {isLoading ? t('saving') : t('save_changes')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};