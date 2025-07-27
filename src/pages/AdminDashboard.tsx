import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart3, Users, Store, CreditCard, TrendingUp, AlertCircle } from 'lucide-react';
import adminImage from '@/assets/admin-dashboard.jpg';
import { useAuthStore, User } from '@/stores/authStore';
import { toast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

export const AdminDashboard = () => {
  const { getPendingShopOwners, updateShopOwnerStatus, getAllUsers } = useAuthStore();
  const pendingShopOwners = getPendingShopOwners();
  const allUsers = getAllUsers();

  const totalShopOwners = allUsers.filter(u => u.role === 'shopOwner').length;
  const activeShops = allUsers.filter(u => u.role === 'shopOwner' && u.shopOwnerStatus === 'validated').flatMap(u => u.shops || []).filter(s => s.status === 'active').length;

  const handleValidate = (user: User) => {
    updateShopOwnerStatus(user.id, 'validated');
    toast({
      title: "Shop Owner validé",
      description: `${user.name} a été validé en tant que Shop Owner.`,
    });
  };

  const handleReject = (user: User) => {
    updateShopOwnerStatus(user.id, 'suspended'); // Or 'rejected' if we add that status
    toast({
      title: "Shop Owner refusé",
      description: `${user.name} a été refusé.`,
    });
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard Administrateur</h1>
          <p className="text-muted-foreground">Vue d'overview de la plateforme</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Shop Owners</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalShopOwners}</div>
              <p className="text-xs text-muted-foreground">+12% ce mois</p>
              <Link to="/admin/users">
                <Button variant="link" size="sm" className="p-0 h-auto">Gérer les utilisateurs</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Boutiques actives</CardTitle>
              <Store className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeShops}</div>
              <p className="text-xs text-muted-foreground">+8% ce mois</p>
              <Link to="/admin/shops">
                <Button variant="link" size="sm" className="p-0 h-auto">Gérer les boutiques</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenus</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€45,231</div>
              <p className="text-xs text-muted-foreground">+20% ce mois</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En attente validation</CardTitle>
              <AlertCircle className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{pendingShopOwners.length}</div>
              <p className="text-xs text-muted-foreground">Nécessite action</p>
            </CardContent>
          </Card>
        </div>

        {/* Pending Requests */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Demandes d'inscription Shop Owner</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingShopOwners.length > 0 ? (
                pendingShopOwners.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <h4 className="font-medium">{user.name}</h4>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <Badge variant="outline">Paiement validé</Badge> {/* This badge is static for now */}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="success" size="sm" onClick={() => handleValidate(user)}>Valider</Button>
                      <Button variant="destructive" size="sm" onClick={() => handleReject(user)}>Refuser</Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Aucune demande d'inscription Shop Owner en attente.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};