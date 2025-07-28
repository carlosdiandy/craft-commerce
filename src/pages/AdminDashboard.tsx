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
  const totalClients = allUsers.filter(u => u.role === 'client').length;
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
    <div className="min-h-screen bg-gradient-hero">
      <div className="container px-4 py-6 lg:py-8">
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold">Dashboard Administrateur</h1>
          <p className="text-muted-foreground">Vue d'ensemble de la plateforme</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Shop Owners</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalShopOwners}</div>
              <p className="text-xs text-success">+12% ce mois</p>
              <Link to="/admin/users">
                <Button variant="link" size="sm" className="p-0 h-auto mt-1">
                  Gérer les utilisateurs
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Boutiques actives</CardTitle>
              <Store className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeShops}</div>
              <p className="text-xs text-success">+8% ce mois</p>
              <Link to="/admin/shops">
                <Button variant="link" size="sm" className="p-0 h-auto mt-1">
                  Gérer les boutiques
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clients actifs</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalClients}</div>
              <p className="text-xs text-success">+15% ce mois</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En attente validation</CardTitle>
              <AlertCircle className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{pendingShopOwners.length}</div>
              <p className="text-xs text-muted-foreground">Nécessite action</p>
              {pendingShopOwners.length > 0 && (
                <Badge variant="destructive" className="mt-1 text-xs">
                  Urgent
                </Badge>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Pending Requests */}
        <Card className="mb-6 lg:mb-8">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <CardTitle className="text-lg lg:text-xl">Demandes d'inscription Shop Owner</CardTitle>
              {pendingShopOwners.length > 0 && (
                <Badge variant="destructive" className="w-fit">
                  {pendingShopOwners.length} en attente
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingShopOwners.length > 0 ? (
                pendingShopOwners.map((user) => (
                  <div key={user.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors gap-3">
                    <div className="space-y-1 flex-1">
                      <h4 className="font-medium">{user.name}</h4>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline">Documents téléchargés</Badge>
                        <Badge variant="secondary">Paiement validé</Badge>
                      </div>
                    </div>
                    <div className="flex gap-2 sm:flex-shrink-0">
                      <Button variant="default" size="sm" onClick={() => handleValidate(user)}>
                        Valider
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleReject(user)}>
                        Refuser
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 lg:py-12 text-muted-foreground">
                  <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <h3 className="font-medium text-lg mb-2">Aucune demande en attente</h3>
                  <p className="text-sm">Toutes les demandes d'inscription Shop Owner ont été traitées.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="w-5 h-5" />
                Gestion des utilisateurs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Gérer tous les comptes utilisateurs de la plateforme
              </p>
              <Link to="/admin/users">
                <Button className="w-full" variant="outline">
                  Accéder à la gestion
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Store className="w-5 h-5" />
                Gestion des boutiques
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Superviser et modérer les boutiques de la plateforme
              </p>
              <Link to="/admin/shops">
                <Button className="w-full" variant="outline">
                  Voir les boutiques
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Rapports et analytiques
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Consulter les statistiques et performances
              </p>
              <Button className="w-full" variant="outline" disabled>
                Bientôt disponible
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};