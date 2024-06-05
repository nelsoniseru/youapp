import { Controller, Get, Post, Body, Param, Put, Delete, Request,UsePipes } from '@nestjs/common';
import { ChatService } from './chat.service';
import { MessagePattern } from '@nestjs/microservices';
import { ChatDto } from './dto/chat.dto';
import { chatSchema } from './schemas/chats.schema';
import { JoiValidationPipe } from './pipes/joi-validation.pipes';

@Controller('api')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    ) { }
  @Get("initiateChat/:id")
  async createChatRoom(@Param('id') id: string,@Request() request,@Body() chat:ChatDto) {
    const loggedInUser = request.user;
    const userId = request.params.id
    return this.chatService.createChatRoom(loggedInUser,userId);
  }

  @Post('sendMessage')
  @UsePipes(new JoiValidationPipe(chatSchema))

  async createMessage(@Body() chat:ChatDto,@Request() request) {
    const id = request.user;
    return this.chatService.createMessage(chat,id);
  }
  @Get('viewMessages/:id')
  async getMessage(@Param('id') id: string,@Request() request) {
    const msgid = request.params.id
    return this.chatService.getMessage(msgid);
  }

}
