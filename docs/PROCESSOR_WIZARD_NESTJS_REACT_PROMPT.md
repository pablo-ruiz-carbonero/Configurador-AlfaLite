# 🚀 PROMPT PARA PORTAR PROCESSOR WIZARD A NESTJS + REACT TS

## Contexto General

Necesito portar completamente la lógica del **Processor Wizard** (actualmente en Flutter/Dart con BLoC) a una **arquitectura moderna de web**:

- **Backend:** NestJS + TypeScript
- **Frontend:** React + TypeScript + Redux Toolkit (para state management)
- **Objetivo:** Replicar EXACTAMENTE la misma lógica y flujo

---

## INSTRUCCIONES DETALLADAS

### FASE 1: ANÁLISIS Y PLANTIFICACIÓN

Primero, familiarizte con la documentación completa del Processor Wizard en [PROCESSOR_WIZARD_README.md](../PROCESSOR_WIZARD_README.md). Este documento contiene:

1. **Arquitectura BLoC original** (Process Bloc completo)
2. **Lógica de cálculo matemática compleja** (ProcessorCalculationService)
3. **Estados y eventos** (ProcessorState, ProcessorEvents)
4. **Flujo de 7 pasos del wizard**
5. **Configuraciones específicas** (Brompton vs NovaStar)
6. **Modo dual-pantalla** para comparación

### FASE 2: ESTRUCTURA DE CARPETAS (NestJS Backend)

```
backend/
├── src/
│   ├── processor/                    # Módulo principal
│   │   ├── processor.module.ts       # Módulo NestJS
│   │   ├── processor.controller.ts   # Endpoints HTTP
│   │   ├── processor.service.ts      # Orquestación (equivalente a ProcessorBloc)
│   │   │
│   │   ├── services/                 # Servicios específicos
│   │   │   ├── processor-api.service.ts         # Obtener procesadores
│   │   │   ├── receiving-card-api.service.ts    # Obtener tarjetas
│   │   │   ├── converter-api.service.ts         # Obtener convertidores
│   │   │   ├── processor-calculation.service.ts # LÓGICA CRÍTICA
│   │   │   └── email-client.service.ts          # Enviar emails
│   │   │
│   │   ├── dto/                      # Data Transfer Objects
│   │   │   ├── processor.dto.ts
│   │   │   ├── receiving-card.dto.ts
│   │   │   ├── configuration-solution.dto.ts
│   │   │   ├── brompton-config.dto.ts
│   │   │   ├── novastar-config.dto.ts
│   │   │   ├── calculation-request.dto.ts       # Input del cálculo
│   │   │   └── wizard-state.dto.ts
│   │   │
│   │   ├── entities/                 # Modelos de base de datos
│   │   │   ├── processor.entity.ts
│   │   │   ├── receiving-card.entity.ts
│   │   │   ├── converter.entity.ts
│   │   │   └── configuration-solution.entity.ts
│   │   │
│   │   └── interfaces/               # Interfaces TypeScript
│   │       ├── processor.interface.ts
│   │       ├── receiving-card.interface.ts
│   │       ├── processor-status.interface.ts
│   │       └── calculation.interface.ts
│   │
│   └── common/                       # Compartido
│       ├── enums/
│       │   ├── processor-status.enum.ts  # initial, loading, success, failure
│       │   ├── processor-brand.enum.ts   # NovaStar, Brompton
│       │   └── configuration-mode.enum.ts
│       │
│       └── utils/
│           └── calculation.utils.ts  # Funciones auxiliares
│
└── test/
    └── processor.service.spec.ts   # Tests unitarios
```

### FASE 3: DTOs (Data Transfer Objects)

Crear estos DTOs que mapeen exactamente los datos esperados:

#### CalculationRequestDto

```typescript
// Representa la solicitud de cálculo (equivalente a evento CalculationRun)
export class CalculationRequestDto {
  // DATOS DE PANTALLA
  screenData: {
    width: number; // pixels horizontales (ej: 1920)
    height: number; // pixels verticales (ej: 1080)
    physicalWidth: number; // metros (ej: 10)
    physicalHeight: number; // metros (ej: 5)
  };

  // SELECCIONES DEL USUARIO
  selectedBrand: "NovaStar" | "Brompton";
  selectedApplications: string[]; // ['Broadcast', 'Rental']
  selectedConnectors: Record<string, number>; // {'HDMI': 4, 'DP': 2}

  // ENTRADA
  selectedMainInputType: string; // 'HDMI', 'DP', 'Fiber'
  selectedAuxiliaryInputs: Record<string, number>; // {'ScalerInput': 1}

  // SALIDA
  selectedOutputType: "RJ45" | "OpticalFiber";
  selectedAuxiliaryOutputs: Record<string, number>; // {'Backup': 2}

  // CONFIGURACIÓN ESPECÍFICA
  bromptonConfig?: BromptonConfigDto;
  novastarConfig?: NovaStarConfigDto;
}
```

#### BromptonConfigDto

```typescript
export class BromptonConfigDto {
  frameRate: 60 | 120 | 240; // Hz
  bitDepth: 8 | 10 | 12; // bits
  ull: boolean; // Ultra-Low Latency
  failover: boolean;
  redundant: boolean;
  switches: boolean;
  interpolated: boolean;
}
```

#### ConfigurationSolutionDto

```typescript
export class ConfigurationSolutionDto {
  id: string;
  processors: ProcessorDto[];
  inputCards: ReceivingCardDto[];
  outputCards: ReceivingCardDto[];
  auxiliaryOutputCards?: ReceivingCardDto[];
  converters: ConverterDto[];
  totalCost: number;
  solutionType: "single_processor" | "multi_processor" | "h_series";
  metadata: Record<string, any>;
}
```

### FASE 4: NestJS ProcessorService (Equivalente a ProcessorBloc)

```typescript
// src/processor/processor.service.ts
import { Injectable } from "@nestjs/common";
import { CalculationRequestDto, ConfigurationSolutionDto } from "./dto";
import { ProcessorCalculationService } from "./services/processor-calculation.service";
import { ProcessorApiService } from "./services/processor-api.service";
import { ReceivingCardApiService } from "./services/receiving-card-api.service";
import { ConverterApiService } from "./services/converter-api.service";

@Injectable()
export class ProcessorService {
  constructor(
    private processorApiService: ProcessorApiService,
    private receivingCardApiService: ReceivingCardApiService,
    private converterApiService: ConverterApiService,
    private calculationService: ProcessorCalculationService,
  ) {}

  // ❌ EQUIVALENTE a obtener lista de procesadores para una marca
  async getProcessorsForBrand(brand: "NovaStar" | "Brompton") {
    return this.processorApiService.getProcessors(brand);
  }

  // ❌ EQUIVALENTE a obtener tarjetas de entrada/salida
  async getInputCards() {
    return this.receivingCardApiService.getInputCards();
  }

  async getOutputCards() {
    return this.receivingCardApiService.getOutputCards();
  }

  // ❌ EQUIVALENTE a CalculationRun event en BLoC
  // ESTE ES EL MÉTODO MÁS IMPORTANTE - Implementa getRecommendedSolutions()
  async calculateRecommendedSolutions(
    request: CalculationRequestDto,
  ): Promise<ConfigurationSolutionDto[]> {
    try {
      // El ProcessorCalculationService debe contener TODA la lógica
      const solutions = await this.calculationService.getRecommendedSolutions({
        screenData: request.screenData,
        availableProcessors: await this.getProcessorsForBrand(
          request.selectedBrand,
        ),
        availableInputCards: await this.getInputCards(),
        availableOutputCards: await this.getOutputCards(),
        availableConverters: await this.converterApiService.getConverters(),
        selectedApplications: request.selectedApplications,
        selectedConnectors: request.selectedConnectors,
        selectedOutputType: request.selectedOutputType,
        selectedAuxiliaryOutputs: request.selectedAuxiliaryOutputs,
        selectedMainInputType: request.selectedMainInputType,
        selectedAuxiliaryInputs: request.selectedAuxiliaryInputs,
        bromptonConfig: request.bromptonConfig,
        novastarConfig: request.novastarConfig,
      });

      return solutions;
    } catch (error) {
      throw new Error(`Calculation failed: ${error.message}`);
    }
  }

  // ❌ Endpoint para enviar resultados
  async sendResults(
    solution: ConfigurationSolutionDto,
    userData: { name: string; email: string; company: string },
  ) {
    // Llamar a EmailClientService para enviar por email
    return this.emailClientService.sendResults(solution, userData);
  }
}
```

### FASE 5: ProcessorCalculationService (LÓGICA CRÍTICA)

Este es el corazón del sistema - debe replicar exactamente la lógica de `processor_calculation_service.dart`:

```typescript
// src/processor/services/processor-calculation.service.ts
import { Injectable } from "@nestjs/common";
import {
  ConfigurationSolutionDto,
  ProcessorDto,
  ReceivingCardDto,
  ConverterDto,
} from "../dto";

interface CalculationInput {
  screenData: {
    width: number;
    height: number;
    physicalWidth: number;
    physicalHeight: number;
  };
  availableProcessors: ProcessorDto[];
  availableInputCards: ReceivingCardDto[];
  availableOutputCards: ReceivingCardDto[];
  availableConverters: ConverterDto[];
  selectedApplications: string[];
  selectedConnectors: Record<string, number>;
  selectedOutputType: string;
  selectedAuxiliaryOutputs: Record<string, number>;
  selectedMainInputType: string;
  selectedAuxiliaryInputs: Record<string, number>;
  bromptonConfig?: any;
  novastarConfig?: any;
}

@Injectable()
export class ProcessorCalculationService {
  /**
   * MÉTODO PRINCIPAL - EQUIVALENTE a getRecommendedSolutions() en Dart
   *
   * Algoritmo:
   * 1. Calcular requisitos (píxeles, puertos, slots)
   * 2. Filtrar procesadores viables
   * 3. Generar combinaciones de soluciones
   * 4. Ordenar por costo
   * 5. Retornar top 5
   */
  async getRecommendedSolutions(
    input: CalculationInput,
  ): Promise<ConfigurationSolutionDto[]> {
    // PASO 1: CALCULAR REQUISITOS
    const totalPixels = input.screenData.width * input.screenData.height;
    const requiredOutputPorts = this.calculateOutputPorts(
      totalPixels,
      input.selectedOutputType,
    );

    // PASO 2: FILTRAR PROCESADORES
    let viableProcessors = input.availableProcessors
      .filter((p) => this._canFit(p, totalPixels))
      .filter((p) => this._supportsApplications(p, input.selectedApplications))
      .filter((p) => p.connectorsInput?.[input.selectedMainInputType] != null);

    // PASO 3: GENERAR SOLUCIONES
    const allSolutions: ConfigurationSolutionDto[] = [];

    for (const processor of viableProcessors) {
      // 3.1 Obtener tarjetas de entrada
      const inputCards = this._getInputCardsCombinations(
        processor,
        input.selectedMainInputType,
        input.selectedAuxiliaryInputs,
        input.availableInputCards,
      );

      // 3.2 Obtener tarjetas de salida
      const outputCards = this._getOutputCardsCombinations(
        processor,
        input.selectedOutputType,
        requiredOutputPorts,
        input.availableOutputCards,
      );

      // 3.3 Validar espacio
      const totalSlots = processor.maxInputCards + processor.maxOutputCards;
      const usedSlots = inputCards.length + outputCards.length;
      if (usedSlots > totalSlots) continue;

      // 3.4 Obtener convertidores
      const converters = this._selectConverters(
        inputCards,
        outputCards,
        input.availableConverters,
      );

      // 3.5 Calcular costo
      const totalCost =
        processor.price +
        inputCards.reduce((sum, c) => sum + (c.price || 0), 0) +
        outputCards.reduce((sum, c) => sum + (c.price || 0), 0) +
        converters.reduce((sum, c) => sum + (c.price || 0), 0);

      // 3.6 Crear solución
      allSolutions.push({
        id: `${processor.id}_${inputCards.length}_${outputCards.length}`,
        processors: [processor],
        inputCards,
        outputCards,
        converters,
        totalCost,
        solutionType: "single_processor",
        metadata: {
          pixelCapacity: processor.maxPixels,
          usedSlots,
          totalSlots,
        },
      });
    }

    // PASO 4: ORDENAR Y RETORNAR TOP 5
    allSolutions.sort((a, b) => a.totalCost - b.totalCost);
    return allSolutions.slice(0, 5);
  }

  // MÉTODOS AUXILIARES

  /**
   * Calcular puertos RJ45 necesarios
   * Lógica: totalPixels / pixelsPerPort
   */
  private calculateOutputPorts(
    totalPixels: number,
    outputType: string,
  ): number {
    const PIXELS_PER_RJ45_PORT = 128000;
    const PIXELS_PER_FIBER_PORT = 256000;

    if (outputType === "RJ45") {
      return Math.ceil(totalPixels / PIXELS_PER_RJ45_PORT);
    } else if (outputType === "OpticalFiber") {
      return Math.ceil(totalPixels / PIXELS_PER_FIBER_PORT);
    }
    return 0;
  }

  /**
   * ¿El procesador puede manejar esta resolución?
   */
  private _canFit(processor: ProcessorDto, totalPixels: number): boolean {
    return totalPixels <= (processor.maxPixels || Infinity);
  }

  /**
   * ¿El procesador soporta todas las aplicaciones seleccionadas?
   */
  private _supportsApplications(
    processor: ProcessorDto,
    selectedApplications: string[],
  ): boolean {
    return selectedApplications.every((app) =>
      processor.applications?.includes(app),
    );
  }

  /**
   * Obtener combinaciones de tarjetas de entrada
   */
  private _getInputCardsCombinations(
    processor: ProcessorDto,
    mainInputType: string,
    auxiliaryInputs: Record<string, number>,
    availableInputCards: ReceivingCardDto[],
  ): ReceivingCardDto[] {
    const selectedCards: ReceivingCardDto[] = [];

    // Buscar tarjeta que soporte el tipo de entrada principal
    const mainInputCard = availableInputCards.find(
      (card) => card.connectorsInput?.[mainInputType],
    );

    if (mainInputCard) {
      selectedCards.push(mainInputCard);
    }

    // Agregar tarjetas auxiliares según configuración
    for (const [cardName, quantity] of Object.entries(auxiliaryInputs)) {
      if (quantity > 0) {
        const card = availableInputCards.find((c) => c.name === cardName);
        if (card) {
          selectedCards.push(card);
        }
      }
    }

    return selectedCards;
  }

  /**
   * Obtener combinaciones de tarjetas de salida
   * Necesitamos llenar requiredPorts puertos
   */
  private _getOutputCardsCombinations(
    processor: ProcessorDto,
    outputType: string,
    requiredPorts: number,
    availableOutputCards: ReceivingCardDto[],
  ): ReceivingCardDto[] {
    const selectedCards: ReceivingCardDto[] = [];
    let portsNeeded = requiredPorts;

    // Filtrar tarjetas compatibles
    const compatibleCards = availableOutputCards.filter(
      (card) => card.connectorsOutput?.[outputType],
    );

    // Llenar tarjetas hasta alcanzar puertos requeridos
    for (const card of compatibleCards) {
      if (portsNeeded <= 0) break;
      selectedCards.push(card);
      portsNeeded -= card.connectorsOutput?.[outputType] || 0;
    }

    return selectedCards;
  }

  /**
   * Obtener convertidores necesarios
   */
  private _selectConverters(
    inputCards: ReceivingCardDto[],
    outputCards: ReceivingCardDto[],
    availableConverters: ConverterDto[],
  ): ConverterDto[] {
    // Lógica para determinar qué convertidores se necesitan
    // (dependerá de los tipos de entrada/salida)
    return [];
  }
}
```

### FASE 6: NestJS Controller (Endpoints HTTP)

```typescript
// src/processor/processor.controller.ts
import { Controller, Post, Get, Body } from "@nestjs/common";
import { ProcessorService } from "./processor.service";
import { CalculationRequestDto, SendResultsDto } from "./dto";

@Controller("api/processor")
export class ProcessorController {
  constructor(private processorService: ProcessorService) {}

  // GET: Obtener procesadores de una marca
  @Get("processors/:brand")
  async getProcessors(@Param("brand") brand: string) {
    return this.processorService.getProcessorsForBrand(
      brand as "NovaStar" | "Brompton",
    );
  }

  // GET: Obtener tarjetas de entrada disponibles
  @Get("receiving-cards/input")
  async getInputCards() {
    return this.processorService.getInputCards();
  }

  // GET: Obtener tarjetas de salida disponibles
  @Get("receiving-cards/output")
  async getOutputCards() {
    return this.processorService.getOutputCards();
  }

  // POST: CÁLCULO CRÍTICO - calcular soluciones recomendadas
  @Post("calculate")
  async calculateSolutions(@Body() request: CalculationRequestDto) {
    return this.processorService.calculateRecommendedSolutions(request);
  }

  // POST: Enviar resultados por email
  @Post("send-results")
  async sendResults(@Body() request: SendResultsDto) {
    return this.processorService.sendResults(
      request.solution,
      request.userData,
    );
  }
}
```

### FASE 7: React Frontend - Redux Store

Crear estado Redux equivalente a ProcessorState de Flutter:

```typescript
// frontend/src/store/processorSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  ConfigurationSolutionDto,
  ProcessorDto,
  ReceivingCardDto,
} from "../types";

export enum ProcessorStatus {
  INITIAL = "initial",
  LOADING = "loading",
  SUCCESS = "success",
  FAILURE = "failure",
}

export interface ProcessorState {
  // ── NAVEGACIÓN ──
  currentStep: number; // 1-7

  // ── DATOS DE PANTALLA ──
  screenData: {
    width: number;
    height: number;
    physicalWidth: number;
    physicalHeight: number;
  } | null;
  product: any | null;

  // ── SELECCIONES DEL USUARIO ──
  selectedBrand: "NovaStar" | "Brompton" | null;
  selectedApplications: string[];
  selectedConnectors: Record<string, number>;

  // ── ENTRADA ──
  selectedMainInputType: string | null;
  selectedAuxiliaryInputs: Record<string, number>;

  // ── SALIDA ──
  selectedOutputType: "RJ45" | "OpticalFiber" | null;
  selectedAuxiliaryOutputs: Record<string, number>;

  // ── RESULTADOS ──
  recommendedSolutions: ConfigurationSolutionDto[] | null;
  selectedSolutionIndex: number;

  // ── ESTADO ──
  status: ProcessorStatus;
  errorMessage: string | null;

  // ── MODO DUAL-SCREEN ──
  isDualScreenMode: boolean;
  currentScreenTab: number;
  currentStep2: number;
  // ... (duplicar campos para Screen 2)
}

const initialState: ProcessorState = {
  currentStep: 1,
  screenData: null,
  product: null,
  selectedBrand: null,
  selectedApplications: [],
  selectedConnectors: {},
  selectedMainInputType: null,
  selectedAuxiliaryInputs: {},
  selectedOutputType: null,
  selectedAuxiliaryOutputs: {},
  recommendedSolutions: null,
  selectedSolutionIndex: 0,
  status: ProcessorStatus.INITIAL,
  errorMessage: null,
  isDualScreenMode: false,
  currentScreenTab: 1,
  currentStep2: 1,
};

const processorSlice = createSlice({
  name: "processor",
  initialState,
  reducers: {
    // Equivalent to ProcessorStepChanged event
    stepChanged: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },

    // Equivalent to BrandSelected event
    brandSelected: (state, action: PayloadAction<"NovaStar" | "Brompton">) => {
      state.selectedBrand = action.payload;
      if (action.payload === "Brompton") {
        state.bromptonConfig = {
          frameRate: 60,
          bitDepth: 8,
          ull: false,
          failover: false,
          redundant: false,
          switches: false,
          interpolated: false,
        };
      } else {
        state.novastarConfig = { bitDepth: 8, frameRate: 60 };
      }
    },

    // Equivalent to ApplicationToggled event
    applicationToggled: (state, action: PayloadAction<string>) => {
      const index = state.selectedApplications.indexOf(action.payload);
      if (index > -1) {
        state.selectedApplications.splice(index, 1);
      } else {
        state.selectedApplications.push(action.payload);
      }
    },

    // ... (más reducers para otros eventos)

    // Equivalent to CalculationRun - START
    calculationStarted: (state) => {
      state.status = ProcessorStatus.LOADING;
    },

    // Equivalent to CalculationRun - SUCCESS
    calculationSuccess: (
      state,
      action: PayloadAction<ConfigurationSolutionDto[]>,
    ) => {
      state.recommendedSolutions = action.payload;
      state.status = ProcessorStatus.SUCCESS;
      state.currentStep = 6;
    },

    // Equivalent to CalculationRun - FAILURE
    calculationError: (state, action: PayloadAction<string>) => {
      state.status = ProcessorStatus.FAILURE;
      state.errorMessage = action.payload;
    },
  },
});

export const {
  stepChanged,
  brandSelected,
  applicationToggled,
  calculationStarted,
  calculationSuccess,
  calculationError,
  // ... más exports
} = processorSlice.actions;

export default processorSlice.reducer;
```

### FASE 8: React Components - Pasos del Wizard

Crear componentes React que mapeen a los pasos del wizard de Flutter:

```typescript
// frontend/src/components/wizard/Step1Confirmation.tsx
import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { stepChanged } from '../../store/processorSlice';

export const Step1Confirmation: React.FC = () => {
  const dispatch = useAppDispatch();
  const { screenData, product } = useAppSelector(state => state.processor);

  const handleNext = () => {
    dispatch(stepChanged(2));
  };

  return (
    <div className="step-1-container">
      <h2>Confirm Your Screen Data</h2>
      <div className="data-display">
        <p>Resolution: {screenData?.width} × {screenData?.height}</p>
        <p>Physical Dimensions: {screenData?.physicalWidth}m × {screenData?.physicalHeight}m</p>
        <p>Product: {product?.name}</p>
      </div>
      <button onClick={handleNext}>Next: Select Brand</button>
    </div>
  );
};
```

```typescript
// frontend/src/components/wizard/Step2BrandSelection.tsx
import React from 'react';
import { useAppDispatch } from '../../store/hooks';
import { brandSelected } from '../../store/processorSlice';

export const Step2BrandSelection: React.FC = () => {
  const dispatch = useAppDispatch();

  const handleBrandSelect = (brand: 'NovaStar' | 'Brompton') => {
    dispatch(brandSelected(brand));
    // Nota: El paso siguiente se maneja automáticamente en middleware
  };

  return (
    <div className="step-2-container">
      <h2>Select Processor Brand</h2>
      <button onClick={() => handleBrandSelect('NovaStar')}>
        NovaStar
      </button>
      <button onClick={() => handleBrandSelect('Brompton')}>
        Brompton
      </button>
    </div>
  );
};
```

```typescript
// frontend/src/components/wizard/Step3ApplicationSelection.tsx
import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { applicationToggled } from '../../store/processorSlice';

export const Step3ApplicationSelection: React.FC = () => {
  const dispatch = useAppDispatch();
  const { selectedApplications } = useAppSelector(state => state.processor);

  const availableApps = ['Broadcast', 'Rental', 'Advertising', 'Sports'];

  const handleToggle = (app: string) => {
    dispatch(applicationToggled(app));
  };

  return (
    <div className="step-3-container">
      <h2>Select Applications</h2>
      {availableApps.map(app => (
        <label key={app}>
          <input
            type="checkbox"
            checked={selectedApplications.includes(app)}
            onChange={() => handleToggle(app)}
          />
          {app}
        </label>
      ))}
    </div>
  );
};
```

```typescript
// frontend/src/components/wizard/Step6Results.tsx
import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { useCalculateSolutionsQuery } from '../../services/processorApi';
import { solutionSelected, sendResults } from '../../store/processorSlice';

export const Step6Results: React.FC = () => {
  const dispatch = useAppDispatch();
  const processorState = useAppSelector(state => state.processor);
  const { data: solutions, isLoading } = useCalculateSolutionsQuery(processorState);

  if (isLoading) return <div>Calculating...</div>;

  return (
    <div className="step-6-container">
      <h2>Recommended Solutions</h2>
      {solutions?.map((solution, index) => (
        <div
          key={index}
          className={`solution-card ${processorState.selectedSolutionIndex === index ? 'selected' : ''}`}
          onClick={() => dispatch(solutionSelected(index))}
        >
          <h3>{solution.processors[0].name}</h3>
          <p>Input Cards: {solution.inputCards.map(c => c.name).join(', ')}</p>
          <p>Output Cards: {solution.outputCards.map(c => c.name).join(', ')}</p>
          <p className="cost">${solution.totalCost}</p>
        </div>
      ))}

      <UserInfoForm
        onSubmit={(userData) => {
          dispatch(sendResults({
            solution: solutions![processorState.selectedSolutionIndex],
            userData,
          }));
        }}
      />
    </div>
  );
};
```

### FASE 9: RTK Query - API Calls

Usar RTK Query para simplificar llamadas HTTP:

```typescript
// frontend/src/services/processorApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  CalculationRequestDto,
  ConfigurationSolutionDto,
  ProcessorDto,
  ReceivingCardDto,
} from "../types";

export const processorApi = createApi({
  reducerPath: "processorApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000/api" }),
  endpoints: (builder) => ({
    // GET: Procesadores por marca
    getProcessors: builder.query<ProcessorDto[], string>({
      query: (brand) => `/processor/processors/${brand}`,
    }),

    // GET: Tarjetas de entrada
    getInputCards: builder.query<ReceivingCardDto[], void>({
      query: () => "/processor/receiving-cards/input",
    }),

    // GET: Tarjetas de salida
    getOutputCards: builder.query<ReceivingCardDto[], void>({
      query: () => "/processor/receiving-cards/output",
    }),

    // POST: CÁLCULO CRÍTICO
    calculateSolutions: builder.mutation<
      ConfigurationSolutionDto[],
      CalculationRequestDto
    >({
      query: (request) => ({
        url: "/processor/calculate",
        method: "POST",
        body: request,
      }),
    }),

    // POST: Enviar resultados
    sendResults: builder.mutation<
      void,
      { solution: ConfigurationSolutionDto; userData: any }
    >({
      query: (request) => ({
        url: "/processor/send-results",
        method: "POST",
        body: request,
      }),
    }),
  }),
});

export const {
  useGetProcessorsQuery,
  useGetInputCardsQuery,
  useGetOutputCardsQuery,
  useCalculateSolutionsMutation,
  useSendResultsMutation,
} = processorApi;
```

### FASE 10: Middleware Redux - Automatización de Flujo

```typescript
// frontend/src/store/middleware.ts
import { Middleware } from "redux";
import { RootState } from "./store";
import {
  brandSelected,
  stepChanged,
  calculationStarted,
  calculationSuccess,
  calculationError,
} from "./processorSlice";
import { processorApi } from "../services/processorApi";

/**
 * Middleware que automatiza el flujo del wizard
 * Equivalente a los "auto-avance" en ProcessorBloc
 */
export const processorMiddleware: Middleware<{}, RootState> =
  (store) => (next) => (action) => {
    const result = next(action);
    const state = store.getState();

    // Al seleccionar marca, auto-avanzar a paso 3 y cargar procesadores
    if (brandSelected.match(action)) {
      store.dispatch(stepChanged(3));
      store.dispatch(
        processorApi.endpoints.getProcessors.initiate(action.payload),
      );
    }

    // Al seleccionar output type, auto-calcular soluciones
    if (outputTypeSelected.match(action)) {
      store.dispatch(calculationStarted());
      // Llamar a calculateSolutions mutation
      const { processor } = state;
      // ... dispatch mutation con todos los parámetros
    }

    return result;
  };
```

### FASE 11: Testing

```typescript
// backend/test/processor.service.spec.ts
import { Test, TestingModule } from "@nestjs/testing";
import { ProcessorService } from "../src/processor/processor.service";
import { ProcessorCalculationService } from "../src/processor/services/processor-calculation.service";

describe("ProcessorService", () => {
  let service: ProcessorService;
  let calculationService: ProcessorCalculationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProcessorService, ProcessorCalculationService],
    }).compile();

    service = module.get<ProcessorService>(ProcessorService);
    calculationService = module.get<ProcessorCalculationService>(
      ProcessorCalculationService,
    );
  });

  describe("calculateRecommendedSolutions", () => {
    it("should return top 5 solutions sorted by cost", async () => {
      const request = {
        screenData: {
          width: 1920,
          height: 1080,
          physicalWidth: 10,
          physicalHeight: 5,
        },
        selectedBrand: "Brompton",
        selectedApplications: ["Broadcast"],
        selectedConnectors: {},
        selectedMainInputType: "HDMI",
        selectedAuxiliaryInputs: {},
        selectedOutputType: "RJ45",
        selectedAuxiliaryOutputs: {},
      };

      const solutions = await service.calculateRecommendedSolutions(request);

      expect(solutions).toBeDefined();
      expect(solutions.length).toBeLessThanOrEqual(5);
      expect(solutions[0].totalCost).toBeLessThanOrEqual(
        solutions[1].totalCost,
      );
    });
  });
});
```

---

## INSTRUCCIONES FINALES

### Orden de Implementación Recomendado

1. **Backend primero:**
   - [ ] Crear estructura de carpetas NestJS
   - [ ] Implementar DTOs
   - [ ] Implementar ProcessorService
   - [ ] Implementar ProcessorCalculationService (CRÍTICO - copiar lógica exacta de Dart)
   - [ ] Implementar ProcessorController
   - [ ] Todos los endpoints disponibles
   - [ ] Escribir tests unitarios

2. **Frontend después:**
   - [ ] Configurar Redux store
   - [ ] Crear Redux slices
   - [ ] Implementar RTK Query hooks
   - [ ] Crear componentes de pasos (Step1-Step7)
   - [ ] Integrar wizard container
   - [ ] Agregar middleware automático de flujo
   - [ ] Estilos CSS/Tailwind

### Validaciones Críticas

- ✓ ProcessorCalculationService retorna exactamente la misma lógica de cálculo
- ✓ Todos los 7 pasos se implementan correctamente
- ✓ Estados y transiciones coinciden con BLoC original
- ✓ Modo dual-screen funciona igual
- ✓ Configuraciones Brompton vs NovaStar son distintas
- ✓ Email se envía correctamente

### Líneas Base de Código Esperadas

- **Backend NestJS:** ~800-1000 líneas de TypeScript
- **Frontend React:** ~1200-1500 líneas de TypeScript + JSX
- **Total:** ~2000-2500 líneas de código nuevo

---

## Conclusión

This prompt provides a **complete blueprint** for porting the Flutter Processor Wizard to NestJS + React. The key is to:

1. **Replicate the BLoC pattern** using Redux Toolkit (store for state, actions for events)
2. **Transfer the calculation logic exactly** - this is the most critical part
3. **Map components 1:1** from Flutter to React
4. **Use middleware** to replicate the "auto-advance" behavior of BLoC events
5. **Test thoroughly** to ensure identical behavior

The architecture will be cleaner and more web-native while maintaining 100% feature parity with the original Flutter implementation.
