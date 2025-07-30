import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, ShoppingCart, TrendingUp, Plus, CreditCard, Clock, Upload, Store, User } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { Link } from 'react-router-dom';
import shopOwnerImage from '@/assets/shop-owner.jpg';
import { toast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

export const ShopOwnerDashboard = () => {
  const { user, updateShopOwnerStatus } = useAuthStore();
  const { t } = useTranslation();

  // Mock data for charts
  const salesData = [
    { name: 'Jan', sales: 4000 },
    { name: 'Feb', sales: 3000 },
    { name: 'Mar', sales: 5000 },
    { name: 'Apr', sales: 4500 },
    { name: 'May', sales: 6000 },
    { name: 'Jun', sales: 5500 },
    { name: 'Jul', sales: 7000 },
  ];

  const productPerformanceData = [
    { name: 'Product A', sales: 120, views: 2400 },
    { name: 'Product B', sales: 98, views: 2210 },
    { name: 'Product C', sales: 200, views: 2290 },
    { name: 'Product D', sales: 150, views: 2000 },
    { name: 'Product E', sales: 180, views: 2181 },
  ];

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'approved': return 'default';
      case 'pending': return 'destructive';
      case 'rejected': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved': return t('status_approved');
      case 'pending': return t('status_pending');
      case 'rejected': return t('status_rejected');
      default: return t('status_unknown');
    }
  };

  const handlePayment = () => {
    if (user) {
      updateShopOwnerStatus(user.id, 'approved');
      toast({
        title: t("payment_simulated_title"),
        description: t("payment_simulated_description"),
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container px-4 py-6 lg:py-8">
        <div className="mb-6 lg:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold">{t('my_backoffice')}</h1>
              <p className="text-muted-foreground">{t('manage_shops_products')}</p>
            </div>
            <Badge 
              variant={getStatusVariant(user?.shopOwnerStatus || 'pending')}
              className="w-fit text-sm"
            >
              {getStatusLabel(user?.shopOwnerStatus || 'pending')}
            </Badge>
          </div>
        </div>

        {user?.shopOwnerStatus === 'pending' && (
          <Card className="mb-6 lg:mb-8 border-warning bg-warning/5">
            <CardContent className="p-4 lg:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <CreditCard className="w-8 h-8 text-warning flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">{t('payment_required')}</h3>
                  <p className="text-muted-foreground mb-4">
                    {t('payment_required_description')}
                  </p>
                  <Button variant="warning" onClick={handlePayment} className="w-full sm:w-auto">
                    <CreditCard className="w-4 h-4 mr-2" />
                    {t('proceed_to_payment')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {user?.shopOwnerStatus === 'approved' && (
          <>
            {/* Stats des boutiques */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t('my_shops')}</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{user?.shops?.length || 0}</div>
                  <Link to="/shops/manage">
                    <Button size="sm" variant="outline" className="mt-2 w-full">
                      <Plus className="w-4 h-4 mr-1" />
                      {t('create_shop')}
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t('total_products')}</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{user?.shops?.reduce((acc, shop) => acc + (shop.products?.length || 0), 0)}</div>
                  <p className="text-xs text-muted-foreground">{t('total_products_description')}</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow sm:col-span-2 lg:col-span-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t('total_sales')}</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">€{salesData.reduce((acc, data) => acc + data.sales, 0).toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">{t('total_sales_description')}</p>
                </CardContent>
              </Card>
            </div>

            {/* Sales Chart */}
            <Card className="mb-6 lg:mb-8">
              <CardHeader>
                <CardTitle>{t('sales_overview')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="sales" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Product Performance Chart */}
            <Card className="mb-6 lg:mb-8">
              <CardHeader>
                <CardTitle>{t('product_performance')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={productPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="sales" fill="#82ca9d" name={t('sales')} />
                    <Bar dataKey="views" fill="#8884d8" name={t('views')} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
              <Link to="/shops/manage">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                  <Store className="w-6 h-6" />
                  <span>{t('manage_my_shops')}</span>
                </Button>
              </Link>
              <Link to="/products/manage">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                  <Package className="w-6 h-6" />
                  <span>{t('manage_my_products')}</span>
                </Button>
              </Link>
              <Link to="/backoffice/orders">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                  <ShoppingCart className="w-6 h-6" />
                  <span>{t('manage_orders')}</span>
                </Button>
              </Link>
              <Link to="/backoffice/users">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                  <User className="w-6 h-6" />
                  <span>{t('shop_users')}</span>
                </Button>
              </Link>
            </div>

            {/* My Shops */}
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <CardTitle className="text-lg lg:text-xl">{t('my_shops')}</CardTitle>
                  {user?.shops && user.shops.length > 0 && (
                    <Badge variant="outline" className="w-fit">
                      {user.shops.length} {t('shop_count', { count: user.shops.length })}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {user?.shops?.map((shop) => (
                    <div key={shop.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors gap-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-lg">{shop.name}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{shop.description}</p>
                        <Badge variant="outline" className="text-xs">
                          {t('status')}: {shop.status}
                        </Badge>
                      </div>
                      <Button variant="outline" className="sm:flex-shrink-0">
                        {t('manage_this_shop')}
                      </Button>
                    </div>
                  )) || (
                      <div className="text-center py-8 lg:py-12 text-muted-foreground">
                        <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <h3 className="font-medium text-lg mb-2">{t('no_shop_created')}</h3>
                        <p className="text-sm mb-4">{t('create_first_shop_description')}</p>
                        <Button className="mt-4" variant="gradient">
                          <Plus className="w-4 h-4 mr-2" />
                          {t('create_my_first_shop')}
                        </Button>
                      </div>
                    )}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};