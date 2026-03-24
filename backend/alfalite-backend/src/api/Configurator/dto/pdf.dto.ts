import { IsNumber, IsString } from 'class-validator';

export class CreatePdfDto {
  @IsNumber()
  productId: number;

  @IsNumber()
  tilesH: number;

  @IsNumber()
  tilesV: number;

  @IsString()
  unit: string;
}
