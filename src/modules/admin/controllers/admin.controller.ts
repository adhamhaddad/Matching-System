import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AdminService } from '../services/admin.service';
import { JwtAuthGuard } from '@modules/auth/guards/auth.guard';
import { RolesGuard } from '@modules/auth/guards/roles.guard';
import { Roles } from '@decorators/roles.decorator';
import { UserRoles } from '@constants/user-roles.constant';

@ApiTags('Admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRoles.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('statistics')
  async getStatistics(@Query() query: any) {
    return await this.adminService.getStatistics(query);
  }
}
