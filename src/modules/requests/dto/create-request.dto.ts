import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PropertyType } from '@constants/property-types.constant';

export class CreateRequestDto {
  @ApiProperty()
  @IsEnum(PropertyType)
  @Expose({ name: 'propertyType' })
  propertyType: PropertyType;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'area' })
  area: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'price' })
  price: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'city' })
  city: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'district' })
  district: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'description' })
  description: string;

  @IsOptional()
  @IsString()
  userUuid: string;
}
