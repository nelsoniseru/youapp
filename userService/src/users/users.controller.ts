import { Controller, Get, Post, Body, Param, Put, Delete, Request } from '@nestjs/common';
import { UserService } from './users.service';
import { User } from './schemas/users.schema';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
@Controller('api')
export class UserController {
  constructor(private readonly userService: UserService) { }


  @EventPattern('get-user-email')
  findUserByEmail(@Payload() data:string) {
    return this.userService.findUserByEmail(data);
  }
  @EventPattern('get-user-email-username')
  findUserByEmailOrUsername(@Payload() data:string) {
    return this.userService.findUserByEmailOrUsername(data);
  }
  @EventPattern('create-new-user')
  createNewUser(@Payload() data:any) {
    return this.userService.createNewUser(data);
  }
  
  @EventPattern('get-username')
  findUserName(@Payload() data:string) {
    return this.userService.findUserName(data);
  }

  @EventPattern('get-user-id')
  findUserById(@Payload() data:string){
    return this.userService.findUserById(data)
  }

  @Get('getProfile')
  GetUserProfile(@Request() request) {
    const userId = request.user;
    return this.userService.GetUserProfile(userId);
  }
  @Post('createProfile')
  createProfile(@Body() user:any, @Request() request) {
    const userId = request.user;
    return this.userService.createProfile(user,userId);
  }

  @Put('updateProfile')
  updateProfile( @Request() request, @Body() user:any) {
    const userId = request.user;
    return this.userService.updateProfile(user,userId);
  }

}
