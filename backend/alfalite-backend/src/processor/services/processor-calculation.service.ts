import { Injectable } from '@nestjs/common';
import {
  ProcessorDto,
  ReceivingCardDto,
  ConverterDto,
  CalculationRequestDto,
  ConfigurationSolutionDto,
} from '../dto';
import {
  NOVASTAR_PROCESSORS,
  BROMPTON_PROCESSORS,
  RECEIVING_CARDS,
  CONVERTERS,
} from './mock-data';

@Injectable()
export class ProcessorCalculationService {
  /**
   * Calcula las soluciones recomendadas basadas en especificaciones de pantalla
   * Este es el CORAZÓN del Processor Wizard
   */
  async getRecommendedSolutions(
    request: CalculationRequestDto,
  ): Promise<ConfigurationSolutionDto[]> {
    const solutions: ConfigurationSolutionDto[] = [];

    // Paso 1: Filtrar procesadores compatibles por marca
    const availableProcessors = this.getAvailableProcessors(
      request.selectedBrand,
    );

    // Paso 2: Calcular requisitos de pantalla
    const screenRequirements = this.calculateScreenRequirements(
      request.screenData,
    );

    // Paso 3: Calcular número de procesadores necesarios
    const possibleConfigurations = this.calculateProcessorConfigurations(
      availableProcessors,
      screenRequirements,
    );

    // Paso 4: Para cada configuración, calcular tarjetas y convertidores necesarios
    for (const config of possibleConfigurations) {
      const solution = await this.buildConfigurationSolution(
        config,
        request,
        screenRequirements,
      );
      solutions.push(solution);
    }

    // Ordenar por costo (mejor relación)
    return solutions.sort((a, b) => a.totalCost - b.totalCost);
  }

  private getAvailableProcessors(
    brand: 'NovaStar' | 'Brompton',
  ): ProcessorDto[] {
    return brand === 'NovaStar' ? NOVASTAR_PROCESSORS : BROMPTON_PROCESSORS;
  }

  private calculateScreenRequirements(
    screenData: CalculationRequestDto['screenData'],
  ) {
    return {
      totalPixels: screenData.width * screenData.height,
      width: screenData.width,
      height: screenData.height,
      physicalWidth: screenData.physicalWidth,
      physicalHeight: screenData.physicalHeight,
      pixelPitch: screenData.pixelPitch || 6.25,
    };
  }

  private calculateProcessorConfigurations(
    processors: ProcessorDto[],
    requirements: ReturnType<typeof this.calculateScreenRequirements>,
  ) {
    const configurations: ProcessorDto[][] = [];

    // Configuración de procesador único
    const singleProcessor = processors.find(
      (p) => p.maxPixels >= requirements.totalPixels,
    );
    if (singleProcessor) {
      configurations.push([singleProcessor]);
    }

    // Configuración múltiple (si es necesario)
    if (!singleProcessor) {
      const multiConfig = this.findMultiProcessorConfig(
        processors,
        requirements.totalPixels,
      );
      if (multiConfig.length > 0) {
        configurations.push(multiConfig);
      }
    }

    return configurations;
  }

  private findMultiProcessorConfig(
    processors: ProcessorDto[],
    totalPixels: number,
  ): ProcessorDto[] {
    const config: ProcessorDto[] = [];
    let pixelsRemaining = totalPixels;

    // Usar el procesador más potente disponible
    const strongestProcessor = processors.reduce((prev, current) =>
      prev.maxPixels > current.maxPixels ? prev : current,
    );

    while (pixelsRemaining > 0) {
      config.push(strongestProcessor);
      pixelsRemaining -= strongestProcessor.maxPixels;
    }

    return config;
  }

  private async buildConfigurationSolution(
    processorConfig: ProcessorDto[],
    request: CalculationRequestDto,
    screenRequirements: ReturnType<typeof this.calculateScreenRequirements>,
  ): Promise<ConfigurationSolutionDto> {
    // Calcular tarjetas de entrada necesarias
    const inputCards = this.calculateInputCards(
      request.selectedMainInputType,
      request.selectedAuxiliaryInputs,
      processorConfig[0]?.brand || 'NovaStar',
    );

    // Calcular tarjetas de salida
    const outputCards = this.calculateOutputCards(
      request.selectedOutputType,
      processorConfig[0]?.brand || 'NovaStar',
    );

    // Calcular costo total
    const processorCost = processorConfig.reduce((sum, p) => sum + p.cost, 0);
    const inputCardsCost = inputCards.reduce((sum, c) => sum + c.cost, 0);
    const outputCardsCost = outputCards.reduce((sum, c) => sum + c.cost, 0);
    const totalCost = processorCost + inputCardsCost + outputCardsCost;

    // Construir resumen
    const summary = `${processorConfig.length} × ${processorConfig[0]?.name} with ${inputCards.length} input cards and ${outputCards.length} output cards`;

    return {
      id: `sol-${Date.now()}-${Math.random()}`,
      rank: 1,
      processors: processorConfig,
      inputCards,
      outputCards,
      auxiliaryOutputCards: request.selectedAuxiliaryOutputs
        ? Object.entries(request.selectedAuxiliaryOutputs).flatMap(
            () => outputCards,
          )
        : [],
      totalCost,
      costBreakdown: {
        processors: processorCost,
        inputCards: inputCardsCost,
        outputCards: outputCardsCost,
      },
      solutionType:
        processorConfig.length === 1 ? 'single_processor' : 'multi_processor',
      tilesPerProcessor: screenRequirements.totalPixels,
      summary,
      advantages: [
        `Handles ${screenRequirements.totalPixels.toLocaleString()} pixels`,
        `${processorConfig[0]?.supportedResolutions.join(', ')} resolutions`,
        `Multiple ${request.selectedMainInputType} inputs available`,
      ],
      considerations:
        processorConfig.length > 1
          ? [
              'Multiple processors require synchronization',
              'Ensure network stability for distributed setup',
            ]
          : ['Single processor setup - simple installation'],
      metadata: {
        screenRequirements,
        configuration: request,
      },
    };
  }

  private calculateInputCards(
    mainInputType: string,
    auxiliaryInputs: Record<string, number>,
    processorBrand: 'NovaStar' | 'Brompton',
  ): ReceivingCardDto[] {
    const cards: ReceivingCardDto[] = [];

    // Main input card
    const mainCard = RECEIVING_CARDS.find(
      (c) =>
        c.type === 'input' &&
        c.processorBrand === processorBrand &&
        c.connectorType.toUpperCase().includes(mainInputType.toUpperCase()),
    );

    if (mainCard) {
      cards.push(mainCard);
    }

    // Auxiliary inputs
    if (auxiliaryInputs['ScalerInput']) {
      const scalerCard = RECEIVING_CARDS.find((c) => c.id === 'card-backup');
      if (scalerCard) {
        cards.push(scalerCard);
      }
    }

    return cards;
  }

  private calculateOutputCards(
    outputType: string,
    processorBrand: 'NovaStar' | 'Brompton',
  ): ReceivingCardDto[] {
    const card = RECEIVING_CARDS.find(
      (c) =>
        c.type === 'output' &&
        c.processorBrand === processorBrand &&
        c.connectorType === outputType,
    );

    return card ? [card] : [];
  }
}
