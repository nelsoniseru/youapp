import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './users.controller';
import { UserService } from './users.service';
import { UserSchema } from './schemas/users.schema';
import { AuthenticationMiddleware } from '../middleware/middleware';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({  
    secret:process.env.JWT_SECRET , 
    signOptions: { expiresIn:process.env.JWT_EXPIRE_IN},
  }), 
  MongooseModule.forRoot(process.env.DATABASE_URI),
  MongooseModule.forFeature([{ name: 'User', schema: UserSchema}])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],

})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
      consumer
          .apply(AuthenticationMiddleware)
          .forRoutes(UserController)
  }
}