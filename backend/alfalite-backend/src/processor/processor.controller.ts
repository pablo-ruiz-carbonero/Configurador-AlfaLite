import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { ProcessorService } from './processor.service';
import {
  CalculationRequestDto,
  ConfigurationSolutionDto,
  ProcessorDto,
  ReceivingCardDto,
  ConverterDto,
} from './dto';

@Controller('api/processor')
export class ProcessorController {
  constructor(private processorService: ProcessorService) {}

  /**
   * GET /api/processor/processors?brand=NovaStar
   * Obtiene procesadores disponibles para una marca
   */
  @Get('processors')
  async getProcessors(
    @Query('brand') brand: 'NovaStar' | 'Brompton',
  ): Promise<ProcessorDto[]> {
    return this.processorService.getProcessorsForBrand(brand);
  }

  /**
   * GET /api/processor/input-cards
   * Obtiene tarjetas de entrada disponibles
   */
  @Get('input-cards')
  async getInputCards(): Promise<ReceivingCardDto[]> {
    return this.processorService.getInputCards();
  }

  /**
   * GET /api/processor/output-cards
   * Obtiene tarjetas de salida disponibles
   */
  @Get('output-cards')
  async getOutputCards(): Promise<ReceivingCardDto[]> {
    return this.processorService.getOutputCards();
  }

  /**
   * GET /api/processor/converters
   * Obtiene convertidores disponibles
   */
  @Get('converters')
  async getConverters(): Promise<ConverterDto[]> {
    return this.processorService.getConverters();
  }

  /**
   * POST /api/processor/calculate
   * ENDPOINT PRINCIPAL: Calcula las soluciones recomendadas
   * Body: CalculationRequestDto
   * Response: ConfigurationSolutionDto[]
   */
  @Post('calculate')
  async calculateSolutions(
    @Body() request: CalculationRequestDto,
  ): Promise<ConfigurationSolutionDto[]> {
    return this.processorService.calculateRecommendedSolutions(request);
  }

  /**
   * POST /api/processor/send-email
   * Envía la configuración seleccionada por email
   */
  @Post('send-email')
  async sendConfigurationEmail(
    @Body()
    data: {
      email: string;
      solution: ConfigurationSolutionDto;
      screenSpecs: any;
    },
  ): Promise<{ success: boolean; message: string }> {
    const success = await this.processorService.sendConfigurationByEmail(
      data.email,
      data.solution,
      data.screenSpecs,
    );

    return {
      success,
      message: success ? 'Email sent successfully' : 'Failed to send email',
    };
  }

  /**
   * POST /api/processor/quote-request
   * Envía una solicitud de cotización
   */
  @Post('quote-request')
  async sendQuoteRequest(
    @Body()
    data: {
      email: string;
      solutionId: string;
      screenSpecs: any;
    },
  ): Promise<{ success: boolean; message: string }> {
    const success = await this.processorService.sendQuoteRequest(
      data.email,
      data.solutionId,
      data.screenSpecs,
    );

    return {
      success,
      message: success
        ? 'Quote request sent successfully'
        : 'Failed to send quote request',
    };
  }
}
