import { useState, useEffect } from 'react';
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

  const { addItem } = useCartStore();
  const { addWishlistItem, removeWishlistItem, isItemInWishlist } = useWishlistStore();
  const { getReviewsByProductId } = useReviewStore();

  const categories = ['all', 'Électronique', 'Mode', 'Maison', 'Sport'];
  const shopNames = ['all', ...new Set(mockProducts.map(p => p.shopName))];

  const fetchProducts = async () => {
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

      const response = await axios.get(`http://localhost:8080/api/products/?${params.toString()}`);
      setProducts(response.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setProducts([]); // Clear products on error
    }
  };

  useEffect(() => {
    fetchProducts();
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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative h-96 bg-cover bg-center flex items-center justify-center text-white"
        style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${heroImage})` }}
      >
        <div className="text-center space-y-6 max-w-2xl px-4">
          <h1 className="text-5xl font-bold">
            {t('discover_marketplace_title')}
          </h1>
          <p className="text-xl text-gray-200">
            {t('discover_marketplace_description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="hero" asChild>
              <Link to="/shops">
                <Store className="w-5 h-5 mr-2" />
                {t('browse_shops')}
              </Link>
            </Button>
            <Button size="lg" variant="link" className="text-white border-white hover:bg-white/10">
              <TrendingUp className="w-5 h-5 mr-2" />
              {t('trending_products')}
            </Button>
          </div>
        </div>
      </section>

      <div className="container px-4 py-8">
        {/* Barre de recherche et filtres */}
        <div className="mb-6 lg:mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <SearchBar
                placeholder={t('search_products_shops_placeholder')}
                onSearch={setSearchQuery}
                className="h-12"
              />
            </div>
            {/* Advanced Filters Button - now opens a filter section */}
            <Button variant="outline" className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4" />
              {t('advanced_filters')}
            </Button>
          </div>

          {/* Filter and Sort Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div>
              <Label htmlFor="category-filter" className="mb-1 block">{t('category')}</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger id="category-filter">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Store className="w-8 h-8 text-primary mx-auto mb-2" />
              <h3 className="text-2xl font-bold">{mockShops.length}</h3>
              <p className="text-muted-foreground">{t('partner_shops')}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <ShoppingCart className="w-8 h-8 text-secondary mx-auto mb-2" />
              <h3 className="text-2xl font-bold">{mockProducts.length}K+</h3>
              <p className="text-muted-foreground">{t('available_products')}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 text-success mx-auto mb-2" />
              <h3 className="text-2xl font-bold">50K+</h3>
              <p className="text-muted-foreground">{t('satisfied_customers')}</p>
            </CardContent>
          </Card>
        </div>

        {/* Boutiques en vedette */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">{t('featured_shops')}</h2>
            <Link to="/shops">
              <Button variant="outline">{t('view_all_shops')}</Button>
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
                    <Badge variant="secondary">{shop.productsCount} {t('products_count', { count: shop.productsCount })}</Badge>
                    <Link to={`/shops/${shop.id}`} >
                      <Button size="sm" variant="outline">{t('visit')}</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Produits */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">{t('popular_products')}</h2>
            <div className="text-sm text-muted-foreground">
              {products.length} {t('products_found', { count: products.length })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-hover transition-all duration-300 group">
                <Link to={`/products/${product.id}`} className="relative h-48 overflow-hidden block">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
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
                      {t('limited_stock', { stock: product.stock })}
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
                    {product.stock === 0 ? t('out_of_stock') : t('add_to_cart')}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {products.length === 0 && (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t('no_product_found')}</h3>
              <p className="text-muted-foreground">
                {t('try_changing_criteria')}
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );