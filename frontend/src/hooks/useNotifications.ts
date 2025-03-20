'use client';

import { useEffect, useState } from 'react';
import io from 'socket.io-client';

export interface NotificationData {
  type: string;
  message: string;
  data?: any;
}

let socket: any;

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  useEffect(() => {
    const backendWsUrl = process.env.NEXT_PUBLIC_BACKEND_WS_URL || 'http://localhost:8000';
    socket = io(backendWsUrl, {
      reconnectionAttempts: 5,
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log('Connected to WebSocket at', backendWsUrl);
    });

    socket.on('tradeUpdate', (data: NotificationData) => {
      console.log('Received trade update:', data);
      setNotifications((prev) => [...prev, data]);
    });

    socket.on('tokenUpdate', (data: NotificationData) => {
      console.log('Received token update:', data);
      setNotifications((prev) => [...prev, data]);
    });

    socket.on('disconnect', (reason: string) => {
      console.warn('WebSocket disconnected:', reason);
    });

    socket.on('connect_error', (error: any) => {
      console.error('WebSocket connection error:', error);
    });

    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  return notifications;
};
