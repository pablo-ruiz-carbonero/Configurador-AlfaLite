import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'admin' })
  @IsString()
  username: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @MinLength(1, { message: 'La contraseña debe tener al menos 1 carácter' })
  password: string;
}
