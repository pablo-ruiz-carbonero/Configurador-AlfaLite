import { IsString, IsEmail, IsNumber } from 'class-validator';

export class CreateQuoteDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  company: string;

  @IsString()
  project: string;

  @IsString()
  assembly: string;

  @IsNumber()
  productId: number;

  @IsNumber()
  tilesH: number;

  @IsNumber()
  tilesV: number;

  @IsString()
  unit: string;
}
