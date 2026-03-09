import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiService } from './api.service';
import { ApiController } from './api.controller';
import { Product } from './entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product])], // <--- IMPORTANTE
  controllers: [ApiController],
  providers: [ApiService],
})
export class ApiModule {}
