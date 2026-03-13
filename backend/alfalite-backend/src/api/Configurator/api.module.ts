import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiService } from './api.service';
import { ConfiguratorController } from './api.controller';
import { Product } from './entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product])], // <--- IMPORTANTE
  controllers: [ConfiguratorController],
  providers: [ApiService],
})
export class ApiModule {}
