import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsPositive,
  IsOptional,
  IsInt,
  Min,
  IsUrl,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price: number;

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
