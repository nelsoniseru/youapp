import { Controller, Post, Body,Inject,UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterSchema } from './schemas/register.schemas';
import { LoginSchema } from './schemas/login.schema';
import {LoginDto} from './dto/login.dto'
import {RegisterDto} from './dto/register.dto'
import { JoiValidationPipe } from './pipes/joi-validation.pipes';

@Controller('api')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
   
    ) {}

  @Post('login')
  @UsePipes(new JoiValidationPipe(LoginSchema))
   async login(@Body() user:LoginDto) {
    return this.authService.login(user);
  }

  @Post('register')
  @UsePipes(new JoiValidationPipe(RegisterSchema))
  async register(@Body() user:RegisterDto) {
    return this.authService.register(user);
  }
}
