import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Store, Package, ShoppingCart, User, AlertTriangle, X } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useShopStore } from '@/stores/shopStore';
import { useProductStore } from '@/stores/productStore';
import { useOrderStore } from '@/stores/orderStore';

export const ShopOwnerDashboard = () => {
  const navigate = useNavigate();
  const { user, updateShopOwnerStatus, addProductToShop } = useAuthStore();
  const { shops, fetchShops } = useShopStore();
  const { products, fetchProducts } = useProductStore();
  const { orders, fetchOrdersByShop } = useOrderStore();
  const [selectedShop, setSelectedShop] = useState(null);

  useEffect(() => {
    fetchShops();
    fetchProducts();
    // Only fetch orders if we have a selected shop
    if (selectedShop) {
      fetchOrdersByShop(selectedShop.id);
    }
  }, [fetchShops, fetchProducts, fetchOrdersByShop, selectedShop]);

  const handleAddProduct = () => {
    if (selectedShop) {
      updateShopOwnerStatus('approved');
      const newProduct = {
        id: Date.now().toString(),
        name: 'Nouveau Produit',
        price: 0,
        category: 'default',
        description: 'Description du produit',
        images: [],
        stock: 0,
        shopId: selectedShop.id,
        shopName: selectedShop.name,
      };
      addProductToShop(selectedShop.id, newProduct);
    }
  };

  const handleShopClick = (shopId: string) => {
    navigate(`/shops/manage/${shopId}`);
  };

  const handleCreateShop = () => {
    navigate('/shops/create');
  };

  if (user?.shopOwnerStatus === 'pending') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-warning/20 rounded-full mx-auto mb-4 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-warning" />
            </div>
            <CardTitle>Demande en cours d'approbation</CardTitle>
            <p className="text-muted-foreground">
              Votre demande pour devenir propriétaire de boutique est en cours de révision par notre équipe.
            </p>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/')}
            >
              Retourner à l'accueil
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (user?.shopOwnerStatus === 'rejected') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-destructive/20 rounded-full mx-auto mb-4 flex items-center justify-center">
              <X className="w-8 h-8 text-destructive" />
            </div>
            <CardTitle>Demande rejetée</CardTitle>
            <p className="text-muted-foreground">
              Votre demande pour devenir propriétaire de boutique a été rejetée. 
              Veuillez contacter notre équipe support pour plus d'informations.
            </p>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              className="w-full mb-2"
              onClick={() => navigate('/')}
            >
              Retourner à l'accueil
            </Button>
            <Button 
              variant="destructive" 
              className="w-full"
            >
              Contacter le support
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container px-4 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard Propriétaire</h1>
          <p className="text-muted-foreground">
            Gérez vos boutiques et suivez vos performances
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Boutiques</p>
                  <p className="text-2xl font-bold">{shops.length}</p>
                </div>
                <Store className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Produits</p>
                  <p className="text-2xl font-bold">{products.length}</p>
                </div>
                <Package className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Commandes</p>
                  <p className="text-2xl font-bold">{orders.length}</p>
                </div>
                <ShoppingCart className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Utilisateurs</p>
                  <p className="text-2xl font-bold">{user ? 1 : 0}</p>
                </div>
                <User className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Shop Management Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Mes Boutiques</h2>
          {shops.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {shops.map((shop) => (
                <Card key={shop.id} className="cursor-pointer hover:shadow-md transition-shadow duration-200" onClick={() => handleShopClick(shop.id)}>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold mb-2">{shop.name}</h3>
                    <p className="text-sm text-muted-foreground">{shop.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              Vous n'avez pas encore de boutique.
            </div>
          )}
          <Button className="mt-4" onClick={handleCreateShop}>Créer une Boutique</Button>
        </div>

        {/* Product Management Section */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Gestion des Produits</h2>
          <Button onClick={handleAddProduct}>Ajouter un Produit</Button>
        </div>
      </div>
    </div>
  );
};
