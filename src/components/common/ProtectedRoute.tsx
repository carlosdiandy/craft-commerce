import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore, UserRole } from '@/stores/authStore';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, CreditCard, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
  requireValidated?: boolean;
}

export const ProtectedRoute = ({ 
  children, 
  allowedRoles = [], 
  requireValidated = false 
}: ProtectedRouteProps) => {
  const { user, isAuthenticated } = useAuthStore();
  const location = useLocation();

  // Si pas connecté, rediriger vers la page d'accueil
  if (!isAuthenticated || !user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Vérifier les rôles autorisés
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // Vérifier le statut pour les shop owners
  if (requireValidated && user.role === 'shopOwner') {
    const status = user.shopOwnerStatus;
    
    if (status === 'pending') {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mx-auto">
                <Clock className="w-8 h-8 text-warning" />
              </div>
              <h2 className="text-xl font-semibold">Compte en attente</h2>
              <p className="text-muted-foreground">
                Votre compte shop owner est en cours de validation. 
                Veuillez effectuer le paiement requis pour activer votre compte.
              </p>
              <Button variant="warning" className="w-full">
                <CreditCard className="w-4 h-4 mr-2" />
                Effectuer le paiement
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (status === 'paid') {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Clock className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">Validation en cours</h2>
              <p className="text-muted-foreground">
                Votre paiement a été reçu. Votre compte est en cours de validation 
                par notre équipe. Vous recevrez un email de confirmation sous 24-48h.
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }
  }

  return <>{children}</>;
};