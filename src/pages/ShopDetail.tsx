
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, ShoppingCart, Heart, Store } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { useWishlistStore } from '@/stores/wishlistStore';
import { toast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { apiGet } from '@/services/apiService';
import { Product } from '@/stores/productStore';

interface Shop {
  id: string;
  name: string;
  description: string;
  image: string;
  rating: number;
  productsCount: number;
  location: string;
}

export const ShopDetail = () => {
  const { shopId } = useParams();
  const [shop, setShop] = useState<Shop | null>(null);
  const [shopProducts, setShopProducts] = useState<Product[]>([]);

  const { addItem } = useCartStore();
  const { addItem: addWishlistItem, removeItem: removeWishlistItem, isItemInWishlist } = useWishlistStore();

  useEffect(() => {
    const fetchShopDetails = async () => {
      try {
        const shopResponse = await apiGet<Shop>(`/shops/${shopId}`);
        setShop(shopResponse.data);

        const productsResponse = await apiGet<Product[]>(`/products/?shopId=${shopId}`);
        setShopProducts(productsResponse.data);
      } catch (error) {
        console.error("Failed to fetch shop details or products:", error);
      }
    };

    if (shopId) {
      fetchShopDetails();
    }
  }, [shopId]);

  const handleAddToCart = (product: Product) => {
    addItem(product);
    toast({
      title: "Ajouté au panier",
      description: `${product.name} a été ajouté à votre panier.`,
    });
  };

  const handleToggleFavorite = (product: Product) => {
    if (isItemInWishlist(product.id)) {
      removeWishlistItem(product.id);
      toast({
        title: "Retiré des favoris",
        description: `${product.name} retiré de vos favoris.`,
      });
    } else {
      addWishlistItem(product);
      toast({
        title: "Ajouté aux favoris",
        description: `${product.name} ajouté à vos favoris.`,
      });
    }
  };

  if (!shop) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Boutique introuvable</h1>
          <p className="text-muted-foreground mb-6">La boutique que vous recherchez n'existe pas.</p>
          <Link to="/shops">
            <Button>Retour aux boutiques</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">{shop.name}</h1>
            <p className="text-muted-foreground text-lg">{shop.description}</p>
            <div className="flex items-center text-sm text-muted-foreground mt-2">
              <MapPin className="w-4 h-4 mr-1" />
              {shop.location}
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 ml-4 mr-1" />
              {shop.rating} ({shop.productsCount} produits)
            </div>
          </div>
          <Link to="/shops">
            <Button variant="outline">Retour aux boutiques</Button>
          </Link>
        </div>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Produits de la boutique</h2>
          {shopProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {shopProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-hover transition-all duration-300 group">
                  <div className="relative h-48 overflow-hidden">
                    {(product.images && product.images.length > 0) &&
                      (<img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />)}
                    <Button
                      size="icon"
                      variant={isItemInWishlist(product.id) ? "default" : "outline"}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleToggleFavorite(product)}
                    >
                      <Heart className={`w-4 h-4 ${isItemInWishlist(product.id) ? 'fill-current' : ''}`} />
                    </Button>
                    {product.stock < 10 && (
                      <Badge variant="destructive" className="absolute top-2 left-2">
                        Stock limité
                      </Badge>
                    )}
                  </div>

                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg line-clamp-1">{product.name}</CardTitle>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Store className="w-4 h-4 mr-1" />
                      {shop.name}
                    </div>
                  </CardHeader>

                  <CardContent className="pb-2">
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">
                        {product.price}€
                      </span>
                      <Badge variant="outline">{product.category}</Badge>
                    </div>
                  </CardContent>

                  <CardFooter className="pt-2">
                    <Button
                      className="w-full"
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {product.stock === 0 ? 'Rupture de stock' : 'Ajouter au panier'}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Store className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucun produit disponible pour cette boutique.</h3>
              <p className="text-muted-foreground">
                Revenez plus tard ou explorez d'autres boutiques.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
