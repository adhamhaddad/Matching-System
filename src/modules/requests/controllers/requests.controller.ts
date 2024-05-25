import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { User } from '@decorators/user.decorator';
import { UserRoles } from '@constants/user-roles.constant';
import { JwtAuthGuard } from '@modules/auth/guards/auth.guard';
import { RequestsService } from '../services/requests.service';
import { CreateRequestDto } from '../dto/create-request.dto';
import { UpdateRequestDto } from '../dto/update-requests.dto';
import { ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '@modules/auth/guards/roles.guard';
import { Roles } from '@decorators/roles.decorator';

@ApiTags('Property Requests')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRoles.CLIENT)
@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Post()
  async create(@Body() body: CreateRequestDto, @User() user: any) {
    return await this.requestsService.create(body, user);
  }

  @Get(':id')
  async findOne(@Param('id') _id: string, @User() user: any) {
    return await this.requestsService.findOne(_id, user);
  }

  @Patch(':id')
  async updateOne(
    @Param('id') _id: string,
    @Body() body: UpdateRequestDto,
    @User() user: any,
  ) {
    return await this.requestsService.updateOne(_id, body, user);
  }

  @Delete(':id')
  async delete(@Param('id') _id: string, @User() user: any) {
    return await this.requestsService.delete(_id, user);
  }
}
