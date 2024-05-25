import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto) {
    return await this.userRepository.create(createUserDto);
  }

  async findOne(uuid: string) {
    return await this.userRepository.findOne(uuid);
  }

  async updateOne(uuid: string, updateUserDto: UpdateUserDto) {
    return await this.userRepository.updateOne(uuid, updateUserDto);
  }

  async delete(uuid: string) {
    return await this.userRepository.delete(uuid);
  }
}
