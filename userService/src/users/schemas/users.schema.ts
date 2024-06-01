
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
export type UserDocument = User & Document;
@Schema()
export class User {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;
  @Prop({ required: true })
  password: string;
  @Prop()
  gender: string;
  @Prop()
  display_name: string;
  @Prop()
  birthday: Date;
  @Prop()
  horoscope: string;
  @Prop()
  zodiac: string;
  @Prop()
  weight: number;
  @Prop()
  height: number;
  // @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  // userId: MongooseSchema.Types.ObjectId;

}

export const UserSchema = SchemaFactory.createForClass(User);