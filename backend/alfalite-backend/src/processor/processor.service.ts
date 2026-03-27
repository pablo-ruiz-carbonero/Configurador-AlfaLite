import { Injectable } from '@nestjs/common';
import {
  ProcessorApiService,
  ReceivingCardApiService,
  ConverterApiService,
  ProcessorCalculationService,
  EmailClientService,
} from './services';
import {
  CalculationRequestDto,
  ConfigurationSolutionDto,
  ProcessorDto,
  ReceivingCardDto,
  ConverterDto,
} from './dto';

@Injectable()
export class ProcessorService {
  constructor(
    private processorApiService: ProcessorApiService,
    private receivingCardApiService: ReceivingCardApiService,
    private converterApiService: ConverterApiService,
    private calculationService: ProcessorCalculationService,
    private emailClientService: EmailClientService,
  ) {}

  /**
   * Obtiene procesadores disponibles para una marca específica
   */
  async getProcessorsForBrand(
    brand: 'NovaStar' | 'Brompton',
  ): Promise<ProcessorDto[]> {
    return this.processorApiService.getProcessors(brand);
  }

  /**
   * Obtiene todas las tarjetas de entrada disponibles
   */
  async getInputCards(): Promise<ReceivingCardDto[]> {
    return this.receivingCardApiService.getInputCards();
  }

  /**
   * Obtiene todas las tarjetas de salida disponibles
   */
  async getOutputCards(): Promise<ReceivingCardDto[]> {
    return this.receivingCardApiService.getOutputCards();
  }

  /**
   * Obtiene todos los convertidores disponibles
   */
  async getConverters(): Promise<ConverterDto[]> {
    return this.converterApiService.getConverters();
  }

  /**
   * MÉTODO PRINCIPAL DEL WIZARD
   * Calcula las soluciones recomendadas basadas en la solicitud del usuario
   */
  async calculateRecommendedSolutions(
    request: CalculationRequestDto,
  ): Promise<ConfigurationSolutionDto[]> {
    return this.calculationService.getRecommendedSolutions(request);
  }

  /**
   * Envía la configuración seleccionada por email
   */
  async sendConfigurationByEmail(
    recipientEmail: string,
    solution: ConfigurationSolutionDto,
    screenSpecs: any,
  ): Promise<boolean> {
    return this.emailClientService.sendConfigurationEmail(recipientEmail, {
      solution,
      screenSpecs,
    });
  }

  /**
   * Envía una solicitud de cotización
   */
  async sendQuoteRequest(
    recipientEmail: string,
    solutionId: string,
    screenSpecs: any,
  ): Promise<boolean> {
    return this.emailClientService.sendQuoteRequest(
      recipientEmail,
      solutionId,
      screenSpecs,
    );
  }

  /**
   * Obtiene información sobre una solución específica (para historial)
   */
  async getSolutionDetails(
    solutionId: string,
  ): Promise<ConfigurationSolutionDto | null> {
    // TODO: Implementar persistencia de soluciones
    return null;
  }
}
