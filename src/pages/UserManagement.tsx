
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
      case 'uploaded': return 'info';
      default: return 'outline';
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Gestion des utilisateurs</h1>
            <p className="text-muted-foreground">Gérez tous les comptes utilisateurs de la plateforme</p>
          </div>
          <Link to="/admin">
            <Button variant="outline">Retour au Dashboard Admin</Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tous les utilisateurs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {allUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <h4 className="font-medium">{user.name} ({user.role})</h4>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    {user.role === 'shopOwner' && (
                      <Badge variant={getStatusVariant(user.shopOwnerStatus)}>
                        Statut: {user.shopOwnerStatus}
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-2">
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
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
