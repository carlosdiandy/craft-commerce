
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuthStore, ShopUser, ShopUserRole } from '@/stores/authStore';
import { toast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { UserPlus, Edit, Trash2 } from 'lucide-react';

export const ShopUserManagement = () => {
  const { user, addShopUser, updateShopUser, deleteShopUser } = useAuthStore();
  const [selectedShopId, setSelectedShopId] = useState<string | null>(null);
  const [editingShopUser, setEditingShopUser] = useState<ShopUser | null>(null);

  const selectedShop = user?.shops?.find(shop => shop.id === selectedShopId);

  const handleAddShopUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedShopId) return;

    const formData = new FormData(e.currentTarget);
    const newShopUser: ShopUser = {
      id: Date.now().toString(),
      name: formData.get('userName') as string,
      email: formData.get('userEmail') as string,
      role: formData.get('userRole') as ShopUserRole,
      createdAt: new Date().toISOString(),
    };

    addShopUser(selectedShopId, newShopUser);
    toast({
      title: 'Utilisateur de boutique ajouté',
      description: `${newShopUser.name} a été ajouté à votre boutique.`,
    });
    e.currentTarget.reset();
  };

  const handleUpdateShopUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedShopId || !editingShopUser) return;

    const formData = new FormData(e.currentTarget);
    const updatedShopUser: Partial<ShopUser> = {
      name: formData.get('userName') as string,
      email: formData.get('userEmail') as string,
      role: formData.get('userRole') as ShopUserRole,
    };

    updateShopUser(selectedShopId, editingShopUser.id, updatedShopUser);
    toast({
      title: 'Utilisateur de boutique mis à jour',
      description: `${editingShopUser.name} a été mis à jour.`,
    });
    setEditingShopUser(null);
  };

  const handleDeleteShopUser = (shopUserId: string) => {
    if (!selectedShopId) return;
    if (confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur de la boutique ?")) {
      deleteShopUser(selectedShopId, shopUserId);
      toast({
        title: 'Utilisateur de boutique supprimé',
        description: "L'utilisateur a été supprimé de la boutique.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Gérer les utilisateurs de la boutique</h1>
            <p className="text-muted-foreground">Ajoutez et gérez les utilisateurs pour vos boutiques</p>
          </div>
          <Link to="/backoffice">
            <Button variant="outline">Retour au Backoffice</Button>
          </Link>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Sélectionner une boutique</CardTitle>
            </CardHeader>
            <CardContent>
              <Select onValueChange={setSelectedShopId}>
                <SelectTrigger className="w-full lg:w-1/3">
                  <SelectValue placeholder="Sélectionnez une boutique" />
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
                    <CardTitle>{editingShopUser ? "Modifier l'utilisateur" : 'Ajouter un utilisateur'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={editingShopUser ? handleUpdateShopUser : handleAddShopUser} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="userName">Nom</Label>
                        <Input id="userName" name="userName" defaultValue={editingShopUser?.name || ''} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="userEmail">Email</Label>
                        <Input id="userEmail" name="userEmail" type="email" defaultValue={editingShopUser?.email || ''} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="userRole">Rôle</Label>
                        <Select
                          value={editingShopUser?.role || 'shop_employee'}
                          onValueChange={(value: ShopUserRole) => setEditingShopUser(prev => prev ? { ...prev, role: value } : null)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="shop_admin">Admin de boutique</SelectItem>
                            <SelectItem value="shop_employee">Employé de boutique</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button type="submit">{editingShopUser ? 'Mettre à jour' : 'Ajouter'}</Button>
                      {editingShopUser && (
                        <Button type="button" variant="outline" onClick={() => setEditingShopUser(null)}>Annuler</Button>
                      )}
                    </form>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Utilisateurs de la boutique</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedShop?.shopUsers && selectedShop.shopUsers.length > 0 ? (
                        selectedShop.shopUsers.map((shopUser) => (
                          <div key={shopUser.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="space-y-1">
                              <h4 className="font-medium">{shopUser.name} ({shopUser.role === 'shop_admin' ? 'Admin' : 'Employé'})</h4>
                              <p className="text-sm text-muted-foreground">{shopUser.email}</p>
                            </div>
                            <div className="flex gap-2">
                              const handleEditShopUser = (shopUser: ShopUser) => {
    setEditingShopUser(shopUser);
    setSelectedPermissions(shopUser.permissions || []);
  };
                              <Button variant="destructive" size="sm" onClick={() => handleDeleteShopUser(shopUser.id)}>Supprimer</Button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground text-center">Aucun utilisateur pour cette boutique.</p>
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
