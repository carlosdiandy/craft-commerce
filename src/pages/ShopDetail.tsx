
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, ShoppingCart, Heart, Store } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { useFavoritesStore } from '@/stores/favoritesStore';
import { toast } from '@/hooks/use-toast';

// Données mockées pour la démonstration (à remplacer par des données réelles)
const mockShops = [
  {
    id: 'shop1',
    name: 'TechStore Premium',
    description: 'Spécialiste en électronique et high-tech',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
    rating: 4.8,
    productsCount: 156,
    location: 'Paris, France'
  },
  {
    id: 'shop2',
    name: 'Sport & Style',
    description: 'Vêtements et équipements de sport',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400',
    rating: 4.6,
    productsCount: 89,
    location: 'Lyon, France'
  },
  {
    id: 'shop3',
    name: 'Luxury Fashion',
    description: 'Mode et accessoires de luxe',
    image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400',
    rating: 4.9,
    productsCount: 67,
    location: 'Nice, France'
  },
  {
    id: 'shop4',
    name: 'Green Garden',
    description: 'Plantes et accessoires de jardinage',
    image: 'https://images.unsplash.com/photo-1509223197845-d26291923a0c?w=400',
    rating: 4.5,
    productsCount: 210,
    location: 'Marseille, France'
  },
  {
    id: 'shop5',
    name: 'Book Nook',
    description: 'Librairie indépendante',
    image: 'https://images.unsplash.com/photo-1521587765099-8835e7201186?w=400',
    rating: 4.7,
    productsCount: 300,
    location: 'Bordeaux, France'
  }
];

const mockProducts = [
  {
    id: '1',
    name: 'iPhone 15 Pro',
    price: 1199,
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
    shopId: 'shop1',
    shopName: 'TechStore Premium',
    category: 'Électronique',
    stock: 15,
    description: 'Le dernier iPhone avec puce A17 Pro'
  },
  {
    id: '2',
    name: 'MacBook Air M3',
    price: 1299,
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400',
    shopId: 'shop1',
    shopName: 'TechStore Premium',
    category: 'Électronique',
    stock: 8,
    description: 'Ultrabook puissant avec puce M3'
  },
  {
    id: '3',
    name: 'Sneakers Nike Air Max',
    price: 159,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400',
    shopId: 'shop2',
    shopName: 'Sport & Style',
    category: 'Mode',
    stock: 25,
    description: 'Baskets confortables pour le sport'
  },
  {
    id: '4',
    name: 'Sac à main Coach',
    price: 289,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
    shopId: 'shop3',
    shopName: 'Luxury Fashion',
    category: 'Mode',
    stock: 12,
    description: 'Sac à main en cuir de luxe'
  },
];

export const ShopDetail = () => {
  const { shopId } = useParams();
  const shop = mockShops.find(s => s.id === shopId);
  const shopProducts = mockProducts.filter(p => p.shopId === shopId);

  const { addItem } = useCartStore();
  const { toggleFavorite, isFavorite } = useFavoritesStore();

  const handleAddToCart = (product) => {
    addItem(product);
    toast({
      title: "Ajouté au panier",
      description: `${product.name} a été ajouté à votre panier.`,
    });
  };

  const handleToggleFavorite = (product) => {
    toggleFavorite(product);
    toast({
      title: isFavorite(product.id) ? "Retiré des favoris" : "Ajouté aux favoris",
      description: `${product.name} ${isFavorite(product.id) ? 'retiré de' : 'ajouté à'} vos favoris.`, 
    });
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
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Button
                      size="icon"
                      variant={isFavorite(product.id) ? "default" : "outline"}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleToggleFavorite(product)}
                    >
                      <Heart className={`w-4 h-4 ${isFavorite(product.id) ? 'fill-current' : ''}`} />
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
                      {product.shopName}
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
