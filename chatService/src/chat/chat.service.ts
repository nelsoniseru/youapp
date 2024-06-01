import { Injectable,HttpException, HttpStatus,BadRequestException,Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat, ChatDocument } from './schemas/chat.schema';
import { Message, MessageDocument } from './schemas/message.schema';
import { firstValueFrom} from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import {  chatSchema } from './dto/chat.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name) private chatModel: Model<ChatDocument>,
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>, 
    @Inject('USER_SERVICE')  private rabbitClient: ClientProxy

     ) { }
    async createChatRoom(loggedInUser,userId) {
      const findUserById = await firstValueFrom(this.rabbitClient.send('get-user-id', {id:userId}))
      if(!findUserById) throw new HttpException('user not found', HttpStatus.BAD_REQUEST);

       // Check if a chat room with the given participants already exists
    const existingChatRoom = await this.chatModel.findOne({
      participants: { $all: [loggedInUser,userId], $size:2 },
    });

    if (existingChatRoom) {
      return{statusCode:200,existingChatRoom}
    }
    
    // If not, create a new chat room
    const createdChatRoom = new this.chatModel();
    createdChatRoom.participants = [loggedInUser,userId]
    let newChat = await createdChatRoom.save();
    return{statusCode:201, newChat}
  }

  async createMessage(chat,id){
    const validationeRes  = await chatSchema.validate(chat);
    if(validationeRes.error){
     const e = validationeRes.error.details.map((e)=>e.message)
     return {statusCode:400, errors:e[0]}
    }

    const existingChatRoom = await this.chatModel.findOne({_id:chat.chatId})
    if(!existingChatRoom) throw new HttpException('chat room not found', HttpStatus.BAD_REQUEST);

    const createdMessage = new this.messageModel({ sender:id, chat:chat.chatId, content:chat.content });
    let newMsg = await createdMessage.save(); 
    return{statusCode:201, newMsg}

}

async getMessage(id){
  const existingMsg = await this.messageModel.find({chat:id})
  return{statusCode:200, existingMsg}

}
}