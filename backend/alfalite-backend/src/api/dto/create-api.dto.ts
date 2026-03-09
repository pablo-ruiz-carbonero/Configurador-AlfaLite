import { IsString, IsArray, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateApiDto {
  @ApiProperty() @IsString() name: string;
  @ApiProperty() @IsArray() location: string[];
  @ApiProperty() @IsArray() application: string[];
  @ApiProperty() @IsNumber() horizontal: number;
  @ApiProperty() @IsNumber() vertical: number;

  // el backend almacena pixel_pitch en la BD, pero aquí usamos camelCase
  @ApiProperty({ name: 'pixelPitch' })
  @IsNumber()
  pixelPitch: number;

  @ApiProperty() @IsNumber() width: number;
  @ApiProperty() @IsNumber() height: number;
  @ApiProperty() @IsNumber() depth: number;
  @ApiProperty() @IsNumber() consumption: number;
  @ApiProperty() @IsNumber() weight: number;
  @ApiProperty() @IsNumber() brightness: number;

  @ApiProperty({ required: false, name: 'refreshRate' })
  @IsOptional()
  @IsNumber()
  refreshRate?: number;

  @ApiProperty({ required: false }) @IsOptional() @IsString() contrast?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() image?: string;
}
