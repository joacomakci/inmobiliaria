import { IsEmail, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { LeadSource } from '../entities/lead.entity';

export class CreateLeadDto {
  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsEmail()
  email!: string;

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