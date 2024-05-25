import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { PropertyType } from '@constants/property-types.constant';

export class UpdateAdsDto {
  @ApiProperty()
  @Expose({ name: 'propertyType' })
  propertyType: PropertyType;

  @ApiProperty()
  @Expose({ name: 'area' })
  area: string;

  @ApiProperty()
  @Expose({ name: 'price' })
  price: string;

  @ApiProperty()
  @Expose({ name: 'district' })
  district: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'city' })
  city: string;

  @ApiProperty()
  @Expose({ name: 'description' })
  description: string;

  @ApiProperty()
  @Expose({ name: 'refreshedAt' })
  refreshedAt: Date;
}
