
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSupabaseCartStore } from '@/stores/supabase/cartStore';
import { Link, useNavigate } from 'react-router-dom';

export const Cart = () => {
  const { items, removeItem, getItemsCount, total } = useSupabaseCartStore();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Mon Panier</h1>
            <p className="text-muted-foreground">Vous avez {getItemsCount()} article(s) dans votre panier.</p>
          </div>
          <Link to="/">
            <Button variant="outline">Continuer mes achats</Button>
          </Link>
        </div>

        {getItemsCount() > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Articles du panier</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.product.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <img src={item.product.images?.[0] || 'https://via.placeholder.com/64'} alt={item.product.name} className="w-16 h-16 object-cover rounded-lg" />
                          <div>
                            <h4 className="font-medium">{item.product.name}</h4>
                            <p className="text-sm text-muted-foreground">{item.product.price}€</p>
                          </div>
                        </div>
                        <Button variant="destructive" size="sm" onClick={() => removeItem(item.product.id)}>Supprimer</Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Résumé de la commande</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <p>Sous-total</p>
                    <p>{total}€</p>
                  </div>
                  <div className="flex justify-between">
                    <p>Livraison</p>
                    <p>Gratuite</p>
                  </div>
                  <div className="flex justify-between font-bold">
                    <p>Total</p>
                    <p>{total}€</p>
                  </div>
                  <Button className="w-full" onClick={() => navigate('/checkout')}>Passer la commande</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">Votre panier est vide</h2>
            <Link to="/">
              <Button>Commencer mes achats</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
