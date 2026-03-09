import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;

    // Buscamos usuario incluyendo explícitamente el password_hash
    const user = await this.userRepository.findOne({
      where: { username },
      select: ['id', 'username', 'password_hash'],
    });

    if (!user) throw new UnauthorizedException('Usuario no encontrado');

    // Comparamos password de React con el hash de la DB
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid)
      throw new UnauthorizedException('Contraseña incorrecta');

    const payload = { sub: user.id, username: user.username };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
      },
    };
  }

  async register(registerDto: LoginDto) {
    // Usamos el mismo DTO de Login
    const { username, password } = registerDto;

    // Generamos el hash aquí, dentro de NestJS, usando la misma librería que el login
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = this.userRepository.create({
        username,
        password_hash: hashedPassword,
      });
      return await this.userRepository.save(user);
    } catch (error) {
      throw new ConflictException('El usuario ya existe');
    }
  }
}
