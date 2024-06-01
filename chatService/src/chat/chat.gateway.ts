import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({ cors: true }) // Enable Cross-Origin Resource Sharing (CORS)
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server; // The server instance to manage WebSocket connections

  constructor(private readonly chatService: ChatService) {}

  /**
   * This method is called after the WebSocket server is initialized.
   * @param server The server instance.
   */
  afterInit(server: Server) {
    console.log('Socket.IO server initialized'); // Log a message when the WebSocket server is initialized
  }

  /**
   * This method is called when a client connects to the WebSocket server.
   * @param client The connected client socket instance.
   */
  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`); // Log a message when a client connects
  }

  /**
   * This method is called when a client disconnects from the WebSocket server.
   * @param client The disconnected client socket instance.
   */
  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`); // Log a message when a client disconnects
  }

  /**
   * This method handles the 'joinRoom' event. It adds the client to the specified chat room
   * and emits a confirmation event back to the client.
   * @param chatRoomId The ID of the chat room to join.
   * @param client The connected client socket instance.
   */
  @SubscribeMessage('joinRoom')
  handleJoinRoom(@MessageBody() chat:any, @ConnectedSocket() client: Socket) {
    client.join(chat.chatRoomId); // Add the client to the specified chat room
    client.emit('joinedRoom', chat.chatRoomId); // Notify the client that they have joined the room
  }

  /**
   * This method handles the 'sendMessage' event. It creates a new message using the ChatService
   * and emits the new message to all clients in the specified chat room.
   * @param messageData The data of the message to be sent, including userId, chatId, and content.
   * @param client The connected client socket instance.
   */
  @SubscribeMessage('sendMessage')
  async handleMessage(@MessageBody() messageData: { userId: string; chatId: string; content: string }, @ConnectedSocket() client: Socket) {
    // Extract userId from messageData
    const { userId, chatId, content } = messageData;

    // Use the ChatService to create a new message
    const newMessage = await this.chatService.createMessage({ chatId, content }, userId);

    // Emit the new message to all clients in the specified chat room
    this.server.to(chatId).emit('newMessage', newMessage.newMsg);
  }
}
