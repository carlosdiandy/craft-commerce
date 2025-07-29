import { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client, Stomp } from '@stomp/stompjs';
import { toast } from '@/hooks/use-toast';

export const useWebSocket = () => {
  const [stompClient, setStompClient] = useState<Client | null>(null);

  useEffect(() => {
    const socket = new SockJS('http://localhost:8080/ws');
    const client = Stomp.over(socket);

    client.onConnect = () => {
      console.log('Connected to WebSocket');
      setStompClient(client);

      client.subscribe('/topic/notifications', (message) => {
        toast({
          title: 'Notification',
          description: message.body,
        });
      });
    };

    client.onStompError = (frame) => {
      console.error('Broker reported error:' + frame.headers['message']);
      console.error('Additional details:' + frame.body);
    };

    client.activate();

    return () => {
      if (client.connected) {
        client.deactivate();
      }
    };
  }, []);

  return stompClient;
};
