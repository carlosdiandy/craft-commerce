import { useProductStore } from '@/stores/productStore';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ProductListProps {
  shopId: string;
}

export const ProductList = ({ shopId }: ProductListProps) => {
  const { products, fetchProductsByShop } = useProductStore();
  const { t } = useTranslation();

  useEffect(() => {
    fetchProductsByShop(shopId);
  }, [shopId, fetchProductsByShop]);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{t('products')}</CardTitle>
          <Link to={`/products/manage?shopId=${shopId}`}>
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              {t('add_product')}
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((product) => (
                  <Card key={product.id}>
                    <CardHeader>
                      <img src={product.images[0]} alt={product.name} className="rounded-t-lg" />
                    </CardHeader>
                    <CardContent>
                      <h3 className="font-semibold">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">{product.price} €</p>
                      <Link to={`/products/manage/${product.id}?shopId=${shopId}`}>
                        <Button variant="link" className="p-0">
                          {t('edit')}
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">{t('no_products_found')}</p>
                <Link to={`/products/manage?shopId=${shopId}`}>
                  <Button variant="outline" className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    {t('add_your_first_product')}
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
    </Card>
  );
};