import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Length,
  Min,
} from 'class-validator';
import {
  PropertyOperation,
  PropertyType,
} from '../entities/property.entity';

export class CreatePropertyDto {
  @IsString()
  title!: string;

  @IsString()
  description!: string;

  @IsEnum(PropertyType)
  type!: PropertyType;

  @IsEnum(PropertyOperation)
  operation!: PropertyOperation;

  @IsNumber()
  @IsPositive()
  price!: number;

  @IsOptional()
  @IsString()
  @Length(3, 3)
  currency?: string;

  @IsString()
  address!: string;

  @IsString()
  city!: string;

  @IsOptional()
  @IsString()
  neighborhood?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  areaM2?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  rooms?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  bathrooms?: number;

  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @IsUUID()
  agentId!: string;
}