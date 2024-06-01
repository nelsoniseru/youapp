import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/users.schema';

import { ProfileSchema } from './dto/users.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }


  async findUserByEmail(data) {
    return await this.userModel.findOne({email: data.email });
  }
  async  findUserByEmailOrUsername(data) {
    return await this.userModel.findOne({
      $or: [
        { email: data.email },
        { username: data.email}
      ]
    });
  }
 
  async findUserById(data) {
    return await this.userModel.findOne({_id: data.id });
  }

  async findUserName(data) {
    return await this.userModel.findOne({ username: data.username });
  }
 async createNewUser(data) {
    return await this.userModel.create(data.newUser);
  }

  async GetUserProfile(id) {
    let user = await this.userModel.findOne({ _id:id });
    return {statusCode:200, user}
  }

  async createProfile(user,userId) {
    const validationeRes  = await  ProfileSchema.validate(user);
    if(validationeRes.error){
     const e = validationeRes.error.details.map((e)=>e.message)
     return {statusCode:400, errors:e[0]}
    }
  await this.userModel.updateOne({ _id:userId}, { $set: user });
  return {statusCode:"200",message:"profile created successfully"}   
  }

  async updateProfile(user,id) {
    const validationeRes  = await ProfileSchema.validate(user);
    if(validationeRes.error){
     const e = validationeRes.error.details.map((e)=>e.message)
     return {statusCode:400, errors:e[0]}
    }
    await this.userModel.updateOne({ _id:id }, { $set: user });
    return {statusCode:"200",message:"profile updated successfully"}
  }


}
