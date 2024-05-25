import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@modules/auth/guards/auth.guard';

@ApiTags('Users')
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch(':id')
  async updateOne(@Param('id') uuid: string, @Body() body: UpdateUserDto) {
    return await this.usersService.updateOne(uuid, body);
  }

  @Delete(':id')
  async delete(@Param('id') uuid: string) {
    return await this.usersService.delete(uuid);
  }
}
