import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request } from '@nestjs/common';
import { ChatService } from './chat.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller('api')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    ) { }
  @Get("initiateChat/:id")
  async createChatRoom(@Param('id') id: string,@Request() request,@Body() chat:any) {
    const loggedInUser = request.user;
    const userId = request.params.id
    return this.chatService.createChatRoom(loggedInUser,userId);
  }

  @Post('sendMessage')
  async createMessage(@Body() chat:any,@Request() request) {
    const id = request.user;
    return this.chatService.createMessage(chat,id);
  }
  @Get('viewMessages/:id')
  async getMessage(@Param('id') id: string,@Request() request) {
    const msgid = request.params.id
    return this.chatService.getMessage(msgid);
  }

}
