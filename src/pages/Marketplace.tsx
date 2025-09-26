import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Heart, Star, Store, Search } from 'lucide-react';
import { useProductStore } from '@/stores/supabase/productStore';
import { useSupabaseCartStore } from '@/stores/supabase/cartStore';
import { useSupabaseWishlistStore } from '@/stores/supabase/wishlistStore';
import { Product } from '@/services/supabase/productService';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { fetchProducts, products, isLoading, error } = useProductStore();
  const { addItem: addToCart } = useSupabaseCartStore();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isItemInWishlist } = useSupabaseWishlistStore();

  const categories = ['all', 'Électronique', 'Mode', 'Maison', 'Sport'];

  useEffect(() => {
    const filters: any = {
      page: 1,
      limit: 12
    };
    
    if (selectedCategory !== 'all') {
      filters.category = selectedCategory;
    }
    
    if (searchQuery) {
      filters.searchQuery = searchQuery;
    }

    fetchProducts(filters);
  }, [searchQuery, selectedCategory, fetchProducts]);

  const handleAddToCart = async (product: any) => {
    try {
      addToCart(product as Product, 1);
      toast({
        title: "Produit ajouté",
        description: `${product.name} a été ajouté au panier`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le produit au panier",
        variant: "destructive",
      });
    }
  };

  const handleWishlistToggle = async (product: any) => {
    try {
      if (isItemInWishlist(product.id)) {
        removeFromWishlist(product.id);
        toast({
          title: "Retiré des favoris",
          description: `${product.name} a été retiré de vos favoris`,
        });
      } else {
        addToWishlist(product as Product);
        toast({
          title: "Ajouté aux favoris",
          description: `${product.name} a été ajouté à vos favoris`,
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier les favoris",
        variant: "destructive",
      });
    }
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">
          Erreur: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-primary-foreground text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Marketplace Elosa</h1>
          <p className="text-xl mb-8">Découvrez des milliers de produits de qualité</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher des produits..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  size="sm"
                >
                  {category === 'all' ? 'Tous' : category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 8 }).map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader className="p-0">
                  <Skeleton className="w-full h-48" />
                </CardHeader>
                <CardContent className="p-4">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-6 w-1/3" />
                </CardContent>
              </Card>
            ))
          ) : products.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <p className="text-muted-foreground">Aucun produit trouvé</p>
            </div>
          ) : (
            products.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  <div className="relative">
                    <img
                      src={product.image_url || '/placeholder.svg'}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                      onClick={() => handleWishlistToggle(product)}
                    >
                      <Heart
                        className={`h-4 w-4 ${
                          isItemInWishlist(product.id) ? 'fill-red-500 text-red-500' : ''
                        }`}
                      />
                    </Button>
                    {product.discount_price && (
                      <Badge className="absolute top-2 left-2 bg-red-500">
                        Promo
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-lg mb-2 line-clamp-2">{product.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                    {product.description}
                  </p>
                  {/* Rating temporarily removed until rating field is available */}
                  <div className="flex items-center gap-2">
                    {product.discount_price ? (
                      <>
                        <span className="text-lg font-bold text-primary">
                          {product.discount_price}€
                        </span>
                        <span className="text-sm text-muted-foreground line-through">
                          {product.price}€
                        </span>
                      </>
                    ) : (
                      <span className="text-lg font-bold text-primary">{product.price}€</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Stock: {product.stock_quantity || 0}
                  </p>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex gap-2">
                  <Button
                    onClick={() => handleAddToCart(product)}
                    className="flex-1"
                    disabled={!product.stock_quantity || product.stock_quantity <= 0}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Ajouter au panier
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to={`/product/${product.id}`}>
                      <Store className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};