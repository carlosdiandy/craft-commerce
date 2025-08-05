import { useEffect, useRef, useState } from 'react';
import { Client, IMessage } from '@stomp/stompjs';

export const useWebSocket = (topic: string) => {
  const [messages, setMessages] = useState<any[]>([]);
  const stompClient = useRef<Client | null>(null);

  useEffect(() => {
    const client = new Client({
      brokerURL: 'ws://localhost:8080/ws',
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = () => {
      client.subscribe(topic, (message: IMessage) => {
        setMessages(prevMessages => [...prevMessages, JSON.parse(message.body)]);
      });
    };

    client.activate();
    stompClient.current = client;

    return () => {
      client.deactivate();
    };
  }, [topic]);

  return messages;
};