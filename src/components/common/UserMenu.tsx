import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  User,
  LogOut,
  Settings,
  Package,
  BarChart3,
  ChevronDown
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

interface UserMenuProps {
  onAuthClick: (tab: 'login' | 'register') => void;
}

export const UserMenu = ({ onAuthClick }: UserMenuProps) => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardPath = () => {
    if (user?.role === 'ROLE_ADMIN') return '/admin';
    if (user?.role === 'ROLE_SHOP_OWNER') return '/backoffice';
    return '/account';
  };

  const getDashboardLabel = () => {
    if (user?.role === 'ROLE_ADMIN') return 'Admin Dashboard';
    if (user?.role === 'ROLE_SHOP_OWNER') return 'Mon Backoffice';
    return 'Mon Compte';
  };

  const getDashboardIcon = () => {
    if (user?.role === 'ROLE_ADMIN') return BarChart3;
    if (user?.role === 'ROLE_SHOP_OWNER') return Package;
    return User;
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          onClick={() => onAuthClick('login')}
          className="hidden sm:inline-flex"
        >
          Connexion
        </Button>
        <Button
          variant="gradient"
          onClick={() => onAuthClick('register')}
        >
          <span className="hidden sm:inline">Inscription</span>
          <span className="sm:hidden">Compte</span>
        </Button>
      </div>
    );
  }

  const DashboardIcon = getDashboardIcon();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center space-x-2 px-3">
          <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="hidden lg:flex flex-col items-start">
            <span className="font-medium text-sm leading-none">{user.name}</span>
            <span className="text-xs text-muted-foreground mt-0.5">
              {user.role === 'ROLE_ADMIN' ? 'Administrateur' :
                user.role === 'ROLE_SHOP_OWNER' ? 'Propriétaire' :
                  'Client'}
            </span>
          </div>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <div className="flex items-center justify-start gap-2 p-3">
          <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium">{user.name}</p>
            <p className="text-sm text-muted-foreground truncate max-w-[180px]">
              {user.email}
            </p>
            <Badge variant="outline" className="w-fit text-xs">
              {user.role === 'ROLE_ADMIN' ? 'Administrateur' :
                user.role === 'ROLE_SHOP_OWNER' ? 'Propriétaire' :
                  'Client'}
            </Badge>
          </div>
        </div>
        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => navigate(getDashboardPath())}>
          <DashboardIcon className="mr-2 h-4 w-4" />
          {getDashboardLabel()}
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => navigate('/account/orders')}>
          <Package className="mr-2 h-4 w-4" />
          Mes commandes
        </DropdownMenuItem>

        {user.role === 'ROLE_CLIENT' && (
          <DropdownMenuItem onClick={() => navigate('/account/settings')}>
            <Settings className="mr-2 h-4 w-4" />
            Paramètres
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleLogout}
          className="text-destructive focus:text-destructive focus:bg-destructive/10"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Se déconnecter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};