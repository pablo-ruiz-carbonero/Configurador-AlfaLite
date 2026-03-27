import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApiModule } from './api/Dashboard/api.module';
import { ApiModule as ConfiguratorApiModule } from './api/Configurator/api.module';
import { ProcessorModule } from './processor/processor.module';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { WinstonModule } from 'nest-winston';
import { WinstonLoggerService } from './common/logger/logger.service';

@Module({
  imports: [
    // 1. Cargamos el archivo .env de forma global
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // 2. Winston para logging centralizado
    WinstonModule.forRootAsync({
      useClass: WinstonLoggerService,
    }),

    // 3. Configuración asíncrona de TypeORM
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

    // 4. Tus módulos
    AuthModule,
    ApiModule,
    ConfiguratorApiModule,
    ProcessorModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
