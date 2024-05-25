import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/users.schema';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { phone } = createUserDto;

    // check if username or email exist
    const phoneExist = await this.userModel.countDocuments({ phone });
    if (phoneExist)
      throw new HttpException('Phone number is taken', HttpStatus.CONFLICT);

    const user = await this.userModel.create(createUserDto);
    return await user.save();
  }

  async findOne(uuid: string) {
    try {
      const ad = await this.userModel.findOne({ uuid });
      if (!ad) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

      return ad;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.NOT_FOUND);
    }
  }

  async updateOne(uuid: string, updateUserDto: UpdateUserDto) {
    try {
      return await this.userModel.findOneAndUpdate({ uuid }, updateUserDto, {
        new: true,
      });
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async delete(uuid: string) {
    try {
      return await this.userModel.findOneAndDelete({ uuid }, { new: true });
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
}
