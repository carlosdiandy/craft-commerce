
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useSupabaseCartStore } from '@/stores/supabase/cartStore';
import { useAuthStore } from '@/stores/authStore';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export const Checkout = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { items, total, clearCart } = useSupabaseCartStore();
  const { user } = useAuthStore();

  const [step, setStep] = useState(1);
  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    zip: '',
    country: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('credit_card');

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  const handlePlaceOrder = () => {
    // Simulate order placement
    console.log('Placing order with:', {
      items,
      total,
      shippingAddress,
      paymentMethod,
      user: user?.id,
    });

    toast({
      title: t('order_placed'),
      description: t('order_placed_success'),
    });

    clearCart();
    navigate('/account/orders');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Votre panier est vide</h1>
          <p className="text-muted-foreground mb-6">Veuillez ajouter des articles à votre panier avant de passer commande.</p>
          <Button onClick={() => navigate('/')}>Retour à la marketplace</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Finaliser ma commande ({step}/3)</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Adresse de livraison</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Adresse</Label>
                    <Input id="address" value={shippingAddress.address} onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">Ville</Label>
                      <Input id="city" value={shippingAddress.city} onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zip">Code postal</Label>
                      <Input id="zip" value={shippingAddress.zip} onChange={(e) => setShippingAddress({ ...shippingAddress, zip: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Pays</Label>
                      <Input id="country" value={shippingAddress.country} onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })} />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={handleNextStep}>Étape suivante</Button>
                </CardFooter>
              </Card>
            )}

            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Méthode de paiement</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="credit_card" id="credit_card" />
                      <Label htmlFor="credit_card">Carte de crédit</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="paypal" id="paypal" />
                      <Label htmlFor="paypal">PayPal</Label>
                    </div>
                  </RadioGroup>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={handlePreviousStep}>Précédent</Button>
                  <Button onClick={handleNextStep}>Étape suivante</Button>
                </CardFooter>
              </Card>
            )}

            {step === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>Récapitulatif de la commande</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <h3 className="font-semibold text-lg">Articles:</h3>
                  {items.map((item) => (
                    <div key={item.product.id} className="flex justify-between items-center">
                      <span>{item.product.name} x {item.quantity}</span>
                      <span>{item.product.price * item.quantity}€</span>
                    </div>
                  ))}
                  <Separator />
                  <h3 className="font-semibold text-lg">Adresse de livraison:</h3>
                  <p>{shippingAddress.address}</p>
                  <p>{shippingAddress.city}, {shippingAddress.zip}, {shippingAddress.country}</p>
                  <Separator />
                  <h3 className="font-semibold text-lg">Méthode de paiement:</h3>
                  <p>{paymentMethod === 'credit_card' ? 'Carte de crédit' : 'PayPal'}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={handlePreviousStep}>Précédent</Button>
                  <Button onClick={handlePlaceOrder}>Confirmer et payer</Button>
                </CardFooter>
              </Card>
            )}
          </div>

          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Votre panier</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between">
                    <span>{item.product.name} x {item.quantity}</span>
                    <span>{item.product.price * item.quantity}€</span>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>{total}€</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
