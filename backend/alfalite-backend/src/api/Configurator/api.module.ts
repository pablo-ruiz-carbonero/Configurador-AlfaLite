import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ApiService } from './api.service';
import { ConfiguratorController } from './api.controller';
import { Product } from './entities/product.entity';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Product])],
  controllers: [ConfiguratorController],
  providers: [ApiService],
})
export class ApiModule {}
