import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiService } from './api.service';

/**
 * Ruta PÚBLICA — usada por el configurador sin autenticación.
 * GET /api/configurator/products
 */
@ApiTags('configurator')
@Controller('api/configurator/products')
export class ConfiguratorController {
  constructor(private readonly apiService: ApiService) {}

  @Get()
  findAll() {
    return this.apiService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.apiService.findOne(id);
  }
}
