import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuthStore, Shop } from '@/stores/authStore';
import { useProductStore, Product } from '@/stores/productStore';
import { toast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { XCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const productSchema = z.object({
  productName: z.string().min(1, { message: "Le nom du produit est requis." }).max(100, { message: "Le nom du produit est trop long." }),
  productDescription: z.string().min(1, { message: "La description est requise." }).max(500, { message: "La description est trop longue." }),
  productPrice: z.coerce.number().min(0.01, { message: "Le prix doit être supérieur à 0." }),
  productStock: z.coerce.number().int().min(0, { message: "Le stock ne peut pas être négatif." }),
});

type ProductFormValues = z.infer<typeof productSchema>;

export const ProductManagement = () => {
  const { user } = useAuthStore();
  const { addProduct, updateProduct, deleteProduct } = useProductStore();
  const [selectedShopId, setSelectedShopId] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productImages, setProductImages] = useState<string[]>([]);
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ProductFormValues>({
    defaultValues: {
      productName: '',
      productDescription: '',
      productPrice: 0,
      productStock: 0,
    },
  });

  const selectedShop = user?.shops?.find(shop => shop.id === selectedShopId);

  useEffect(() => {
    if (editingProduct) {
      setProductImages(editingProduct.images || []);
      reset({
        productName: editingProduct.name,
        productDescription: editingProduct.description,
        productPrice: editingProduct.price,
        productStock: editingProduct.stock,
      });
    } else {
      setProductImages([]);
      reset({
        productName: '',
        productDescription: '',
        productPrice: 0,
        productStock: 0,
      });
    }
  }, [editingProduct, reset]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductImages(prevImages => [...prevImages, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setProductImages(prevImages => prevImages.filter((_, index) => index !== indexToRemove));
  };

  const onSubmit: SubmitHandler<ProductFormValues> = (values) => {
    if (!selectedShopId) {
      toast({
        title: t('error'),
        description: t('select_shop_first'),
        variant: 'destructive',
      });
      return;
    }

    if (editingProduct) {
      const updatedProduct: Partial<Product> = {
        name: values.productName,
        description: values.productDescription,
        price: values.productPrice,
        stock: values.productStock,
        images: productImages,
      };
      updateProduct(editingProduct.id, updatedProduct);
      toast({
        title: t('product_updated'),
        description: t('product_updated_description', { productName: editingProduct.name }),
      });
      setEditingProduct(null);
    } else {
      const newProduct: Product = {
        id: Date.now().toString(),
        name: values.productName,
        description: values.productDescription,
        price: values.productPrice,
        stock: values.productStock,
        images: productImages,
        shopId: selectedShopId,
        shopName: selectedShop?.name || '',
        category: 'General',
      };
      addProduct(newProduct);
      toast({
        title: t('product_added'),
        description: t('product_added_description', { productName: newProduct.name }),
      });
      reset();
      setProductImages([]);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
  };

  const handleDeleteProduct = (productId: string) => {
    if (!selectedShopId) return;
    deleteProduct(productId);
    toast({
      title: t('product_deleted'),
      description: t('product_deleted_description'),
    });
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">{t('manage_products')}</h1>
            <p className="text-muted-foreground">{t('manage_products_description')}</p>
          </div>
          <Link to="/backoffice">
            <Button variant="outline">{t('back_to_backoffice')}</Button>
          </Link>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>{t('select_shop')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Select onValueChange={setSelectedShopId}>
                <SelectTrigger className="w-full lg:w-1/3">
                  <SelectValue placeholder={t('select_a_shop')} />
                </SelectTrigger>
                <SelectContent>
                  {user?.shops?.map((shop) => (
                    <SelectItem key={shop.id} value={shop.id}>
                      {shop.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {selectedShop && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>{editingProduct ? t('edit_product') : t('add_product')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="productName">{t('product_name')}</Label>
                        <Input id="productName" {...register("productName")} />
                        {errors.productName && (
                          <p className="text-destructive text-sm">{errors.productName.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="productDescription">{t('description')}</Label>
                        <Input id="productDescription" {...register("productDescription")} />
                        {errors.productDescription && (
                          <p className="text-destructive text-sm">{errors.productDescription.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="productPrice">{t('price')}</Label>
                        <Input id="productPrice" type="number" step="0.01" {...register("productPrice")} />
                        {errors.productPrice && (
                          <p className="text-destructive text-sm">{errors.productPrice.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="productStock">{t('stock')}</Label>
                        <Input id="productStock" type="number" {...register("productStock")} />
                        {errors.productStock && (
                          <p className="text-destructive text-sm">{errors.productStock.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="productImages">{t('product_images')}</Label>
                        <Input id="productImages" name="productImages" type="file" multiple onChange={handleImageUpload} />
                        <div className="flex flex-wrap gap-2 mt-2">
                          {productImages.map((image, index) => (
                            <div key={index} className="relative w-24 h-24">
                              <img src={image} alt={`Product image ${index + 1}`} className="w-full h-full object-cover rounded-md" />
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                                onClick={() => handleRemoveImage(index)}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                      <Button type="submit">{editingProduct ? t('update_product') : t('add_product')}</Button>
                      {editingProduct && (
                        <Button type="button" variant="outline" onClick={() => setEditingProduct(null)}>{t('cancel')}</Button>
                      )}
                    </form>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('shop_products')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedShop?.products && selectedShop.products.length > 0 ? (
                        selectedShop.products.map((product) => (
                          <div key={product.id} className="p-4 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-4">
                                <img src={product.images[0] || 'https://via.placeholder.com/150'} alt={product.name} className="w-16 h-16 object-cover rounded-lg" />
                                <div>
                                  <h4 className="font-medium">{product.name}</h4>
                                  <p className="text-sm text-muted-foreground">{product.price}€ | {t('stock')}: {product.stock}</p>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => handleEditProduct(product)}>{t('edit')}</Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDeleteProduct(product.id)}>{t('delete')}</Button>
                              </div>
                            </div>
                            {product.variants && product.variants.length > 0 && (
                              <div className="mt-4 space-y-2">
                                <h5 className="font-semibold text-sm">{t('variants')}:</h5>
                                {product.variants.map(variant => (
                                  <div key={variant.id} className="flex items-center justify-between text-sm bg-muted p-2 rounded-md">
                                    <span>
                                      {variant.color && `${t('color')}: ${variant.color}`}
                                      {variant.size && `, ${t('size')}: ${variant.size}`}
                                      {variant.material && `, ${t('material')}: ${variant.material}`}
                                    </span>
                                    <div className="flex items-center gap-2">
                                       <span>{t('stock')}: {variant.stock}</span>
                                       <Input
                                         type="number"
                                         defaultValue={variant.stock}
                                        className="w-20"
                                        onChange={(e) => console.log(`Update variant ${variant.id} stock to ${e.target.value}`)} // Implement actual update
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground text-center">{t('no_products_in_shop')}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};