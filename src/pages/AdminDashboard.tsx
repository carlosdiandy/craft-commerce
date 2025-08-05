import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart3, Users, Store, CreditCard, TrendingUp, AlertCircle } from 'lucide-react';
import { useAdminStore } from '@/stores/adminStore';
import { toast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useEffect } from 'react';

export const AdminDashboard = () => {
  const { users, shops, orders, fetchAllUsers, fetchAllShops, fetchAllOrders, updateUserStatus } = useAdminStore();
  const { t } = useTranslation();

  useEffect(() => {
    fetchAllUsers();
    fetchAllShops();
    fetchAllOrders();
  }, [fetchAllUsers, fetchAllShops, fetchAllOrders]);

  const pendingShopOwners = users.filter(u => u.role === 'ROLE_SHOP_OWNER' && u.shopOwnerStatus === 'pending');
  const totalShopOwners = users.filter(u => u.role === 'ROLE_SHOP_OWNER').length;
  const totalClients = users.filter(u => u.role === 'ROLE_CLIENT').length;
  const activeShops = shops.filter(s => s.status === 'active').length;

  const salesData = orders.reduce((acc, order) => {
    const date = new Date(order.orderDate).toLocaleString('default', { month: 'short' });
    const existing = acc.find(item => item.name === date);
    if (existing) {
      existing.sales += order.totalAmount;
    } else {
      acc.push({ name: date, sales: order.totalAmount });
    }
    return acc;
  }, [] as { name: string; sales: number }[]);

  const userGrowthData = users.reduce((acc, user) => {
    const date = new Date(user.createdAt).toLocaleString('default', { month: 'short' });
    const existing = acc.find(item => item.name === date);
    if (existing) {
      if (user.role === 'ROLE_CLIENT') {
        existing.clients++;
      } else if (user.role === 'ROLE_SHOP_OWNER') {
        existing.shopOwners++;
      }
    } else {
      acc.push({ name: date, clients: user.role === 'ROLE_CLIENT' ? 1 : 0, shopOwners: user.role === 'ROLE_SHOP_OWNER' ? 1 : 0 });
    }
    return acc;
  }, [] as { name: string; clients: number; shopOwners: number }[]);

  const shopActivityData = shops.reduce((acc, shop) => {
    const date = new Date(shop.createdAt).toLocaleString('default', { month: 'short' });
    const existing = acc.find(item => item.name === date);
    if (existing) {
      if (shop.status === 'active') {
        existing.active++;
      }
    } else {
      acc.push({ name: date, active: shop.status === 'active' ? 1 : 0, new: 1 });
    }
    return acc;
  }, [] as { name: string; active: number; new: number }[]);

  const handleValidate = (userId: string) => {
    updateUserStatus(userId, 'approved');
    toast({
      title: t("shop_owner_validated_title"),
      description: t("shop_owner_validated_description", { userName: users.find(u => u.id === userId)?.name || '' }),
    });
  };

  const handleReject = (userId: string) => {
    updateUserStatus(userId, 'rejected');
    toast({
      title: t("shop_owner_rejected_title"),
      description: t("shop_owner_rejected_description", { userName: users.find(u => u.id === userId)?.name || '' }),
    });
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container px-4 py-6 lg:py-8">
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold">{t('admin_dashboard')}</h1>
          <p className="text-muted-foreground">{t('platform_overview')}</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('shop_owners')}</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalShopOwners}</div>
              <p className="text-xs text-success">{t('percentage_this_month', { percentage: 12 })}</p>
              <Link to="/admin/users">
                <Button variant="link" size="sm" className="p-0 h-auto mt-1">
                  {t('manage_users')}
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('active_shops')}</CardTitle>
              <Store className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeShops}</div>
              <p className="text-xs text-success">{t('percentage_this_month', { percentage: 8 })}</p>
              <Link to="/admin/shops">
                <Button variant="link" size="sm" className="p-0 h-auto mt-1">
                  {t('manage_shops')}
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('active_clients')}</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalClients}</div>
              <p className="text-xs text-success">{t('percentage_this_month', { percentage: 15 })}</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('pending_validation')}</CardTitle>
              <AlertCircle className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{pendingShopOwners.length}</div>
              <p className="text-xs text-muted-foreground">{t('action_required')}</p>
              {pendingShopOwners.length > 0 && (
                <Badge variant="destructive" className="mt-1 text-xs">
                  {t('urgent')}
                </Badge>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sales Chart */}
        <Card className="mb-6 lg:mb-8">
          <CardHeader>
            <CardTitle>{t('overall_sales_trend')}</CardTitle>
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

        {/* User Growth Chart */}
        <Card className="mb-6 lg:mb-8">
          <CardHeader>
            <CardTitle>{t('user_registration_growth')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="clients" fill="#82ca9d" name={t('clients')} />
                <Bar dataKey="shopOwners" fill="#8884d8" name={t('shop_owners')} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Shop Activity Chart */}
        <Card className="mb-6 lg:mb-8">
          <CardHeader>
            <CardTitle>{t('shop_activity')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={shopActivityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="active" stroke="#ffc658" name={t('active_shops')} />
                <Line type="monotone" dataKey="new" stroke="#ff7300" name={t('new_shops')} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pending Requests */}
        <Card className="mb-6 lg:mb-8">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <CardTitle className="text-lg lg:text-xl">{t('shop_owner_registration_requests')}</CardTitle>
              {pendingShopOwners.length > 0 && (
                <Badge variant="destructive" className="w-fit">
                  {pendingShopOwners.length} {t('pending')}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingShopOwners.length > 0 ? (
                pendingShopOwners.map((user) => (
                  <div key={user.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors gap-3">
                    <div className="space-y-1 flex-1">
                      <h4 className="font-medium">{user.name}</h4>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline">{t('documents_uploaded')}</Badge>
                        <Badge variant="secondary">{t('payment_validated')}</Badge>
                      </div>
                    </div>
                    <div className="flex gap-2 sm:flex-shrink-0">
                      <Button variant="default" size="sm" onClick={() => handleValidate(user.id)}>
                        {t('validate')}
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleReject(user.id)}>
                        {t('reject')}
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 lg:py-12 text-muted-foreground">
                  <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <h3 className="font-medium text-lg mb-2">{t('no_pending_requests')}</h3>
                  <p className="text-sm">{t('all_shop_owner_requests_processed')}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="w-5 h-5" />
                {t('user_management')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {t('manage_all_user_accounts')}
              </p>
              <Link to="/admin/users">
                <Button className="w-full" variant="outline">
                  {t('access_management')}
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Store className="w-5 h-5" />
                {t('shop_management')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {t('supervise_moderate_shops')}
              </p>
              <Link to="/admin/shops">
                <Button className="w-full" variant="outline">
                  {t('view_shops')}
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                {t('reports_analytics')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {t('view_stats_performance')}
              </p>
              <Button className="w-full" variant="outline">
                {t('soon_available')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};