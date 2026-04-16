import {
  IsString,
  IsNumber,
  IsPositive,
  IsOptional,
  IsInt,
  Min,
  IsUrl,
} from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  stock?: number;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  categoryId?: number;
}
