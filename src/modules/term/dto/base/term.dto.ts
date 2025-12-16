import { IsNotEmpty, IsString } from 'class-validator';

export class TermDto {
  @IsNotEmpty()
  @IsString()
  content: string;
}
