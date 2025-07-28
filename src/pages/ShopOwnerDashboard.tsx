import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, ShoppingCart, TrendingUp, Plus, CreditCard, Clock, Upload } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { Link } from 'react-router-dom';
import shopOwnerImage from '@/assets/shop-owner.jpg';
import { toast } from '@/hooks/use-toast';

export const ShopOwnerDashboard = () => {
  const { user, updateShopOwnerStatus } = useAuthStore();

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'validated': return 'default';
      case 'paid': return 'secondary';
      case 'pending': return 'destructive';
      case 'uploaded': return 'secondary';
      default: return 'outline';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'validated': return 'Compte validé';
      case 'paid': return 'En attente de validation (paiement)';
      case 'pending': return 'Paiement requis';
      case 'uploaded': return 'En attente de validation (documents)';
      default: return 'Statut inconnu';
    }
  };

  const handlePayment = () => {
    if (user) {
      updateShopOwnerStatus(user.id, 'paid');
      toast({
        title: "Paiement simulé",
        description: "Votre paiement a été enregistré. Veuillez maintenant télécharger vos documents.",
      });
    }
  };

  const handleDocumentUpload = () => {
    if (user) {
      updateShopOwnerStatus(user.id, 'uploaded');
      toast({
        title: "Documents téléchargés",
        description: "Vos documents ont été téléchargés. Votre compte est en attente de validation par l'administrateur.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Mon Backoffice</h1>
              <p className="text-muted-foreground">Gérez vos boutiques et produits</p>
            </div>
            <Badge variant={getStatusVariant(user?.shopOwnerStatus || 'pending')}>
              {getStatusLabel(user?.shopOwnerStatus || 'pending')}
            </Badge>
          </div>
        </div>

        {user?.shopOwnerStatus === 'pending' && (
          <Card className="mb-8 border-warning bg-warning/5">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <CreditCard className="w-8 h-8 text-warning mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">Paiement requis</h3>
                  <p className="text-muted-foreground mb-4">
                    Pour activer votre compte shop owner, veuillez effectuer le paiement de la souscription.
                  </p>
                  <Button variant="warning" onClick={handlePayment}>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Procéder au paiement
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {user?.shopOwnerStatus === 'paid' && (
          <Card className="mb-8 border-info bg-info/5">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Upload className="w-8 h-8 text-info mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">Documents requis</h3>
                  <p className="text-muted-foreground mb-4">
                    Votre paiement a été enregistré. Veuillez maintenant télécharger les documents justificatifs pour validation.
                  </p>
                  <Button variant="secondary" onClick={handleDocumentUpload}>
                    <Upload className="w-4 h-4 mr-2" />
                    Télécharger mes documents
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {user?.shopOwnerStatus === 'validated' && (
          <>
            {/* Stats des boutiques */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Mes boutiques</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{user?.shops?.length || 0}</div>
                  <Button size="sm" variant="outline" className="mt-2">
                    <Plus className="w-4 h-4 mr-1" />
                    Créer une boutique
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Produits totaux</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">42</div>
                  <p className="text-xs text-muted-foreground">+3 cette semaine</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Ventes ce mois</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">€1,234</div>
                  <p className="text-xs text-success">+18% vs mois dernier</p>
                </CardContent>
              </Card>
            </div>

            {/* Mes boutiques */}
            <Card>
              <CardHeader>
                <CardTitle>Mes Boutiques</CardTitle>
                <Link to="/shops/manage">
                  <Button variant="outline" size="sm">Gérer mes boutiques</Button>
                </Link>
                <Link to="/products/manage">
                  <Button variant="outline" size="sm">Gérer mes produits</Button>
                </Link>
                <Link to="/backoffice/orders">
                  <Button variant="outline" size="sm">Gérer les commandes</Button>
                </Link>
                <Link to="/backoffice/users">
                  <Button variant="outline" size="sm">Gérer les utilisateurs de la boutique</Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {user?.shops?.map((shop) => (
                    <div key={shop.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{shop.name}</h4>
                        <p className="text-sm text-muted-foreground">{shop.description}</p>
                        <Badge variant="outline" className="mt-1">{shop.status}</Badge>
                      </div>
                      <Button variant="outline">Gérer</Button>
                    </div>
                  )) || (
                      <div className="text-center py-8 text-muted-foreground">
                        <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Aucune boutique créée</p>
                        <Button className="mt-4" variant="gradient">
                          <Plus className="w-4 h-4 mr-2" />
                          Créer ma première boutique
                        </Button>
                      </div>
                    )}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};