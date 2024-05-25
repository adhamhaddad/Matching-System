import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateRequestDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'area' })
  area: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'price' })
  price: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'description' })
  description: string;
}
