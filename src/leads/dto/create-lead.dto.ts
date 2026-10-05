import { IsEmail, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { LeadSource } from '../entities/lead.entity';

export class CreateLeadDto {
  @IsString()
  firstName!: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsString()
  message!: string;

  @IsOptional()
  @IsEnum(LeadSource)
  source?: LeadSource;

  @IsOptional()
  @IsUUID()
  propertyId?: string;
}
