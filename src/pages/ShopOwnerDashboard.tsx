import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, ShoppingCart, TrendingUp, Plus, CreditCard, Clock, Upload, Store, User } from 'lucide-react';
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
      <div className="container px-4 py-6 lg:py-8">
        <div className="mb-6 lg:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold">Mon Backoffice</h1>
              <p className="text-muted-foreground">Gérez vos boutiques et produits</p>
            </div>
            <Badge 
              variant={getStatusVariant(user?.shopOwnerStatus || 'pending')}
              className="w-fit text-sm"
            >
              {getStatusLabel(user?.shopOwnerStatus || 'pending')}
            </Badge>
          </div>
        </div>

        {user?.shopOwnerStatus === 'pending' && (
          <Card className="mb-6 lg:mb-8 border-warning bg-warning/5">
            <CardContent className="p-4 lg:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <CreditCard className="w-8 h-8 text-warning flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">Paiement requis</h3>
                  <p className="text-muted-foreground mb-4">
                    Pour activer votre compte shop owner, veuillez effectuer le paiement de la souscription.
                  </p>
                  <Button variant="warning" onClick={handlePayment} className="w-full sm:w-auto">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Procéder au paiement
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {user?.shopOwnerStatus === 'paid' && (
          <Card className="mb-6 lg:mb-8 border-info bg-info/5">
            <CardContent className="p-4 lg:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <Upload className="w-8 h-8 text-info flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">Documents requis</h3>
                  <p className="text-muted-foreground mb-4">
                    Votre paiement a été enregistré. Veuillez maintenant télécharger les documents justificatifs pour validation.
                  </p>
                  <Button variant="secondary" onClick={handleDocumentUpload} className="w-full sm:w-auto">
                    <Upload className="w-4 h-4 mr-2" />
                    Télécharger mes documents
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {user?.shopOwnerStatus === 'uploaded' && (
          <Card className="mb-6 lg:mb-8 border-secondary bg-secondary/5">
            <CardContent className="p-4 lg:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <Clock className="w-8 h-8 text-secondary flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">En attente de validation</h3>
                  <p className="text-muted-foreground mb-4">
                    Vos documents ont été téléchargés avec succès. Notre équipe examine votre dossier et vous contactera sous 48h.
                  </p>
                  <Badge variant="secondary">Dossier en cours de traitement</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {user?.shopOwnerStatus === 'validated' && (
          <>
            {/* Stats des boutiques */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Mes boutiques</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{user?.shops?.length || 0}</div>
                  <Button size="sm" variant="outline" className="mt-2 w-full">
                    <Plus className="w-4 h-4 mr-1" />
                    Créer une boutique
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Produits totaux</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">42</div>
                  <p className="text-xs text-success">+3 cette semaine</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow sm:col-span-2 lg:col-span-1">
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

            {/* Actions rapides */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
              <Link to="/shops/manage">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                  <Store className="w-6 h-6" />
                  <span>Gérer mes boutiques</span>
                </Button>
              </Link>
              <Link to="/products/manage">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                  <Package className="w-6 h-6" />
                  <span>Gérer mes produits</span>
                </Button>
              </Link>
              <Link to="/backoffice/orders">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                  <ShoppingCart className="w-6 h-6" />
                  <span>Gérer les commandes</span>
                </Button>
              </Link>
              <Link to="/backoffice/users">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                  <User className="w-6 h-6" />
                  <span>Utilisateurs boutique</span>
                </Button>
              </Link>
            </div>

            {/* Mes boutiques */}
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <CardTitle className="text-lg lg:text-xl">Mes Boutiques</CardTitle>
                  {user?.shops && user.shops.length > 0 && (
                    <Badge variant="outline" className="w-fit">
                      {user.shops.length} boutique{user.shops.length > 1 ? 's' : ''}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {user?.shops?.map((shop) => (
                    <div key={shop.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors gap-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-lg">{shop.name}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{shop.description}</p>
                        <Badge variant="outline" className="text-xs">
                          Statut: {shop.status}
                        </Badge>
                      </div>
                      <Button variant="outline" className="sm:flex-shrink-0">
                        Gérer cette boutique
                      </Button>
                    </div>
                  )) || (
                      <div className="text-center py-8 lg:py-12 text-muted-foreground">
                        <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <h3 className="font-medium text-lg mb-2">Aucune boutique créée</h3>
                        <p className="text-sm mb-4">Créez votre première boutique pour commencer à vendre</p>
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