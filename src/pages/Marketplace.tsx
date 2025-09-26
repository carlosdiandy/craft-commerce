import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  Users,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { useSupabaseCartStore } from '@/stores/supabase/cartStore';
import { useProductStore } from '@/stores/supabase/productStore';
import { Product } from '@/types/api';
import { useSupabaseShopStore } from '@/stores/supabase/shopStore';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { useSupabaseWishlistStore } from '@/stores/supabase/wishlistStore';
import { toast } from '@/hooks/use-toast';
import { SearchBar } from '@/components/common/SearchBar';
import heroImage from '@/assets/hero-ecommerce.jpg';
import { useTranslation } from 'react-i18next';
import { useReviewStore } from '@/stores/reviewStore';
import { Rating } from '@/components/ui/Rating';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BestShopsSlider } from '@/components/common/BestShopsSlider';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

export const Marketplace = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<string>('asc');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [selectedShop, setSelectedShop] = useState<string>('all');

  const [productPage, setProductPage] = useState(1);
  const [shopPage, setShopPage] = useState(1);
  const PRODUCT_LIMIT = 8;
  const SHOP_LIMIT = 5; // For featured shops

  const { fetchProducts, products, isLoading: isLoadingProducts, error: productsError, currentPage: currentProductPage, totalPages: totalProductPages, resetProducts } = useProductStore();
  const { fetchShops, shops, isLoading: isLoadingShops, error: shopsError, currentPage: currentShopPage, totalPages: totalShopPages } = useSupabaseShopStore();
  const { addItem } = useSupabaseCartStore();
  const { addItem: addWishlistItem, removeItem: removeWishlistItem, isItemInWishlist } = useSupabaseWishlistStore();
  const { reviews } = useReviewStore();

  const getReviewsByProductId = (productId: string) => {
    return reviews.filter(review => review.productId === productId);
  };

  const categories = ['all', 'Électronique', 'Mode', 'Maison', 'Sport'];
  const shopNames = ['all', ...new Set(shops.map(p => p.name))]; // Use shops from store

  const observer = useRef<IntersectionObserver>();
  const lastProductElementRef = useCallback((node: HTMLDivElement) => {
    if (isLoadingProducts) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && currentProductPage < totalProductPages) {
        setProductPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoadingProducts, currentProductPage, totalProductPages]);

  useEffect(() => {
    // Reset products and fetch first page when filters change
    resetProducts();
    setProductPage(1); // Reset page to 1 when filters change
    const filters: any = {
      page: 1, // Always fetch first page on filter change
      limit: PRODUCT_LIMIT,
      searchQuery,
      minPrice: parseFloat(minPrice) || undefined,
      maxPrice: parseFloat(maxPrice) || undefined,
      sortBy,
      sortOrder,
      inStockOnly,
    };
    if (selectedCategory !== 'all') filters.category = selectedCategory;
    if (selectedShop !== 'all') filters.shopId = selectedShop;
    fetchProducts(filters); // Fetch without appending on filter change
  }, [searchQuery, selectedCategory, minPrice, maxPrice, sortBy, sortOrder, inStockOnly, selectedShop]);

  useEffect(() => {
    // Fetch more products when productPage changes (for infinite scroll)
    if (productPage > 1) { // Only fetch if page is greater than 1 (initial fetch is handled by filter useEffect)
      const filters: any = {
        page: productPage,
        limit: PRODUCT_LIMIT,
        searchQuery,
        minPrice: parseFloat(minPrice) || undefined,
        maxPrice: parseFloat(maxPrice) || undefined,
        sortBy,
        sortOrder,
        inStockOnly,
      };
      if (selectedCategory !== 'all') filters.category = selectedCategory;
      if (selectedShop !== 'all') filters.shopId = selectedShop;
      fetchProducts(filters, true); // Fetch and append
    }
  }, [productPage]);

  useEffect(() => {
    // Fetch featured shops once on component mount
    fetchShops(false, { page: 1, limit: SHOP_LIMIT, isFeatured: true, sortBy: 'rating', sortOrder: 'desc' });
  }, [fetchShops]); // Add fetchShops to dependency array

  const handleAddToCart = (product: Product) => {
    addItem(product);
    toast({
      title: t("added_to_cart"),
      description: t("product_added_to_cart", { productName: product.name }),
    });
  };

  const handleToggleFavorite = (product: Product) => {
    if (isItemInWishlist(product.id)) {
      removeWishlistItem(product.id);
      toast({
        title: t('removed_from_wishlist'),
        description: t('product_removed_from_wishlist', { productName: product.name }),
      });
    } else {
      addWishlistItem(product);
      toast({
        title: t('added_to_wishlist'),
        description: t('product_added_to_wishlist', { productName: product.name }),
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-primary">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.05%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] bg-repeat"></div>
        <div className="container-responsive section-padding relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <div>
                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white text-balance leading-tight">
                  Découvrez l'Art
                  <span className="block text-yellow-300">Artisanal</span>
                </h1>
                <p className="text-xl text-white/90 mt-6 text-pretty max-w-lg">
                  Explorez notre collection unique de produits artisanaux créés avec passion par des artisans talentueux.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="btn-premium bg-white text-primary hover:bg-white/90 font-medium">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Découvrir les Produits
                </Button>
                <Button size="lg" variant="outline" className="btn-glass text-white border-white/30 hover:bg-white/10">
                  <Store className="w-5 h-5 mr-2" />
                  Explorer les Boutiques
                </Button>
              </div>

              <div className="flex items-center space-x-8 text-white/80">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{products.length}+</div>
                  <div className="text-sm">Produits</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{shops.length}+</div>
                  <div className="text-sm">Boutiques</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">500+</div>
                  <div className="text-sm">Artisans</div>
                </div>
              </div>
            </div>

            <div className="relative lg:block animate-slide-in-right">
              <div className="relative z-10">
                <img
                  src={heroImage}
                  alt="Artisanal Marketplace Hero"
                  className="w-full h-[400px] object-cover rounded-2xl shadow-glass"
                />
              </div>
              <div className="absolute -top-4 -right-4 w-full h-full bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-2xl blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      <div className="container-responsive py-12">
        {/* Filtres et recherche améliorés */}
        <div className="mb-12 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="font-display text-3xl font-bold">Notre Collection</h2>
            <p className="text-muted-foreground text-lg">Filtrez et trouvez exactement ce que vous cherchez</p>
          </div>

          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-card">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              <div className="md:col-span-2">
                <SearchBar
                  placeholder={t('search_products_shops_placeholder')}
                  onSearch={setSearchQuery}
                  className="h-12"
                />
              </div>

              {/* Category Filter */}
              <div>
                {/* <Label htmlFor="category-filter" className="text-sm mb-2 block font-medium">{t('category')}</Label> */}
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger id="category-filter" className="h-10">
                    <SelectValue placeholder={t('select_category')} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category === 'all' ? t('all_categories') : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Shop Filter */}
              <div>
                {/* <Label htmlFor="shop-filter" className="text-sm mb-2 block font-medium">{t('shop')}</Label> */}
                <Select value={selectedShop} onValueChange={setSelectedShop}>
                  <SelectTrigger id="shop-filter" className="h-10">
                    <SelectValue placeholder={t('select_shop')} />
                  </SelectTrigger>
                  <SelectContent>
                    {shopNames.map(shop => (
                      <SelectItem key={shop} value={shop}>
                        {shop === 'all' ? t('all_shops') : shop}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range Filter */}
              <div className="flex gap-2">
                <div>
                  {/* <Label htmlFor="min-price" className="text-sm mb-2 block font-medium">{t('min_price')}</Label> */}
                  <Input
                    id="min-price"
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="h-10"
                  />
                </div>
                <div>
                  {/* <Label htmlFor="max-price" className="text-sm mb-2 block font-medium">{t('max_price')}</Label> */}
                  <Input
                    id="max-price"
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="h-10"
                  />
                </div>
              </div>

              {/* Sort Options */}
              <div>
                {/* <Label htmlFor="sort-by" className="text-sm mb-2 block font-medium">{t('sort_by')}</Label> */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger id="sort-by" className="h-10">
                    <SelectValue placeholder={t('sort_by')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">{t('name')}</SelectItem>
                    <SelectItem value="price">{t('price')}</SelectItem>
                    <SelectItem value="stock">{t('stock')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="w-[140px] h-10">
                  <SelectValue placeholder={t('sort_order')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">{t('ascending')}</SelectItem>
                  <SelectItem value="desc">{t('descending')}</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="in-stock-only"
                  checked={inStockOnly}
                  onCheckedChange={(checked: boolean) => setInStockOnly(checked)}
                />
                <Label htmlFor="in-stock-only" className="text-sm">{t('in_stock_only')}</Label>
              </div>
            </div>

            <div className="flex items-center gap-6 mt-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="in-stock-only"
                  checked={inStockOnly}
                  onCheckedChange={(checked: boolean) => setInStockOnly(checked)}
                />
                <Label htmlFor="in-stock-only" className="text-sm">{t('in_stock_only')}</Label>
              </div>

              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="w-[140px] h-10">
                  <SelectValue placeholder={t('sort_order')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">{t('ascending')}</SelectItem>
                  <SelectItem value="desc">{t('descending')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <Card className="card-glass hover-lift">
            <CardContent className="p-6 text-center">
              <Store className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-primary">
                {isLoadingShops ? <Skeleton className="h-8 w-12 mx-auto" /> : shops.length || '0'}
              </h3>
              <p className="text-sm text-muted-foreground">Boutiques Partenaires</p>
            </CardContent>
          </Card>
          <Card className="card-glass hover-lift">
            <CardContent className="p-6 text-center">
              <ShoppingCart className="w-8 h-8 text-secondary mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-secondary">
                {isLoadingProducts ? <Skeleton className="h-8 w-12 mx-auto" /> : products.length || '0'}
              </h3>
              <p className="text-sm text-muted-foreground">Produits Disponibles</p>
            </CardContent>
          </Card>
          <Card className="card-glass hover-lift">
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 text-success mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-success">50K+</h3>
              <p className="text-sm text-muted-foreground">Clients Satisfaits</p>
            </CardContent>
          </Card>
        </div>

        {/* Boutiques en vedette */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display text-3xl font-bold">Boutiques en Vedette</h2>
              <p className="text-muted-foreground mt-2">Découvrez nos artisans partenaires</p>
            </div>
            <Link to="/shops">
              <Button variant="outline" className="hover-glow">Voir Toutes les Boutiques</Button>
            </Link>
          </div>

          {isLoadingShops ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="card-glass">
                  <Skeleton className="h-48 w-full rounded-t-xl" />
                  <CardContent className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-3" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3 mb-4" />
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-10 w-20" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : shopsError ? (
            <Alert className="border-destructive/50 bg-destructive/5">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>{shopsError}</span>
                <Button variant="outline" size="sm" onClick={() => fetchShops(false, { page: 1, limit: SHOP_LIMIT, isFeatured: true, sortBy: 'rating', sortOrder: 'desc' })}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Réessayer
                </Button>
              </AlertDescription>
            </Alert>
          ) : shops.length === 0 ? (
            <div className="text-center py-16">
              <Store className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Aucune boutique disponible</h3>
              <p className="text-muted-foreground">Revenez plus tard pour découvrir de nouvelles boutiques</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
              {shops.slice(0, 6).map((shop) => (
                <Card key={shop.id} className="card-glass hover-lift group">
                  <div className="h-48 overflow-hidden rounded-t-xl">
                    <img
                      src={shop.image}
                      alt={shop.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-display font-semibold text-xl">{shop.name}</h3>
                      <div className="flex items-center text-sm text-amber-500">
                        <Star className="w-4 h-4 fill-current mr-1" />
                        <span>{shop.rating?.toFixed(1) || 'Nouveau'}</span>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-4">{shop.description}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs">
                        {shop.productsCount || 0} produits
                      </Badge>
                      <Link to={`/shops/${shop.id}`}>
                        <Button size="sm" className="btn-glass text-xs">
                          Visiter
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Produits */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display text-3xl font-bold">Produits Populaires</h2>
              <p className="text-muted-foreground mt-2">
                {isLoadingProducts ? 'Chargement...' : `${products.length} produits trouvés`}
              </p>
            </div>
          </div>

          {isLoadingProducts ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="card-glass">
                  <Skeleton className="h-56 w-full rounded-t-xl" />
                  <CardContent className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-3" />
                    <Skeleton className="h-4 w-1/2 mb-2" />
                    <Skeleton className="h-4 w-full mb-4" />
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-8 w-16" />
                      <Skeleton className="h-10 w-24" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : productsError ? (
            <Alert className="border-destructive/50 bg-destructive/5">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>{productsError}</span>
                <Button variant="outline" size="sm" onClick={() => fetchProducts()}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Réessayer
                </Button>
              </AlertDescription>
            </Alert>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Aucun produit trouvé</h3>
              <p className="text-muted-foreground">
                Essayez d'ajuster vos critères de recherche ou revenez plus tard
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <Card key={product.id} className="card-glass hover-lift group" ref={products.length === index + 1 ? lastProductElementRef : null}>
                  <Link to={`/products/${product.id}`} className="relative block">
                    <div className="h-56 overflow-hidden rounded-t-xl">
                      {(product.images && product.images.length > 0) ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <Store className="w-12 h-12 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <Button
                      size="icon"
                      variant={isItemInWishlist(product.id) ? "default" : "secondary"}
                      className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg hover-glow"
                      onClick={(e) => { e.preventDefault(); handleToggleFavorite(product); }}
                    >
                      <Heart className={`w-4 h-4 ${isItemInWishlist(product.id) ? 'fill-current' : ''}`} />
                    </Button>
                    {product.stock < 10 && product.stock > 0 && (
                      <Badge variant="destructive" className="absolute top-3 left-3">
                        Stock limité: {product.stock}
                      </Badge>
                    )}
                    {product.stock === 0 && (
                      <Badge variant="destructive" className="absolute top-3 left-3">
                        Épuisé
                      </Badge>
                    )}
                  </Link>

                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
                      <span className="text-xl font-bold text-primary">
                        {product.price}€
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground mb-3">
                      <Store className="w-4 h-4 mr-1" />
                      <span className="line-clamp-1">{product.shopName}</span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <Rating
                        value={getReviewsByProductId(product.id).reduce((acc, review) => acc + review.rating, 0) / getReviewsByProductId(product.id).length || 0}
                        count={getReviewsByProductId(product.id).length}
                      />
                      <Button
                        size="sm"
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock === 0}
                        className="btn-premium"
                      >
                        <ShoppingCart className="w-4 h-4 mr-1" />
                        {product.stock === 0 ? 'Épuisé' : 'Ajouter'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {isLoadingProducts && currentProductPage < totalProductPages && (
            <div className="flex justify-center items-center py-8">
              <RefreshCw className="w-6 h-6 animate-spin text-primary mr-3" />
              <span className="text-muted-foreground">Chargement de plus de produits...</span>
            </div>
          )}

          {!isLoadingProducts && products.length > 0 && currentProductPage >= totalProductPages && (
            <div className="text-center text-muted-foreground py-8">
              <p className="text-lg">🎉 Vous avez exploré toute notre collection !</p>
              <p className="text-sm mt-2">Revenez bientôt pour découvrir de nouveaux produits</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};