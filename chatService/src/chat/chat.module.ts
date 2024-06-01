import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from '@nestjs/mongoose';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { Chat, ChatSchema } from './schemas/chat.schema';
import { Message, MessageSchema } from './schemas/message.schema';
import { AuthenticationMiddleware } from '../middleware/middleware';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { ChatGateway } from './chat.gateway'
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://127.0.0.1:5672'],
          queue: 'users-queue',
       
        },
      },
    ]),
 
    JwtModule.register({ 
      secret:process.env.JWT_SECRET, 
      signOptions: { expiresIn:process.env.JWT_EXPIRE_IN },
  }),

  MongooseModule.forRoot(process.env.DATABASE_URI),
  MongooseModule.forFeature([
    { name: Chat.name, schema: ChatSchema },
    { name: Message.name, schema: MessageSchema },
  ])
],

  controllers: [ChatController],
  providers: [ChatService,ChatGateway],
  exports: [ChatService],

})
export class ChatModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
      consumer
          .apply(AuthenticationMiddleware)
          .forRoutes(ChatController)
  }
}