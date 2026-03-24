import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';
import { WinstonLoggerService } from './common/logger/logger.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
  const winstonLogger = new WinstonLoggerService();
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: winstonLogger,
  });

  // validación global de los DTOs; elimina campos extra y transforma tipos
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.enableCors({
    origin: 'http://localhost:5173', // Pon aquí la URL de tu React
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Alfalite API')
    .setDescription('API para el configurador de pantallas y panel de control')
    .setVersion('0.0')
    .addBearerAuth() // Para que Swagger permita meter el token JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  // join(process.cwd()) apunta a la raíz real de tu proyecto (donde está package.json)
  app.useStaticAssets(join(process.cwd(), 'uploads'));
  await app.listen(1337);
  winstonLogger.log('Server listening on http://localhost:1337', 'Bootstrap');
}
bootstrap();
