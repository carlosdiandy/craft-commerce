import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Heart, Star, Store, Search, TrendingUp, Zap, Gift } from 'lucide-react';
import { useProductStore } from '@/stores/supabase/productStore';
import { useSupabaseCartStore } from '@/stores/supabase/cartStore';
import { useSupabaseWishlistStore } from '@/stores/supabase/wishlistStore';
import { Product } from '@/types/api';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { BestShopsSlider } from '@/components/common/BestShopsSlider';
import { Separator } from '@/components/ui/separator';

// Extend Product type to include extra fields from Supabase
interface ExtendedProduct extends Product {
  discount_price?: number;
  rating?: number;
}

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

  const handleAddToCart = async (product: Product) => {
    try {
      addToCart(product, 1);
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

  const handleWishlistToggle = async (product: Product) => {
    try {
      if (isItemInWishlist(product.id)) {
        removeFromWishlist(product.id);
        toast({
          title: "Retiré des favoris",
          description: `${product.name} a été retiré de vos favoris`,
        });
      } else {
        addToWishlist(product);
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
      <div className="relative bg-gradient-to-r from-primary via-primary/90 to-secondary text-white py-12 sm:py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 animate-fade-in">
            Marketplace Elosa
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 max-w-2xl mx-auto animate-fade-in px-4">
            Découvrez des milliers de produits de qualité auprès de boutiques locales
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
            <Button size="lg" variant="secondary" className="animate-scale-in w-full sm:w-auto">
              <TrendingUp className="mr-2 h-5 w-5" />
              Explorer les tendances
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20 animate-scale-in w-full sm:w-auto">
              <Store className="mr-2 h-5 w-5" />
              Découvrir les boutiques
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-8 sm:py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center p-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Zap className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Livraison Rapide</h3>
              <p className="text-sm sm:text-base text-muted-foreground">Livraison en 24h pour la plupart des produits</p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Gift className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Produits Locaux</h3>
              <p className="text-sm sm:text-base text-muted-foreground">Soutenez les commerçants de votre région</p>
            </div>
            <div className="text-center p-4 sm:col-span-2 md:col-span-1">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Star className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Qualité Garantie</h3>
              <p className="text-sm sm:text-base text-muted-foreground">Tous nos produits sont vérifiés et certifiés</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 sm:py-10 md:py-12">
        {/* Search and Filters */}
        <div className="mb-8 sm:mb-10 md:mb-12 space-y-4 sm:space-y-6">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Trouvez ce que vous cherchez</h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4">
              Parcourez notre vaste sélection de produits ou utilisez les filtres pour affiner votre recherche
            </p>
          </div>
          
          <div className="flex flex-col gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 sm:top-3.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher des produits..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-11 sm:h-12 text-base sm:text-lg border-2"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap justify-center sm:justify-start">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  size="sm"
                  className="hover-scale text-xs sm:text-sm"
                >
                  {category === 'all' ? 'Tous' : category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Best Shops Section */}
        <div className="mb-12 sm:mb-14 md:mb-16">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">Boutiques Populaires</h2>
              <p className="text-sm sm:text-base text-muted-foreground">Découvrez les boutiques les mieux notées</p>
            </div>
            <Button variant="outline" asChild className="w-full sm:w-auto">
              <Link to="/shops">Voir toutes</Link>
            </Button>
          </div>
          <BestShopsSlider shops={[]} isLoading={false} error="" limit={6} />
        </div>

        <Separator className="my-12" />

        {/* Products Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">Produits Tendances</h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                {products.length > 0 ? `${products.length} produit(s) trouvé(s)` : 'Aucun produit trouvé'}
              </p>
            </div>
            {searchQuery && (
              <Button variant="outline" onClick={() => setSearchQuery('')} className="w-full sm:w-auto text-sm">
                Effacer la recherche
              </Button>
            )}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 8 }).map((_, index) => (
              <Card key={index} className="overflow-hidden animate-pulse">
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
            <div className="col-span-full text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Aucun produit trouvé</h3>
                <p className="text-muted-foreground mb-4">
                  Essayez de modifier vos critères de recherche ou parcourez nos catégories
                </p>
                <Button onClick={() => {setSearchQuery(''); setSelectedCategory('all');}}>
                  Réinitialiser les filtres
                </Button>
              </div>
            </div>
          ) : (
            products.map((product) => {
              const extendedProduct = product as ExtendedProduct;
              return (
                <Card key={product.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover-scale group">
                  <CardHeader className="p-0">
                    <div className="relative overflow-hidden">
                      <img
                        src={product.images?.[0] || '/placeholder.svg'}
                        alt={product.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 bg-white/80 hover:bg-white transition-all duration-200"
                        onClick={() => handleWishlistToggle(product)}
                      >
                        <Heart
                          className={`h-4 w-4 transition-colors ${
                            isItemInWishlist(product.id) ? 'fill-red-500 text-red-500' : 'hover:text-red-500'
                          }`}
                        />
                      </Button>
                      {extendedProduct.discount_price && (
                        <Badge className="absolute top-2 left-2 bg-red-500 animate-pulse">
                          <Gift className="w-3 h-3 mr-1" />
                          Promo
                        </Badge>
                      )}
                      {(product.stock || 0) <= 5 && (product.stock || 0) > 0 && (
                        <Badge variant="destructive" className="absolute bottom-2 left-2">
                          Stock limité
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <CardTitle className="text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {product.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < (extendedProduct.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">({extendedProduct.rating || 0})</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      {extendedProduct.discount_price ? (
                        <>
                          <span className="text-xl font-bold text-primary">
                            {extendedProduct.discount_price}€
                          </span>
                          <span className="text-sm text-muted-foreground line-through">
                            {product.price}€
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            -{Math.round(((product.price - extendedProduct.discount_price) / product.price) * 100)}%
                          </Badge>
                        </>
                      ) : (
                        <span className="text-xl font-bold text-primary">{product.price}€</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Stock: {product.stock}</span>
                      {(product.stock || 0) <= 0 && (
                        <Badge variant="secondary">Rupture de stock</Badge>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex flex-col sm:flex-row gap-2">
                    <Button
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 transition-all duration-200 w-full text-sm sm:text-base"
                      disabled={!product.stock || product.stock <= 0}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {!product.stock || product.stock <= 0 ? 'Indisponible' : 'Ajouter'}
                    </Button>
                    <Button variant="outline" asChild className="transition-all duration-200 hover:bg-primary hover:text-white w-full sm:w-auto">
                      <Link to={`/products/${product.id}`}>
                        <Store className="h-4 w-4 sm:mr-0" />
                        <span className="sm:hidden ml-2">Détails</span>
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })
          )}
        </div>

        {/* Call to Action */}
        {products.length > 0 && (
          <div className="text-center mt-12 sm:mt-14 md:mt-16 py-8 sm:py-10 md:py-12 bg-muted/30 rounded-lg px-4">
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Vous n'avez pas trouvé ce que vous cherchiez ?</h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 max-w-md mx-auto">
              Explorez nos boutiques ou contactez-nous pour obtenir de l'aide
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Button size="lg" asChild className="w-full sm:w-auto">
                <Link to="/shops">
                  <Store className="mr-2 h-5 w-5" />
                  Parcourir les boutiques
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
                <Link to="/support">
                  Nous contacter
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};