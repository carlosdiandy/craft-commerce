
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useShopStore } from '@/stores/shopStore';
import { useAuthStore, Shop } from '@/stores/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductList } from '@/components/common/ProductList';
import { UserList } from '@/components/common/UserList';
import { OrderList } from '@/components/common/OrderList';

export const ShopManagement = () => {
  const { shopId } = useParams<{ shopId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { shops, fetchShops, updateShop, createShop, isLoading } = useShopStore();
  const { user } = useAuthStore();
  const [shop, setShop] = useState<Partial<Shop> | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchShops();
  }, [fetchShops]);

  useEffect(() => {
    if (shopId && shops.length > 0) {
      const currentShop = shops.find((s) => s.id === shopId);
      if (currentShop) {
        setShop(currentShop);
      } else {
        // If shop not found, maybe redirect or show an error
        navigate('/backoffice');
      }
    }
    if (!shopId) {
        setIsEditing(true)
    }
  }, [shopId, shops, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (shop) {
      setShop({ ...shop, [e.target.name]: e.target.value });
    }
  };

  const handleSave = async () => {
    if (shop && shopId) {
      const response = await updateShop(shopId, shop);
      if (response.success) {
        toast({ title: t('shop_updated_success') });
        setIsEditing(false);
      } else {
        toast({ title: t('shop_updated_error'), description: response.error, variant: 'destructive' });
      }
    }
    if (!shopId && shop) {
        const response = await createShop(shop as Shop);
        if (response.success) {
          toast({ title: t('shop_created_success') });
          navigate(`/shops/manage/${response.data?.id}`)
        } else {
          toast({ title: t('shop_created_error'), description: response.error, variant: 'destructive' });
        }
      }
  };

  if (isLoading && !shop) {
    return <div>{t('loading_shop_details')}</div>;
  }

  if (!shop && !isEditing) {
    return <div>{t('shop_not_found')}</div>;
  }

  return (
    <div className="container mx-auto p-4">
        <Tabs defaultValue="general">
            <TabsList>
                <TabsTrigger value="general">{t('general')}</TabsTrigger>
                <TabsTrigger value="products">{t('products')}</TabsTrigger>
                <TabsTrigger value="users">{t('users')}</TabsTrigger>
                <TabsTrigger value="orders">{t('orders')}</TabsTrigger>
            </TabsList>
            <TabsContent value="general">
                <Card>
                    <CardHeader>
                        <CardTitle>{isEditing ? t('edit_shop') : shop?.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                        <label htmlFor="name">{t('shop_name')}</label>
                        <Input
                            id="name"
                            name="name"
                            value={shop?.name || ''}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        />
                        </div>
                        <div>
                        <label htmlFor="description">{t('shop_description')}</label>
                        <Textarea
                            id="description"
                            name="description"
                            value={shop?.description || ''}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        />
                        </div>
                        {isEditing ? (
                        <Button onClick={handleSave} disabled={isLoading}>
                            {isLoading ? t('saving') : t('save_changes')}
                        </Button>
                        ) : (
                        <Button onClick={() => setIsEditing(true)}>{t('edit_shop')}</Button>
                        )}
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="products">
                {shopId && <ProductList shopId={shopId} />}
            </TabsContent>
            <TabsContent value="users">
                {shopId && <UserList shopId={shopId} />}
            </TabsContent>
            <TabsContent value="orders">
                {shopId && <OrderList shopId={shopId} />}
            </TabsContent>
        </Tabs>
    </div>
  );
};
