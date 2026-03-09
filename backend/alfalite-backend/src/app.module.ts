import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApiModule } from './api/api.module';

@Module({
  imports: [
    // 1. Cargamos el archivo .env de forma global
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // 2. Configuración asíncrona de TypeORM
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_ADMIN_USER'),
        password: configService.get<string>('DB_ADMIN_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        autoLoadEntities: true, // Carga automáticamente las entidades de los módulos
        synchronize: false, // ¡IMPORTANTE! Usamos false porque ya creamos la BD con init-db.sql
      }),
    }),

    // 3. Tus módulos
    AuthModule,
    ApiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
