import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { User } from '@decorators/user.decorator';
import { UserRoles } from '@constants/user-roles.constant';
import { JwtAuthGuard } from '@modules/auth/guards/auth.guard';
import { AdsService } from '../services/ads.service';
import { CreateAdsDto } from '../dto/create-ads.dto';
import { UpdateAdsDto } from '../dto/update-ads.dto';
import { FilterAdsDto } from '../dto/filter.dto';
import { ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '@modules/auth/guards/roles.guard';
import { Roles } from '@decorators/roles.decorator';

@ApiTags('Ads')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRoles.AGENT)
@Controller('ads')
export class AdsController {
  constructor(private readonly adsService: AdsService) {}

  @Post()
  async create(@Body() body: CreateAdsDto, @User() user: any) {
    return await this.adsService.create(body, user);
  }

  @Get()
  async find(@Query() query: FilterAdsDto, @User() user: any) {
    return await this.adsService.find(query, user);
  }

  @Get('match/:id')
  async findMatch(
    @Param('id') _id: string,
    @Query() query: FilterAdsDto,
    @User() user: any,
  ) {
    return await this.adsService.findMatch(_id, query, user);
  }

  @Get(':id')
  async findOne(@Param('id') _id: string, @User() user: any) {
    return await this.adsService.findOne(_id, user);
  }

  @Patch(':id')
  async updateOne(
    @Param('id') _id: string,
    @Body() body: UpdateAdsDto,
    @User(UserRoles.AGENT) user: any,
  ) {
    return await this.adsService.updateOne(_id, body, user);
  }

  @Delete(':id')
  async delete(@Param('id') _id: string, @User() user: any) {
    return await this.adsService.delete(_id, user);
  }
}
