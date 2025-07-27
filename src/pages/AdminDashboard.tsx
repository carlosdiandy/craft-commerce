import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart3, Users, Store, CreditCard, TrendingUp, AlertCircle } from 'lucide-react';
import adminImage from '@/assets/admin-dashboard.jpg';

export const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard Administrateur</h1>
          <p className="text-muted-foreground">Vue d'ensemble de la plateforme</p>
        </div>

        {/* Stats rapides */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Shop Owners</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">+12% ce mois</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Boutiques actives</CardTitle>
              <Store className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89</div>
              <p className="text-xs text-muted-foreground">+8% ce mois</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenus</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€45,231</div>
              <p className="text-xs text-muted-foreground">+20% ce mois</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En attente validation</CardTitle>
              <AlertCircle className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">23</div>
              <p className="text-xs text-muted-foreground">Nécessite action</p>
            </CardContent>
          </Card>
        </div>

        {/* Demandes en attente */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Demandes d'inscription Shop Owner</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1,2,3].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <h4 className="font-medium">Boutique Mode {i}</h4>
                    <p className="text-sm text-muted-foreground">shop{i}@example.com</p>
                    <Badge variant="outline">Paiement validé</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="success" size="sm">Valider</Button>
                    <Button variant="destructive" size="sm">Refuser</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};