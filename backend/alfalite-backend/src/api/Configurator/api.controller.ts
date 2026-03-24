import {
  Controller,
  Get,
  Post,
  Param,
  ParseIntPipe,
  Body,
  Res,
  Header,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiService } from './api.service';
import { CreateQuoteDto } from './dto/quote.dto';
import { CreatePdfDto } from './dto/pdf.dto';
import type { Response } from 'express';

/**
 * Ruta PÚBLICA — usada por el configurador sin autenticación.
 * GET /api/configurator/products
 * POST /api/configurator/quote
 * POST /api/configurator/pdf
 */
@ApiTags('configurator')
@Controller('api/configurator')
export class ConfiguratorController {
  constructor(private readonly apiService: ApiService) {}

  @Get('products')
  findAll() {
    return this.apiService.findAll();
  }

  @Get('products/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.apiService.findOne(id);
  }

  @Post('quote')
  createQuote(@Body() createQuoteDto: CreateQuoteDto) {
    return this.apiService.createQuote(createQuoteDto);
  }

  @Post('pdf')
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'attachment; filename="led-configuration.pdf"')
  async createPdf(@Body() createPdfDto: CreatePdfDto, @Res() res: Response) {
    const pdfBuffer = await this.apiService.createPdf(createPdfDto);
    res.send(pdfBuffer);
  }
}
