import { IsInt, IsOptional, IsString, IsUrl, Min } from 'class-validator';

export class CreatePropertyImageDto {
  @IsString()
  @IsUrl()
  url!: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}