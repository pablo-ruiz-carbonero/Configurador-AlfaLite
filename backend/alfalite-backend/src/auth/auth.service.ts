import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;

    this.logger.log(`Login attempt for user: ${username}`);

    // Buscamos usuario incluyendo explícitamente el password_hash
    const user = await this.userRepository.findOne({
      where: { username },
      select: ['id', 'username', 'password_hash'],
    });

    if (!user) {
      this.logger.warn(`Login failed: User not found - ${username}`);
      throw new UnauthorizedException('Usuario no encontrado');
    }

    // Comparamos password de React con el hash de la DB
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      this.logger.warn(`Login failed: Invalid password for user: ${username}`);
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    const payload = { sub: user.id, username: user.username };
    const token = this.jwtService.sign(payload);

    this.logger.log(`Login successful for user: ${username}`);

    return {
      access_token: token,
      user: {
        id: user.id,
        username: user.username,
      },
    };
  }

  async register(registerDto: LoginDto) {
    // Usamos el mismo DTO de Login
    const { username, password } = registerDto;

    this.logger.log(`Registration attempt for user: ${username}`);

    // Generamos el hash aquí, dentro de NestJS, usando la misma librería que el login
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = this.userRepository.create({
        username,
        password_hash: hashedPassword,
      });
      const savedUser = await this.userRepository.save(user);
      this.logger.log(`Registration successful for user: ${username}`);
      return savedUser;
    } catch (error) {
      this.logger.warn(
        `Registration failed: User already exists - ${username}`,
      );
      throw new ConflictException('El usuario ya existe');
    }
  }
}
