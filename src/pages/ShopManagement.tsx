
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/stores/authStore';
import { toast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

export const ShopManagement = () => {
  const { user, updateUser } = useAuthStore();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const shopName = formData.get('shopName') as string;
    const shopDescription = formData.get('shopDescription') as string;

    if (user) {
      const newShop = {
        id: Date.now().toString(),
        name: shopName,
        description: shopDescription,
        ownerId: user.id,
        status: 'active' as const,
        createdAt: new Date().toISOString(),
      };

      const updatedShops = [...(user.shops || []), newShop];
      updateUser({ shops: updatedShops });

      toast({
        title: 'Boutique créée',
        description: `La boutique ${shopName} a été créée avec succès.`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Gérer mes boutiques</h1>
            <p className="text-muted-foreground">Créez et modifiez vos boutiques</p>
          </div>
          <Link to="/backoffice">
            <Button variant="outline">Retour au backoffice</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Créer une nouvelle boutique</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="shopName">Nom de la boutique</Label>
                    <Input id="shopName" name="shopName" placeholder="Ma superbe boutique" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shopDescription">Description</Label>
                    <Input id="shopDescription" name="shopDescription" placeholder="Vêtements, accessoires, etc." />
                  </div>
                  <Button type="submit">Créer la boutique</Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Mes boutiques</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {user?.shops?.map((shop) => (
                    <div key={shop.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{shop.name}</h4>
                        <p className="text-sm text-muted-foreground">{shop.description}</p>
                      </div>
                      <Button variant="outline" size="sm">Gérer</Button>
                    </div>
                  ))}
                  {(!user?.shops || user.shops.length === 0) && (
                    <p className="text-muted-foreground text-center">Vous n'avez pas encore de boutique.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
