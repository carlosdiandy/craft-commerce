import { useState, useEffect } from 'react';
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
import { useCartStore } from '@/stores/cartStore';
import { Product } from '@/stores/productStore';
import { useWishlistStore } from '@/stores/wishlistStore';
import { toast } from '@/hooks/use-toast';
import { SearchBar } from '@/components/common/SearchBar';
import heroImage from '@/assets/hero-ecommerce.jpg';
import { useTranslation } from 'react-i18next';
import { useReviewStore } from '@/stores/reviewStore';
import { Rating } from '@/components/ui/Rating';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import axios from 'axios';
import { Shop } from '@/stores/authStore';
import { ProductResponse, ShopResponse } from '@/types/api';
import { apiGet } from '@/services/apiService';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';


// Données mockées pour la démonstration
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro',
    price: 1199,
    images: [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800',
      'https://images.unsplash.com/photo-1607936854279-55e8a427428f?w=800',
      'https://images.unsplash.com/photo-1580910051074-3ed686210cf7?w=800',
    ],
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
    images: [
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800',
      'https://images.unsplash.com/photo-1531297484441-ed2c03377c5a?w=800',
      'https://images.unsplash.com/photo-1580528322430-a1277069877e?w=800',
    ],
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
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800',
      'https://images.unsplash.com/photo-1595951700296-12945645b01a?w=800',
      'https://images.unsplash.com/photo-1552066344-2464c15d55c5?w=800',
    ],
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
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800',
      'https://images.unsplash.com/photo-1566150905421-ce7b99116179?w=800',
      'https://images.unsplash.com/photo-1584917865442-ce845516d89d?w=800',
    ],
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
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<string>('asc');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [selectedShop, setSelectedShop] = useState<string>('all');
  const [products, setProducts] = useState<Product[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isLoadingShops, setIsLoadingShops] = useState(false);
  const [productsError, setProductsError] = useState<string | null>(null);
  const [shopsError, setShopsError] = useState<string | null>(null);

  const { addItem } = useCartStore();
  const { addItem: addWishlistItem, removeItem: removeWishlistItem, isItemInWishlist } = useWishlistStore();
  const { reviews } = useReviewStore();

  const getReviewsByProductId = (productId: string) => {
    return reviews.filter(review => review.productId === productId);
  };

  const categories = ['all', 'Électronique', 'Mode', 'Maison', 'Sport'];
  const shopNames = ['all', ...new Set(mockProducts.map(p => p.shopName))];

  const fetchProducts = async () => {
    setIsLoadingProducts(true);
    setProductsError(null);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      if (sortBy) params.append('sortBy', sortBy);
      if (sortOrder) params.append('sortOrder', sortOrder);
      if (inStockOnly) params.append('inStockOnly', 'true');
      if (selectedShop !== 'all') params.append('shopName', selectedShop);

      const response = await apiGet<ProductResponse[]>(`/products/?${params.toString()}`);
      if (response.success && response.data) {
        setProducts(response.data);
        setProductsError(null);
      } else {
        setProductsError(response.error || 'Failed to load products');
        setProducts([]);
      }
    } catch (error) {
      setProductsError('Network error - Unable to connect to server');
      setProducts([]);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const fetchShops = async () => {
    setIsLoadingShops(true);
    setShopsError(null);
    try {
      const response = await apiGet<ShopResponse[]>(`/shops/`);
      if (response.success && response.data) {
        // Map ShopResponse to Shop format
        const mappedShops: Shop[] = response.data.map(shop => ({
          id: shop.id,
          name: shop.name,
          description: shop.description,
          image: shop.image || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
          ownerId: shop.ownerId,
          status: shop.status as 'active' | 'suspended',
          createdAt: shop.createdAt,
          products: [],
          shopUsers: []
        }));
        setShops(mappedShops);
        setShopsError(null);
      } else {
        setShopsError(response.error || 'Failed to load shops');
        setShops([]);
      }
    } catch (error) {
      setShopsError('Network error - Unable to connect to server');
      setShops([]);
    } finally {
      setIsLoadingShops(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchShops();
  }, [searchQuery, selectedCategory, minPrice, maxPrice, sortBy, sortOrder, inStockOnly, selectedShop]);

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
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section
        className="relative h-[300px] sm:h-[400px] lg:h-[500px] bg-cover bg-center flex items-center justify-center text-white overflow-hidden"
        style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.4)), url(${heroImage})` }}
      >
        <div className="text-center space-y-4 sm:space-y-6 max-w-4xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
            {t('discover_marketplace_title')}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-200 leading-relaxed max-w-2xl mx-auto">
            {t('discover_marketplace_description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center max-w-md mx-auto">
            <Button size="lg" variant="hero" asChild className="w-full sm:w-auto shadow-glow">
              <Link to="/shops">
                <Store className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
                {t('browse_shops')}
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto text-white border-white hover:bg-white/10">
              <TrendingUp className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
              {t('trending_products')}
            </Button>
          </div>
        </div>
      </section>

      <div className="container px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl mx-auto">
        {/* Barre de recherche et filtres */}
        <div className="mb-6 lg:mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1">
              <SearchBar
                placeholder={t('search_products_shops_placeholder')}
                onSearch={setSearchQuery}
                className="h-10 sm:h-12"
              />
            </div>
            {/* Advanced Filters Button - now opens a filter section */}
            <Button variant="outline" className="flex items-center gap-2 w-full sm:w-auto h-10 sm:h-12">
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">{t('advanced_filters')}</span>
              <span className="sm:hidden">Filtres</span>
            </Button>
          </div>

          {/* Filter and Sort Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4">
            {/* Category Filter */}
            <div className="sm:col-span-1">
              <Label htmlFor="category-filter" className="text-xs sm:text-sm mb-1 block font-medium">{t('category')}</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger id="category-filter" className="h-9 sm:h-10">
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
              <Label htmlFor="shop-filter" className="mb-1 block">{t('shop')}</Label>
              <Select value={selectedShop} onValueChange={setSelectedShop}>
                <SelectTrigger id="shop-filter">
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
            <div className="flex items-end gap-2">
              <div>
                <Label htmlFor="min-price" className="mb-1 block">{t('min_price')}</Label>
                <Input
                  id="min-price"
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <Label htmlFor="max-price" className="mb-1 block">{t('max_price')}</Label>
                <Input
                  id="max-price"
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            {/* Sort By */}
            <div>
              <Label htmlFor="sort-by" className="mb-1 block">{t('sort_by')}</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger id="sort-by">
                  <SelectValue placeholder={t('sort_by')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">{t('name')}</SelectItem>
                  <SelectItem value="price">{t('price')}</SelectItem>
                  <SelectItem value="stock">{t('stock')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort Order */}
            <div>
              <Label htmlFor="sort-order" className="mb-1 block">{t('sort_order')}</Label>
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger id="sort-order">
                  <SelectValue placeholder={t('sort_order')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">{t('ascending')}</SelectItem>
                  <SelectItem value="desc">{t('descending')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* In Stock Only Checkbox */}
            <div className="flex items-center space-x-2 mt-auto pb-2">
              <Checkbox
                id="in-stock-only"
                checked={inStockOnly}
                onCheckedChange={(checked: boolean) => setInStockOnly(checked)}
              />
              <Label htmlFor="in-stock-only">{t('in_stock_only')}</Label>
            </div>
          </div>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <Card className="hover:shadow-hover transition-all duration-300 border-0 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardContent className="p-4 sm:p-6 text-center">
              <Store className="w-6 sm:w-8 h-6 sm:h-8 text-primary mx-auto mb-2" />
              <h3 className="text-xl sm:text-2xl font-bold text-primary">
                {isLoadingShops ? <Skeleton className="h-6 sm:h-8 w-8 sm:w-12 mx-auto" /> : shops.length || '0'}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">Partner Shops</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-hover transition-all duration-300 border-0 bg-gradient-to-br from-secondary/5 to-secondary/10">
            <CardContent className="p-4 sm:p-6 text-center">
              <ShoppingCart className="w-6 sm:w-8 h-6 sm:h-8 text-secondary mx-auto mb-2" />
              <h3 className="text-xl sm:text-2xl font-bold text-secondary">
                {isLoadingProducts ? <Skeleton className="h-6 sm:h-8 w-8 sm:w-12 mx-auto" /> : products.length || '0'}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">Available Products</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-hover transition-all duration-300 border-0 bg-gradient-to-br from-success/5 to-success/10">
            <CardContent className="p-4 sm:p-6 text-center">
              <Users className="w-6 sm:w-8 h-6 sm:h-8 text-success mx-auto mb-2" />
              <h3 className="text-xl sm:text-2xl font-bold text-success">
                {(isLoadingShops || isLoadingProducts) ? <Skeleton className="h-6 sm:h-8 w-12 sm:w-16 mx-auto" /> : '50K+'}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">Satisfied Customers</p>
            </CardContent>
          </Card>
        </div>

        {/* Boutiques en vedette */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">Featured Shops</h2>
            <Link to="/shops">
              <Button variant="outline">View All Shops</Button>
            </Link>
          </div>

          {isLoadingShops ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <CardContent className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-3" />
                    <Skeleton className="h-4 w-1/2 mb-3" />
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-8 w-16" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : shopsError ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>{shopsError}</span>
                <Button variant="outline" size="sm" onClick={fetchShops}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          ) : shops.length === 0 ? (
            <div className="text-center py-12">
              <Store className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No shops available</h3>
              <p className="text-muted-foreground">Check back later for new shops</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shops.map((shop) => (
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
                        <span className="text-sm font-medium ml-1">4.8</span>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm mb-3">{shop.description}</p>
                    <div className="flex items-center text-sm text-muted-foreground mb-3">
                      <MapPin className="w-4 h-4 mr-1" />
                      Location
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">2 {t('products_count', { count: 2 })}</Badge>
                      <Link to={`/shops/${shop.id}`} >
                        <Button size="sm" variant="outline">{t('visit')}</Button>
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
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">Popular Products</h2>
            <div className="text-sm text-muted-foreground">
              {isLoadingProducts ? 'Loading...' : `${products.length} products found`}
            </div>
          </div>

          {isLoadingProducts ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <CardHeader className="pb-2">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent className="pb-2">
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3 mb-2" />
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-8 w-16" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Skeleton className="h-10 w-full" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : productsError ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>{productsError}</span>
                <Button variant="outline" size="sm" onClick={fetchProducts}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria or check back later
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-hover transition-all duration-300 group">
                  <Link to={`/products/${product.id}`} className="relative h-48 overflow-hidden block">
                    {(product.images && product.images.length > 0) && (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                    <Button
                      size="icon"
                      variant={isItemInWishlist(product.id) ? "default" : "outline"}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => { e.preventDefault(); handleToggleFavorite(product); }}
                    >
                      <Heart className={`w-4 h-4 ${isItemInWishlist(product.id) ? 'fill-current' : ''}`} />
                    </Button>
                    {product.stock < 10 && (
                      <Badge variant="destructive" className="absolute top-2 left-2">
                        Limited stock: {product.stock}
                      </Badge>
                    )}
                  </Link>

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
                      <Rating value={getReviewsByProductId(product.id).reduce((acc, review) => acc + review.rating, 0) / getReviewsByProductId(product.id).length} count={getReviewsByProductId(product.id).length} />
                    </div>
                  </CardContent>

                  <CardFooter className="pt-2">
                    <Button
                      className="w-full"
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
