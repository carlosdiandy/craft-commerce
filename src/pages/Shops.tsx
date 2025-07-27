
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin } from 'lucide-react';

// Données mockées pour la démonstration (à remplacer par des données réelles)
const mockShops = [
  {
    id: 'shop1',
    name: 'TechStore Premium',
    description: 'Spécialiste en électronique et high-tech',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
    rating: 4.8,
    productsCount: 156,
    location: 'Paris, France'
  },
  {
    id: 'shop2',
    name: 'Sport & Style',
    description: 'Vêtements et équipements de sport',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400',
    rating: 4.6,
    productsCount: 89,
    location: 'Lyon, France'
  },
  {
    id: 'shop3',
    name: 'Luxury Fashion',
    description: 'Mode et accessoires de luxe',
    image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400',
    rating: 4.9,
    productsCount: 67,
    location: 'Nice, France'
  },
  {
    id: 'shop4',
    name: 'Green Garden',
    description: 'Plantes et accessoires de jardinage',
    image: 'https://images.unsplash.com/photo-1509223197845-d26291923a0c?w=400',
    rating: 4.5,
    productsCount: 210,
    location: 'Marseille, France'
  },
  {
    id: 'shop5',
    name: 'Book Nook',
    description: 'Librairie indépendante',
    image: 'https://images.unsplash.com/photo-1521587765099-8835e7201186?w=400',
    rating: 4.7,
    productsCount: 300,
    location: 'Bordeaux, France'
  }
];

export const Shops = () => {
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Toutes nos boutiques</h1>
            <p className="text-muted-foreground">Découvrez les vendeurs de notre plateforme</p>
          </div>
          <Link to="/">
            <Button variant="outline">Retour à la marketplace</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mockShops.map((shop) => (
            <Card key={shop.id} className="overflow-hidden hover:shadow-hover transition-all duration-300">
              <div className="h-48 overflow-hidden">
                <img 
                  src={shop.image} 
                  alt={shop.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg">{shop.name}</h3>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium ml-1">{shop.rating}</span>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm mb-3">{shop.description}</p>
                <div className="flex items-center text-sm text-muted-foreground mb-3">
                  <MapPin className="w-4 h-4 mr-1" />
                  {shop.location}
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">{shop.productsCount} produits</Badge>
                  <Link to={`/shops/${shop.id}`}>
                    <Button size="sm" variant="outline">Visiter</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
