
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFavoritesStore } from '@/stores/favoritesStore';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { toast } from '@/hooks/use-toast';

export const Favorites = () => {
  const { items, toggleFavorite } = useFavoritesStore();
  const { addItem } = useCartStore();

  const handleAddToCart = (product) => {
    addItem(product);
    toast({
      title: 'Ajouté au panier',
      description: `${product.name} a été ajouté à votre panier.`,
    });
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Mes Favoris</h1>
            <p className="text-muted-foreground">Vous avez {items.length} article(s) dans vos favoris.</p>
          </div>
          <Link to="/">
            <Button variant="outline">Retour à la marketplace</Button>
          </Link>
        </div>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-hover transition-all duration-300 group">
                <div className="relative h-48 overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <Button
                    size="icon"
                    variant="default"
                    className="absolute top-2 right-2"
                    onClick={() => toggleFavorite(product)}
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </Button>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg line-clamp-1">{product.name}</CardTitle>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span className="mr-2">{product.shopName}</span>
                  </div>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{product.price}€</span>
                    <Button size="sm" onClick={() => handleAddToCart(product)}>
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Ajouter au panier
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">Votre liste de favoris est vide</h2>
            <Link to="/">
              <Button>Découvrir des produits</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
