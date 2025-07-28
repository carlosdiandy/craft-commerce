
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuthStore, User, UserRole, ShopOwnerStatus } from '@/stores/authStore';
import { toast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { Users, Edit, Trash2 } from 'lucide-react';

export const UserManagement = () => {
  const { getAllUsers, deleteUser, adminUpdateUser } = useAuthStore();
  const allUsers = getAllUsers();

  const handleEditUser = (userToEdit: User) => {
    // In a real app, this would open a modal or navigate to an edit page
    // For now, we'll simulate an update directly
    const updatedName = prompt(`Enter new name for ${userToEdit.name}:`, userToEdit.name);
    if (updatedName !== null) {
      adminUpdateUser(userToEdit.id, { name: updatedName });
      toast({
        title: "Utilisateur mis à jour",
        description: `Le nom de ${userToEdit.name} a été changé en ${updatedName}.`,
      });
    }
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      deleteUser(userId);
      toast({
        title: "Utilisateur supprimé",
        description: "L'utilisateur a été supprimé avec succès.",
      });
    }
  };

  const getStatusVariant = (status: ShopOwnerStatus | undefined) => {
    switch (status) {
      case 'validated': return 'default';
      case 'paid': return 'secondary';
      case 'pending': return 'destructive';
      case 'uploaded': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container px-4 py-6 lg:py-8">
        <div className="mb-6 lg:mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">Gestion des utilisateurs</h1>
            <p className="text-muted-foreground">Gérez tous les comptes utilisateurs de la plateforme</p>
          </div>
          <Link to="/admin">
            <Button variant="outline" className="w-fit">
              Retour au Dashboard Admin
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <CardTitle className="text-lg lg:text-xl">Tous les utilisateurs</CardTitle>
              <Badge variant="outline" className="w-fit">
                {allUsers.length} utilisateur{allUsers.length > 1 ? 's' : ''}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {allUsers.length > 0 ? (
                allUsers.map((user) => (
                  <div key={user.id} className="flex flex-col lg:flex-row lg:items-center lg:justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors gap-3">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{user.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {user.role === 'admin' ? 'Administrateur' :
                            user.role === 'shopOwner' ? 'Propriétaire' :
                              'Client'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      {user.role === 'shopOwner' && (
                        <Badge variant={getStatusVariant(user.shopOwnerStatus)} className="text-xs">
                          Statut: {user.shopOwnerStatus}
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-2 lg:flex-shrink-0">
                      <Button variant="outline" size="sm" onClick={() => handleEditUser(user)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Modifier
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteUser(user.id)}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Supprimer
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 lg:py-12 text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <h3 className="font-medium text-lg mb-2">Aucun utilisateur trouvé</h3>
                  <p className="text-sm">Il n'y a actuellement aucun utilisateur dans la base de données.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
