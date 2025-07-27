
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Heart, Store, Star } from 'lucide-react';
import { useCartStore, Product } from '@/stores/cartStore';
import { useFavoritesStore } from '@/stores/favoritesStore';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

// Mock data for products (should ideally come from a global store or backend)
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro',
    price: 1199,
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
    shopId: 'shop1',
    shopName: 'TechStore Premium',
    category: 'Électronique',
    stock: 15,
    description: 'Le dernier iPhone avec puce A17 Pro, un appareil photo révolutionnaire et des performances inégalées.'
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
    description: "Ultrabook puissant avec puce M3, design ultra-fin et autonomie d'une journée."
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
    description: 'Baskets confortables pour le sport et le quotidien, avec un amorti Air Max emblématique.'
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
    description: 'Sac à main en cuir de luxe, parfait pour toutes les occasions. Design élégant et spacieux.'
  },
];

export const ProductDetail = () => {
  const { productId } = useParams();
  const product = mockProducts.find(p => p.id === productId);

  const { addItem } = useCartStore();
  const { toggleFavorite, isFavorite } = useFavoritesStore();

  const handleAddToCart = (product: Product) => {
    addItem(product);
    toast({
      title: "Ajouté au panier",
      description: `${product.name} a été ajouté à votre panier.`,
    });
  };

  const handleToggleFavorite = (product: Product) => {
    toggleFavorite(product);
    toast({
      title: isFavorite(product.id) ? "Retiré des favoris" : "Ajouté aux favoris",
      description: `${product.name} ${isFavorite(product.id) ? 'retiré de' : 'ajouté à'} vos favoris.`,
    });
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Produit introuvable</h1>
          <p className="text-muted-foreground mb-6">Le produit que vous recherchez n'existe pas.</p>
          <Link to="/">
            <Button>Retour à la marketplace</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="relative h-96 rounded-lg overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <Button
              size="icon"
              variant={isFavorite(product.id) ? "default" : "outline"}
              className="absolute top-4 right-4"
              onClick={() => handleToggleFavorite(product)}
            >
              <Heart className={`w-5 h-5 ${isFavorite(product.id) ? 'fill-current' : ''}`} />
            </Button>
          </div>

          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-2">{product.category}</Badge>
              <h1 className="text-4xl font-bold">{product.name}</h1>
              <p className="text-muted-foreground text-lg">{product.description}</p>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-5xl font-bold text-primary">{product.price}€</span>
              {product.stock < 10 && product.stock > 0 && (
                <Badge variant="outline">Stock limité ({product.stock} restants)</Badge>
              )}
              {product.stock === 0 && (
                <Badge variant="destructive">Rupture de stock</Badge>
              )}
            </div>

            <div className="space-y-4">
              <Link to={`/shops/${product.shopId}`} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                <Store className="w-5 h-5" />
                Visiter la boutique: <span className="font-medium">{product.shopName}</span>
              </Link>
              <Button
                className="w-full py-6 text-lg"
                onClick={() => handleAddToCart(product)}
                disabled={product.stock === 0}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {product.stock === 0 ? 'Rupture de stock' : 'Ajouter au panier'}
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Détails supplémentaires</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>ID du produit: {product.id}</li>
                  <li>Vendu par: {product.shopName}</li>
                  <li>Catégorie: {product.category}</li>
                  <li>Stock disponible: {product.stock}</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
