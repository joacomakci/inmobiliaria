import { IsEnum } from 'class-validator';
import { LeadStatus } from '../entities/lead.entity';

export class ChangeLeadStatusDto {
  @IsEnum(LeadStatus)
  status!: LeadStatus;
}
