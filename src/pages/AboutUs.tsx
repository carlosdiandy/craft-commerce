import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const AboutUs = () => {
  return (
    <div className="min-h-screen bg-muted/30 py-12">
      <div className="container px-4">
        <h1 className="text-4xl font-bold text-center mb-10">À Propos de Nous</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Notre Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Chez Elosa, notre mission est de connecter les acheteurs avec des vendeurs passionnés et des produits uniques. Nous croyons en un commerce équitable et transparent, où chaque transaction contribue à une économie locale et durable. Nous nous engageons à offrir une plateforme intuitive et sécurisée pour tous.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notre Histoire</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Fondée en 2023, Elosa est née de la vision de créer un espace où l'artisanat, l'innovation et la qualité se rencontrent. Partis d'une petite équipe, nous avons grandi pour devenir une communauté florissante de créateurs et de consommateurs, tous unis par l'amour des produits exceptionnels.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Nos Valeurs</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">Qualité</h3>
              <p className="text-muted-foreground">Nous sélectionnons rigoureusement nos partenaires pour garantir des produits de la plus haute qualité.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Transparence</h3>
              <p className="text-muted-foreground">Nous assurons une communication claire et honnête entre acheteurs et vendeurs.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Communauté</h3>
              <p className="text-muted-foreground">Nous bâtissons une communauté forte et solidaire autour de valeurs partagées.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Contactez-nous</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Pour toute question ou suggestion, n'hésitez pas à nous contacter à <a href="mailto:contact@elosa.com" className="text-primary hover:underline">contact@elosa.com</a>.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
