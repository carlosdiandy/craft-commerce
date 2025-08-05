import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger, 
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import { useNotificationStore } from '@/stores/notificationStore';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useEffect } from 'react';

export const NotificationBell = () => {
  const { notifications, unreadCount, addNotification, markAsRead, markAllAsRead } = useNotificationStore();
  const newNotifications = useWebSocket('/topic/notifications');

  useEffect(() => {
    if (newNotifications.length > 0) {
      addNotification({ message: newNotifications[newNotifications.length - 1] });
    }
  }, [newNotifications, addNotification]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="p-2 font-semibold">Notifications</div>
        <DropdownMenuSeparator />
        {notifications.length > 0 ? (
          notifications.map(notification => (
            <DropdownMenuItem key={notification.id} onSelect={() => markAsRead(notification.id)} className={!notification.read ? 'font-bold' : ''}>
              {notification.message}
            </DropdownMenuItem>
          ))
        ) : (
          <div className="p-2 text-sm text-muted-foreground">No new notifications</div>
        )}
        {notifications.length > 0 && (
            <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={markAllAsRead} className="text-sm text-center justify-center">
                    Mark all as read
                </DropdownMenuItem>
            </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};