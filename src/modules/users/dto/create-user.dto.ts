import { Expose } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { UserRoles } from '@constants/user-roles.constant';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @Expose({ name: 'name' })
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Matches(/^(01)(0|1|2|5)([0-9]{8})$/, {
    message: 'Please enter a valid Egyptian phone number',
  })
  phone: string;

  @ApiProperty()
  @IsEnum(UserRoles)
  @Expose({ name: 'role' })
  role: UserRoles;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/^(?=.*[0-9])(?=.*[a-zA-Z]).*$/, {
    message: 'Password must contain alphabet,numbers and special characters',
  })
  @Expose({ name: 'password' })
  password: string;

  @IsString()
  @IsOptional()
  salt: string;
}
