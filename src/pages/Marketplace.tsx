import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  ShoppingCart, 
  Heart, 
  Star, 
  TrendingUp, 
  Store, 
  Search,
  Filter,
  MapPin,
  Clock,
  Users
} from 'lucide-react';
import { useCartStore, Product } from '@/stores/cartStore';
import { useFavoritesStore } from '@/stores/favoritesStore';
import { toast } from '@/hooks/use-toast';
import heroImage from '@/assets/hero-ecommerce.jpg';

// Données mockées pour la démonstration
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
  }
];

export const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const { addItem } = useCartStore();
  const { toggleFavorite, isFavorite } = useFavoritesStore();

  const categories = ['all', 'Électronique', 'Mode', 'Maison', 'Sport'];

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.shopName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative h-96 bg-cover bg-center flex items-center justify-center text-white"
        style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${heroImage})` }}
      >
        <div className="text-center space-y-6 max-w-2xl px-4">
          <h1 className="text-5xl font-bold">
            Découvrez notre <span className="bg-gradient-primary bg-clip-text text-transparent">MarketPlace</span>
          </h1>
          <p className="text-xl text-gray-200">
            Des milliers de produits de qualité, vendus par des boutiques de confiance
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="hero">
              <Store className="w-5 h-5 mr-2" />
              Parcourir les boutiques
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
              <TrendingUp className="w-5 h-5 mr-2" />
              Produits tendances
            </Button>
          </div>
        </div>
      </section>

      <div className="container px-4 py-8">
        {/* Barre de recherche et filtres */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Rechercher des produits ou boutiques..."
                className="pl-12 h-12"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filtres
            </Button>
          </div>

          {/* Filtres par catégorie */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category === 'all' ? 'Toutes les catégories' : category}
              </Button>
            ))}
          </div>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Store className="w-8 h-8 text-primary mx-auto mb-2" />
              <h3 className="text-2xl font-bold">{mockShops.length}</h3>
              <p className="text-muted-foreground">Boutiques partenaires</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <ShoppingCart className="w-8 h-8 text-secondary mx-auto mb-2" />
              <h3 className="text-2xl font-bold">{mockProducts.length}K+</h3>
              <p className="text-muted-foreground">Produits disponibles</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 text-success mx-auto mb-2" />
              <h3 className="text-2xl font-bold">50K+</h3>
              <p className="text-muted-foreground">Clients satisfaits</p>
            </CardContent>
          </Card>
        </div>

        {/* Boutiques en vedette */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">Boutiques en vedette</h2>
            <Link to="/shops">
              <Button variant="outline">Voir toutes les boutiques</Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockShops.map((shop) => (
              <Card key={shop.id} className="overflow-hidden hover:shadow-hover transition-all duration-300">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={shop.image} 
                    alt={shop.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg">{shop.name}</h3>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium ml-1">{shop.rating}</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm mb-3">{shop.description}</p>
                  <div className="flex items-center text-sm text-muted-foreground mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    {shop.location}
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{shop.productsCount} produits</Badge>
                    <Button size="sm" variant="outline">Visiter</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Produits */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">Produits populaires</h2>
            <div className="text-sm text-muted-foreground">
              {filteredProducts.length} produits trouvés
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
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

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucun produit trouvé</h3>
              <p className="text-muted-foreground">
                Essayez de modifier vos critères de recherche
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};