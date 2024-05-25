import { SetMetadata } from '@nestjs/common';
import { UserRoles } from '@constants/user-roles.constant';

export const Roles = (...roles: UserRoles[]) => SetMetadata('roles', roles);
