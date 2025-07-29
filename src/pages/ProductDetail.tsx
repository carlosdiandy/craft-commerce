
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { ReviewList } from '@/components/reviews/ReviewList';
import { ReviewForm } from '@/components/reviews/ReviewForm';
import { useReviewStore } from '@/stores/reviewStore';
import { Rating } from '@/components/ui/Rating';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Heart, Store, Star } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { Product, ProductVariant } from '@/stores/productStore';
import { useWishlistStore } from '@/stores/wishlistStore';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Magnifier } from '@/components/ui/magnifier'; // Import the Magnifier component

import axios from 'axios';

export const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState<Product | null>(null);

  const { addItem } = useCartStore();
  const { addItem: addWishlistItem, removeItem: removeWishlistItem, isItemInWishlist } = useWishlistStore();
  const { t } = useTranslation();
  const { reviews, fetchReviews, averageRating } = useReviewStore();

  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [selectedMaterial, setSelectedMaterial] = useState<string | undefined>(undefined);
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/products/${productId}`);
        setProduct(response.data);
        if (response.data.images && response.data.images.length > 0) {
          setSelectedImage(response.data.images[0]);
        }
        if (response.data.variants && response.data.variants.length > 0) {
          const firstVariant = response.data.variants[0];
          if (firstVariant.color) setSelectedColor(firstVariant.color);
          if (firstVariant.size) setSelectedSize(firstVariant.size);
          if (firstVariant.material) setSelectedMaterial(firstVariant.material);
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
        setProduct(null);
      }
    };

    if (productId) {
      fetchProduct();
      fetchReviews(productId);
    }
  }, [productId, fetchReviews]);

  useEffect(() => {
    if (product) {
      fetchReviews(product.id);
      // Set initial selected image to the first one
      if (product.images && product.images.length > 0) {
        setSelectedImage(product.images[0]);
      }

      // Initialize selected variants if product has them
      if (product.variants && product.variants.length > 0) {
        const firstVariant = product.variants[0];
        if (firstVariant.color) setSelectedColor(firstVariant.color);
        if (firstVariant.size) setSelectedSize(firstVariant.size);
        if (firstVariant.material) setSelectedMaterial(firstVariant.material);
      }
    }
  }, [productId, product, fetchReviews]);

  const getAvailableOptions = (variantKey: 'color' | 'size' | 'material') => {
    if (!product || !product.variants) return [];
    const options = new Set<string>();
    product.variants.forEach(variant => {
      if (variant[variantKey]) {
        options.add(variant[variantKey] as string);
      }
    });
    return Array.from(options);
  };

  const availableColors = getAvailableOptions('color');
  const availableSizes = getAvailableOptions('size');
  const availableMaterials = getAvailableOptions('material');

  const currentVariant = product?.variants?.find(variant => {
    return (
      (!selectedColor || variant.color === selectedColor) &&
      (!selectedSize || variant.size === selectedSize) &&
      (!selectedMaterial || variant.material === selectedMaterial)
    );
  });

  const displayPrice = currentVariant ? product!.price + (currentVariant.priceAdjustment || 0) : product?.price;
  const displayStock = currentVariant ? currentVariant.stockQuantity : product?.stock;

  const handleAddToCart = () => {
    if (product) {
      addItem(product, 1, {
        ...(selectedColor && { color: selectedColor }),
        ...(selectedSize && { size: selectedSize }),
        ...(selectedMaterial && { material: selectedMaterial }),
      });
      toast({
        title: t("added_to_cart"),
        description: t("product_added_to_cart", { productName: product.name }),
      });
    }
  };

  const handleToggleFavorite = () => {
    if (!product) return;

    const variantDetails = {
      ...(selectedColor && { color: selectedColor }),
      ...(selectedSize && { size: selectedSize }),
      ...(selectedMaterial && { material: selectedMaterial }),
    };

    if (isItemInWishlist(product.id, variantDetails)) {
      removeWishlistItem(product.id, variantDetails);
      toast({
        title: t('removed_from_wishlist'),
        description: t('product_removed_from_wishlist', { productName: product.name }),
      });
    } else {
      addWishlistItem(product, 1, variantDetails);
      toast({
        title: t('added_to_wishlist'),
        description: t('product_added_to_wishlist', { productName: product.name }),
      });
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">{t('product_not_found')}</h1>
          <p className="text-muted-foreground mb-6">{t('product_not_found_description')}</p>
          <Link to="/">
            <Button>{t('back_to_marketplace')}</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col items-center">
            <div className="relative w-full h-96 rounded-lg overflow-hidden mb-4">
              {selectedImage && (
                <Magnifier
                  src={selectedImage}
                  alt={product.name}
                  width="100%"
                  height="100%"
                  magnifierRadius={100}
                  magnifierScale={2}
                />
              )}
              <Button
                size="icon"
                variant={isItemInWishlist(product.id, {
                  ...(selectedColor && { color: selectedColor }),
                  ...(selectedSize && { size: selectedSize }),
                  ...(selectedMaterial && { material: selectedMaterial }),
                }) ? "default" : "outline"}
                className="absolute top-4 right-4"
                onClick={handleToggleFavorite}
              >
                <Heart className={`w-5 h-5 ${isItemInWishlist(product.id, {
                  ...(selectedColor && { color: selectedColor }),
                  ...(selectedSize && { size: selectedSize }),
                  ...(selectedMaterial && { material: selectedMaterial }),
                }) ? 'fill-current' : ''}`} />
              </Button>
            </div>
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {product.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  className={`w-20 h-20 object-cover rounded-md cursor-pointer border-2 ${selectedImage === img ? 'border-primary' : 'border-transparent'}`}
                  onClick={() => setSelectedImage(img)}
                />
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-2">{product.category}</Badge>
              <h1 className="text-4xl font-bold">{product.name}</h1>
              <div className="mt-2">
                <Rating value={averageRating} count={reviews.length} />
              </div>
              <p className="text-muted-foreground text-lg">{product.description}</p>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-5xl font-bold text-primary">{displayPrice}€</span>
              {displayStock !== undefined && displayStock < 10 && displayStock > 0 && (
                <Badge variant="outline">{t('limited_stock', { stock: displayStock })}</Badge>
              )}
              {displayStock === 0 && (
                <Badge variant="destructive">{t('out_of_stock')}</Badge>
              )}
            </div>

            {product?.variants && product.variants.length > 0 && (
              <div className="space-y-4">
                {availableColors.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">{t('color')}</h3>
                    <Select value={selectedColor} onValueChange={setSelectedColor}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder={t('select_color')} />
                      </SelectTrigger>
                      <SelectContent>
                        {availableColors.map(color => (
                          <SelectItem key={color} value={color}>{color}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {availableSizes.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">{t('size')}</h3>
                    <Select value={selectedSize} onValueChange={setSelectedSize}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder={t('select_size')} />
                      </SelectTrigger>
                      <SelectContent>
                        {availableSizes.map(size => (
                          <SelectItem key={size} value={size}>{size}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {availableMaterials.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">{t('material')}</h3>
                    <Select value={selectedMaterial} onValueChange={setSelectedMaterial}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder={t('select_material')} />
                      </SelectTrigger>
                      <SelectContent>
                        {availableMaterials.map(material => (
                          <SelectItem key={material} value={material}>{material}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-4">
              <Link to={`/shops/${product.shopId}`} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                <Store className="w-5 h-5" />
                {t('visit_shop')}: <span className="font-medium">{product.shopName}</span>
              </Link>
              <Button
                className="w-full py-6 text-lg"
                onClick={handleAddToCart}
                disabled={displayStock === 0 || !currentVariant}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {displayStock === 0 ? t('out_of_stock') : t('add_to_cart')}
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>{t('additional_details')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>{t('product_id')}: {product.id}</li>
                  <li>{t('sold_by')}: {product.shopName}</li>
                  <li>{t('category')}: {product.category}</li>
                  <li>{t('available_stock')}: {displayStock}</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-8">
          <ReviewList productId={product.id} />
        </div>

        <div className="mt-8">
          <ReviewForm productId={product.id} />
        </div>
      </div>
    </div>
  );
};
