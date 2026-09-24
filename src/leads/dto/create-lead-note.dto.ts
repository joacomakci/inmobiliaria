import { IsString } from 'class-validator';

export class CreateLeadNoteDto {
  @IsString()
  text!: string;
}