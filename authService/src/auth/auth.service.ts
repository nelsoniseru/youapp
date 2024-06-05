import { Injectable,HttpException, HttpStatus,BadRequestException,Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom} from 'rxjs';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @Inject('USER_SERVICE')  private rabbitClient: ClientProxy
  ) {}
  async login(user) {
  
    const findUser = await firstValueFrom(this.rabbitClient.send('get-user-email-username', {email:user.email}))

    if (findUser && bcrypt.compareSync(user.password, findUser.password)) {
      const payload = { id: findUser._id, sub: findUser.email };
      return {
        statusCode: 200,
        access_token: this.jwtService.sign(payload),
      };
    } else {
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }
  }

  async register(user) {
 
    const findUserEmail = await firstValueFrom(this.rabbitClient.send('get-user-email', {email:user.email}))

   let findUsername = await firstValueFrom(this.rabbitClient.send('get-username', {username:user.username}));
  
    if(findUserEmail) throw new HttpException('user email already exist', HttpStatus.BAD_REQUEST);
    if(findUsername)  throw new HttpException('username already exist', HttpStatus.BAD_REQUEST);
    const hashedPassword = bcrypt.hashSync(user.password, 10);
     const newUser ={
       ...user,
     password: hashedPassword,
     };
   let saveduser =  await firstValueFrom(this.rabbitClient.send('create-new-user', {newUser}))
    return {
      statusCode: 201,
      message:"User created successfully",
     access_token: this.jwtService.sign(saveduser)
      };
 
  }

}
