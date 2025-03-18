// src/notifications/notifications.gateway.ts
import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*', // Update with your allowed origins in production
  },
})
export class NotificationsGateway {
  @WebSocketServer()
  server: Server;

  // Method to broadcast trade updates
  notifyTradeUpdate(data: any) {
    this.server.emit('tradeUpdate', data);
  }

  // Method to broadcast token updates
  notifyTokenUpdate(data: any) {
    this.server.emit('tokenUpdate', data);
  }

  // Optional: Listen to a subscription event from the client
  @SubscribeMessage('subscribeToNotifications')
  handleSubscribe(@MessageBody() data: any): string {
    // This could be used to add clients to a room, etc.
    return 'Subscribed to notifications';
  }
}
