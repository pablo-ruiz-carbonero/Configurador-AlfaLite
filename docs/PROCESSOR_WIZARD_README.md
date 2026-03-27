# 📱 Procesador Wizard - Documentación Completa

## 📋 Tabla de Contenidos

1. [Introducción](#introducción)
2. [Arquitectura General](#arquitectura-general)
3. [Componentes Principales](#componentes-principales)
4. [Flujo Lógico Detallado](#flujo-lógico-detallado)
5. [Lógica de Cálculo Avanzada](#lógica-de-cálculo-avanzada)
6. [Implementación de Pasos](#implementación-de-pasos)
7. [Sistema de Estados](#sistema-de-estados)
8. [Modo Dual-Pantalla](#modo-dual-pantalla)
9. [Servicios y APIs](#servicios-y-apis)
10. [Guía de Extensión](#guía-de-extensión)

---

## Introducción

### ¿Qué es el Processor Wizard?

El **Processor Wizard** es un módulo interactivo en Flutter que guía a usuarios a través de un proceso paso a paso para **seleccionar y configurar procesadores LED** basados en especificaciones de pantalla.

**Ejemplo de uso:**

- Un cliente tiene una pantalla LED de 10m × 5m con resolución 1920×1080
- Ingresa esto en el Configurador
- Abre el Processor Wizard
- Realiza una serie de selecciones (marca, aplicación, conexiones)
- El sistema recomienda 5 processadores optimizados
- Selecciona uno y envía la configuración por email

### Características Principales

```
✓ Soporte para 2 marcas: NovaStar y Brompton
✓ 6-7 pasos interactivos según marca
✓ Cálculo automático de puertos/tarjetas requeridas
✓ Comparación de pantallas múltiples (dual-screen)
✓ Recomendación de soluciones ordenadas por costo
✓ Configuración avanzada (frame rate, bit depth, failover)
✓ Envío automático por email de resultados
✓ Validación de compatibilidad entre componentes
```

---

## Arquitectura General

### Patrón BLoC (Business Logic Component)

```
┌─────────────────────────────────────────────────────┐
│                 PRESENTACIÓN (UI)                    │
│        - ProcessorWizard (contenedor principal)      │
│        - Pasos 1-7 (widgets independientes)          │
│        - Botones de navegación                       │
└────────────────────┬────────────────────────────────┘
                     │ emit() / add()
                     ▼
┌─────────────────────────────────────────────────────┐
│              BLOC (Orquestación)                     │
│        - ProcessorBloc (state manager)               │
│        - ProcessorEventHandlers (lógica eventos)     │
│        - 13+ manejadores de eventos                  │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │  SERVICIOS (Negocio)   │
        ├────────────────────────┤
        │ • ProcessorApiService  │ → fetch Processors
        │ • ReceivingCardAPI     │ → fetch Cards
        │ • ConverterApiService  │ → fetch Converters
        │ • CalculationService   │ → LÓGICA CRÍTICA
        │ • EmailClientService   │ → envío de emails
        └────────────────────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │   MODELOS (Datos)      │
        ├────────────────────────┤
        │ • Processor            │
        │ • ReceivingCard        │
        │ • ConfigurationSolution│
        │ • Converter            │
        │ • BromptonConfig       │
        │ • NovaStarConfig       │
        └────────────────────────┘
```

### Stack Tecnológico

- **Lenguaje:** Dart
- **Framework UI:** Flutter
- **State Management:** BLoC (bloc package)
- **Patrón:** Clean Architecture
- **Base de datos:** API REST
- **Comunicación:** HTTP (Dio/Http package)

---

## Componentes Principales

### 1. **ProcessorBloc** - Orquestador Central

**Archivo:** `lib/modules/processor/blocs/processor_bloc.dart`

**Responsabilidad:** Punto único de verdad para el estado del wizard

```dart
class ProcessorBloc extends Bloc<ProcessorEvent, ProcessorState> {
  // ❌ CONSTRUCTOR CLÁSICO (pantalla única)
  ProcessorBloc(
    ConfigurationResult result,    // Datos de pantalla (resolución, dimensión)
    Product product,               // Producto LED configurado
  )

  // ❌ CONSTRUCTOR DUAL-SCREEN (comparación)
  ProcessorBloc.dualScreen({
    required ConfigurationResult result1,
    required Product product1,
    required ConfigurationResult result2,
    required Product product2,
  })
}
```

**¿Qué hace ProcessorBloc?**

1. **Inicializa el estado** con valores por defecto
2. **Registra manejadores de eventos** para ~13 tipos de eventos
3. **Mantiene estado inmutable** usando `copyWith()`
4. **Coordina con servicios** para obtener datos
5. **Gestiona transiciones de estado** reaccionando a eventos
6. **Soporta modo dual** para comparar 2 pantallas

**Eventos que maneja:**

- `ProcessorStepChanged(2)` → va a paso 2
- `BrandSelected('Brompton')` → carga procesadores Brompton
- `ApplicationToggled('Broadcast')` → agrega/quita aplicación
- `CalculationRun()` → dispara cálculo de soluciones
- ...13 más (ver tabla de eventos)

---

### 2. **ProcessorState** - Modelo de Estado

**Archivo:** `lib/modules/processor/blocs/processor_states.dart`

**Responsabilidad:** Define campos que representan "qué conocemos en este momento"

```dart
class ProcessorState extends Equatable {
  // 📍 NAVEGACIÓN
  final int currentStep;                // 1-7: paso actual del wizard

  // 📍 DATOS DE PANTALLA
  final ConfigurationResult? result;    // Resolución, dims físicas, píxeles
  final Product? product;               // El producto LED elegido

  // 📍 SELECCIONES DEL USUARIO
  final String? selectedBrand;          // 'NovaStar' o 'Brompton'
  final List<String> selectedApplications; // ['Broadcast', 'Advertising']
  final Map<String, int> selectedConnectors; // {'HDMI': 4, 'DP': 2}

  // 📍 ENTRADA (Inputs)
  final String? selectedMainInputType;  // 'HDMI', 'DP', 'Fiber'
  final Map<String, int> selectedAuxiliaryInputs; // {'ScalerInput': 1}

  // 📍 SALIDA (Outputs)
  final String? selectedOutputType;     // 'RJ45' o 'OpticalFiber'
  final Map<String, int> selectedAuxiliaryOutputs; // {'Backup': 2}

  // 📍 RESULTADOS DE CÁLCULO
  final List<ConfigurationSolution>? recommendedSolutions; // Top 5 soluciones
  final int selectedSolutionIndex;      // Cuál fue seleccionada

  // 📍 TARJETAS DISPONIBLES
  final List<ReceivingCard> selectedInputCards;
  final List<ReceivingCard> selectedOutputCards;

  // 📍 CONFIGURACIÓN ESPECÍFICA DE MARCA
  final BromptonConfiguration? bromptonConfig; // { frameRate: 60, ... }
  final NovaStarConfiguration? novaStarConfig;

  // 📍 ESTADO DE CARGA
  final ProcessorStatus status;         // loading, success, failure
  final String? errorMessage;

  // 📍 MODO DUAL-SCREEN
  final bool isDualScreenMode;
  final int currentScreenTab;           // 1 o 2
  final int currentStep2;               // Paso para pantalla 2
  final ConfigurationResult? result2;
  final Product? product2;
  final String? selectedBrand2;
  // ... (duplicados para pantalla 2)
}

enum ProcessorStatus { initial, loading, success, failure }
```

**¿Por qué este estado es importante?**

✓ Cada campo es observable → UI se redibuja si cambia
✓ Inmutabilidad → sin bugs de mutación
✓ Serializabilidad → fácil guardar/restaurar
✓ Pruebas → fácil mockear para tests

---

### 3. **ProcessorEventHandlers** - Lógica de Eventos

**Archivo:** `lib/modules/processor/blocs/processor_event_handlers.dart`

**Responsabilidad:** Implementar la lógica cuando ocurre cada evento

#### Ejemplo: Evento `BrandSelected`

```dart
// Cuando usuario hace click en "Brompton"
Future<void> onBrandSelected(
  BrandSelected event,
  Emitter<ProcessorState> emit,
) async {
  try {
    // 1️⃣ Cambiar estado a LOADING
    emit(state.copyWith(status: ProcessorStatus.loading));

    // 2️⃣ Llamar API para obtener procesadores de esa marca
    final processors = await _processorApiService.getProcessors(event.brand);

    // 3️⃣ Guardar marca seleccionada
    // 4️⃣ Si es Brompton, inicializar BromptonConfiguration
    // 5️⃣ Cambiar estado a SUCCESS y guardar procesadores
    emit(state.copyWith(
      selectedBrand: event.brand,
      bromptonConfig: event.brand == 'Brompton' ? BromptonConfiguration() : null,
      recommendedProcessors: processors,
      status: ProcessorStatus.success,
    ));

    // 6️⃣ Auto-avanzar a paso 3 (selección de aplicaciones)
    // (dispara ProcessorStepChanged(3))
  } catch (e) {
    // ❌ En caso de error
    emit(state.copyWith(
      status: ProcessorStatus.failure,
      errorMessage: e.toString(),
    ));
  }
}
```

#### Ejemplo: Evento `CalculationRun` (EL MÁS COMPLEJO)

```dart
// Cuando usuario hace click en "Next" en paso 5
Future<void> onCalculationRun(
  CalculationRun event,
  Emitter<ProcessorState> emit,
) async {
  try {
    emit(state.copyWith(status: ProcessorStatus.loading));

    // 1️⃣ Obtener todos los datos necesarios
    final solutions = await _processorCalculationService.getRecommendedSolutions(
      screenData: state.result!,
      availableProcessors: state.recommendedProcessors!,
      availableInputCards: state.availableInputCards!,
      availableOutputCards: state.availableOutputCards!,
      selectedApplications: state.selectedApplications,
      selectedConnectors: state.selectedConnectors,
      selectedOutputType: state.selectedOutputType!,
      selectedAuxiliaryOutputs: state.selectedAuxiliaryOutputs,
      bromptonConfig: state.bromptonConfig,
      novaStarConfig: state.novaStarConfig,
    );

    // 2️⃣ Si hay soluciones, guardar y avanzar a paso 6
    if (solutions.isNotEmpty) {
      final nextStep = state.selectedBrand == 'Brompton' ? 6 : 6;
      emit(state.copyWith(
        recommendedSolutions: solutions,
        selectedSolutionIndex: 0,
        currentStep: nextStep,
        status: ProcessorStatus.success,
      ));
    } else {
      // ❌ Sin soluciones válidas
      emit(state.copyWith(
        status: ProcessorStatus.failure,
        errorMessage: 'No suitable processor configuration found',
      ));
    }
  } catch (e) {
    emit(state.copyWith(
      status: ProcessorStatus.failure,
      errorMessage: e.toString(),
    ));
  }
}
```

---

### 4. **ProcessorCalculationService** - Lógica Matemática

**Archivo:** `lib/modules/processor/services/calculation/processor_calculation_service.dart`

**Responsabilidad:** Algoritmo de recomendación e cálculos técnicos complejos

#### Método Principal: `getRecommendedSolutions`

```dart
List<ConfigurationSolution> getRecommendedSolutions({
  required ConfigurationResult screenData,      // 1920x1080, 10m x 5m
  required List<Processor> availableProcessors, // [NX-1, NX-2, NX-4, ...]
  required List<ReceivingCard> availableInputCards,
  required List<ReceivingCard> availableOutputCards,
  required List<String> selectedApplications,   // ['Rental']
  required Map<String, int> selectedConnectors, // {}
  required String selectedOutputType,           // 'RJ45'
  required Map<String, int> selectedAuxiliaryOutputs,
  required List<Converter> availableConverters,
  BromptonConfiguration? bromptonConfig,
  NovaStarConfiguration? novaStarConfig,
}) {
  // PASO 1: CALCULAR REQUISITOS
  final int totalPixels = screenData.width * screenData.height; // 1920*1080 = 2M
  final int requiredOutputPorts = _calculateOutputPorts(
    totalPixels,
    selectedOutputType,
  ); // RJ45: 16 puertos (1920×1080 = 2M pixels)

  // PASO 2: FILTRAR PROCESADORES DISPONIBLES
  List<Processor> filtered = availableProcessors
    .where((p) => p.brand == selectedBrand)  // Solo marca seleccionada
    .where((p) => _canFit(p, totalPixels))   // ¿Cabe la resolución?
    .where((p) => _supportsApplications(p, selectedApplications)) // ¿Apps?
    .toList();

  // PASO 3: PARA CADA PROCESADOR, CREAR SOLUCIONES
  final List<ConfigurationSolution> allSolutions = [];
  for (final processor in filtered) {
    // 3A. Obtener tarjetas de entrada requeridas
    final inputCards = _getInputCardsCombinations(
      processor,
      selectedMainInputType,
      selectedAuxiliaryInputs,
    );

    // 3B. Obtener tarjetas de salida requeridas
    final outputCards = _getOutputCardsCombinations(
      processor,
      selectedOutputType,
      requiredOutputPorts,
    );

    // 3C. Validar que el procesador tiene espacio para tarjetas
    if (!_hasEnoughSlots(processor, inputCards, outputCards)) {
      continue; // Saltar procesador, no cabe
    }

    // 3D. Obtener convertidores necesarios
    final converters = _selectConverters(
      inputCards,
      outputCards,
      availableConverters,
    );

    // 3E. Calcular costo total
    final totalCost =
      processor.price +
      inputCards.fold(0, (sum, c) => sum + c.price) +
      outputCards.fold(0, (sum, c) => sum + c.price) +
      converters.fold(0, (sum, c) => sum + c.price);

    // 3F. Crear solución
    allSolutions.add(ConfigurationSolution(
      id: '${processor.id}_${inputCards.hashCode}_${outputCards.hashCode}',
      processors: [processor],
      inputCards: inputCards,
      outputCards: outputCards,
      converters: converters,
      totalCost: totalCost,
      solutionType: 'single_processor',
    ));
  }

  // PASO 4: ORDENAR POR COSTO Y RETORNAR TOP 5
  allSolutions.sort((a, b) => a.totalCost.compareTo(b.totalCost));
  return allSolutions.take(5).toList();
}
```

#### Métodos de Cálculo Específicos

**1. Calcular Puertos de Salida RJ45**

```dart
int calculateOutputPorts(
  int totalPixels,
  String outputType,
) {
  // Cada puerto RJ45 puede manejar ~128k pixeles típicamente
  const int pixelsPerRj45Port = 128000;
  const int pixelsPerFiberPort = 256000; // Fiber: más ancho

  if (outputType == 'RJ45') {
    return (totalPixels / pixelsPerRj45Port).ceil();
    // Ejemplo: 2M pixels / 128k = 16 puertos
  } else if (outputType == 'OpticalFiber') {
    return (totalPixels / pixelsPerFiberPort).ceil();
    // Ejemplo: 2M pixels / 256k = 8 puertos
  }
  return 0;
}
```

**2. Calcular Entrada Principal**

```dart
int calculateRequiredMainInputQuantity(
  ConfigurationResult screenData,
  String selectedInputType,
) {
  // Lógica según tipo de entrada
  switch (selectedInputType) {
    case 'HDMI':
      // HDMI puede manejar hasta 4K@60Hz (8.3 Gbps)
      // Para pantallas grandes, típicamente 1 HDMI
      return 1;

    case 'DisplayPort':
      // DP 1.4 soporta hasta 8K
      return 1;

    case 'DVI':
      // DVI: más limitado, puede necesitar 2 para 4K
      return screenData.isUltraHD ? 2 : 1;

    case 'OpticalFiber':
      // 1 fiber generalmente es suficiente
      return 1;

    default:
      return 1;
  }
}
```

**3. Validar Compatibilidad**

```dart
bool _canFit(Processor processor, int totalPixels) {
  // Cada procesador tiene límite máximo
  return totalPixels <= processor.maxPixels;
  // Ejemplo: NX-4 soporta hasta 4M pixels
}

bool _supportsApplications(
  Processor processor,
  List<String> selectedApplications,
) {
  // Validar que procesador soporta todas las aplicaciones
  return selectedApplications.every(
    (app) => processor.applications.contains(app),
  );
}
```

---

## Flujo Lógico Detallado

### Flujo Paso a Paso Completo

```
┌─────────────────────────────────────────────────────────────────────┐
│                    INICIO DEL WIZARD                                │
│           Usuario hace click en "Processor Wizard"                   │
│          (PassingResult(1920x1080, 10m×5m, 2M pixels)               │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │ ProcessorBloc   │
                    │ currentStep: 1  │
                    │ status: initial │
                    └────────┬────────┘
                             │
    ┌────────────────────────┴────────────────────────┐
    │                                                  │
    ▼                                                  ▼
┌──────────────┐                          ┌──────────────────────┐
│ PASO 1       │                          │ PASO 2               │
│ Confirmación │                          │ Selección de Marca   │
│ ────────────│                          │ ────────────────────│
│ Muestra:    │                          │ Muestra:            │
│ • 1920×1080 │◄─ User: Next ────────────│ • Botones:          │
│ • 10m × 5m │                          │   - NovaStar        │
│             │                          │   - Brompton        │
└──────────────┘                          │                     │
                      ◄─────────────────│ User: selecciona... │
                                        │ [BrandSelected]     │
                                        └──────┬──────────────┘
                                               │
                                               │ 🔄 API CALL
                                               │ processorApi
                                               │ .getProcessors
                                               │ ('Brompton')
                                               │
                                    ┌──────────▼──────────────┐
                                    │ Recibe procesadores:    │
                                    │ [{                      │
                                    │   id: 'SX40',           │
                                    │   name: 'Brompton SX40',│
                                    │   maxPixels: 4M,        │
                                    │   ...                   │
                                    │ }, ...]                │
                                    └──────────┬──────────────┘
                                               │
                                               ▼
                                    ┌──────────────────────┐
                                    │ PASO 3               │
                                    │ Aplicaciones         │
                                    │ ────────────────────│
                                    │ Muestra checkbox:   │
                                    │ ☑ Broadcast        │
                                    │ ☐ Rental           │
                                    │ ☐ Advertising      │
                                    │ User: selecciona... │
                                    │ [ApplicationToggled]│
                                    └──────────┬──────────┘
                                               │
                                               ├─ Next
                                               │
                                               ▼
                                    ┌──────────────────────┐
                                    │ PASO 4               │
                                    │ Entrada (Inputs)     │
                                    │ ────────────────────│
                                    │ Input Principal:    │
                                    │ [Dropdown: HDMI ▼]  │
                                    │ Inputs Auxiliares:  │
                                    │ ScalerInput: [1]    │
                                    │ User: configura...  │
                                    │ [MainInputTypeSelected
                                    │  AuxiliaryInputTogg]│
                                    └──────────┬──────────┘
                                               │
                                               ├─ Next
                                               │
                                               ▼
                                    ┌──────────────────────┐
                                    │ PASO 5               │
                                    │ Salida (Outputs)     │
                                    │ ────────────────────│
                                    │ Output Principal:   │
                                    │ ◉ RJ45   ◯ Fiber   │
                                    │ Usuario elige: RJ45 │
                                    │ [OutputTypeSelected │
                                    │  AuxiliaryOutputTo] │
                                    └──────────┬──────────┘
                                               │
                                               ├─ Next
                                               │ [CalculationRun]
                                               │
                                               🔄 CÁLCULO CRÍTICO
                                    ┌──────────────────────────────┐
                                    │ ProcessorCalculationService  │
                                    │ .getRecommendedSolutions()   │
                                    │                              │
                                    │ 1. totalPixels: 2M           │
                                    │ 2. requiredRJ45: 16 puertos  │
                                    │ 3. Filter processors by app  │
                                    │ 4. For each processor:       │
                                    │    - Get input cards         │
                                    │    - Get output cards (16x)  │
                                    │    - Check slots available   │
                                    │    - Get converters          │
                                    │    - Calculate total cost    │
                                    │ 5. Sort by cost             │
                                    │ 6. Return top 5             │
                                    │                              │
                                    │ Resultados:                  │
                                    │ [{                           │
                                    │   processor: SX40,           │
                                    │   inputCards: [...],        │
                                    │   outputCards: [16x],        │
                                    │   totalCost: $45000,         │
                                    │ }, ...]                      │
                                    └──────────┬──────────────────┘
                                               │
                                    ┌──────────▼──────────┐
                                    │ PASO 6A             │
                                    │ Config Específica   │
                                    │ (Si es Brompton)    │
                                    │ ────────────────   │
                                    │ Frame Rate:         │
                                    │ [60 ▼]              │
                                    │ Bit Depth: [8 ▼]    │
                                    │ ☑ ULL               │
                                    │ ☑ Failover          │
                                    │ User: configura...  │
                                    │ [BromptonConfigUp]  │
                                    └──────────┬──────────┘
                                               │
                                               ├─ Next
                                               │
                                               ▼
                            ┌──────────────────────────────┐
                            │ PASO 7                       │
                            │ Resultados Finales           │
                            │ ─────────────────────────   │
                            │ Muestra top 5 soluciones:   │
                            │                              │
                            │ 1. SX40 + 2x Input + 16x RJ45
                            │    Costo: $45,000            │
                            │                              │
                            │ 2. SX20 + 1x Input + 8x RJ45
                            │    Costo: $28,000            │
                            │                              │
                            │ ...                          │
                            │                              │
                            │ [Formulario Usuario]         │
                            │ Nombre: [_________]          │
                            │ Email: [_________]           │
                            │ Empresa: [_________]         │
                            │                              │
                            │ [ENVIAR POR EMAIL]           │
                            │ ────────────────────────▼────│
                            │ EmailClientService.send()    │
                            └──────────────────────────────┘
                                               │
                                               ✓ COMPLETADO
```

---

## Lógica de Cálculo Avanzada

### El Corazón del Sistema: `getRecommendedSolutions()`

Este método es el **más complejo del wizard** y es donde ocurre la "magia" de recomendación.

#### Paso 1: Calcular Requisitos de Infraestructura

```dart
// ¿Cuántos píxeles tenemos?
int totalPixels = screenData.width * screenData.height;
// Ejemplo: 1920 × 1080 = 2,073,600 píxeles

// ¿Cuántos puertos RJ45 necesitamos?
// Teoría: Cada puerto RJ45 puede enviar ~128k píxeles @60Hz @8bit
int requiredRj45Ports = (totalPixels / 128000).ceil();
// 2,073,600 / 128,000 = 16.2 → 17 puertos RJ45

// ¿Cuántas tarjetas de salida son necesarias?
// Típicamente: 1 tarjeta RJ45 = 16 puertos
// Entonces: 17 / 16 = 2 tarjetas (con 1 puerto extra)
```

#### Paso 2: Filtrar Procesadores Inviables

```dart
// FILTRO 1: Marca
List<Processor> viable = availableProcessors
  .where((p) => p.brand == state.selectedBrand) // Solo Brompton
  .toList();

// FILTRO 2: Capacidad de píxeles
viable = viable
  .where((p) => totalPixels <= (p.maxPixels ?? double.infinity))
  .toList();
// Mantiene solo procesadores que pueden manejar 2M pixels
// Elimina: SX5 (500k max), SX10 (1M max)
// Mantiene: SX40 (4M max), SX80 (8M max)

// FILTRO 3: Aplicaciones soportadas
viable = viable
  .where((p) => selectedApplications.every(
    (app) => p.applications.contains(app)
  ))
  .toList();
// User seleccionó: ['Broadcast', 'Sports']
// Mantiene solo procesadores que soportan ambas

// FILTRO 4: Conectores de entrada
viable = viable
  .where((p) => p.connectorsInput?.keys.contains(mainInputType) ?? true)
  .toList();
// Si user seleccionó HDMI, elimina procesadores sin HDMI
```

#### Paso 3: Generar Combinaciones de Soluciones

```dart
List<ConfigurationSolution> allSolutions = [];

// Para cada procesador que pasó los filtros
for (final processor in viable) {

  // 3.1: TARJETAS DE ENTRADA
  // Determinar cuántas tarjetas de entrada se necesitan
  List<ReceivingCard> inputCards = [];

  // Buscamos tarjetas que soporten el tipo de entrada (HDMI)
  final compatibleInputCards = availableInputCards
    .where((card) => card.supportsConnector('HDMI'))
    .toList();

  // ¿Cuántas tarjetas necesitamos?
  // Cada tarjeta HDMI típicamente tiene 2 puertos
  // Si necesitamos 1 entrada, necesitamos 1 tarjeta
  final inputCardsNeeded = _calculateInputCardsNeeded(
    selectedMainInputType,
    processor,
  ); // Retorna 1 tarjeta HDMI

  inputCards = compatibleInputCards.take(inputCardsNeeded).toList();


  // 3.2: TARJETAS DE SALIDA
  // Necesitábamos 17 puertos RJ45, que requieren 2 tarjetas
  List<ReceivingCard> outputCards = [];

  final compatibleOutputCards = availableOutputCards
    .where((card) => card.interfaceType == 'RJ45')
    .toList();

  // Llenar tarjetas hasta alcanzar 17 puertos
  int portsNeeded = requiredRj45Ports;
  for (final card in compatibleOutputCards) {
    if (portsNeeded <= 0) break;
    outputCards.add(card);
    portsNeeded -= card.connectorsOutput['RJ45'] ?? 0;
  }

  // Ahora outputCards tiene 2 tarjetas: [16 puertos, 1 puerto]


  // 3.3: VALIDAR ESPACIO EN PROCESADOR
  // El procesador SX40 tiene N slots para tarjetas
  // Necesitamos: 1 input + 2 output = 3 slots
  int slotsNeeded = inputCards.length + outputCards.length;

  if (slotsNeeded > processor.maxInputCards + processor.maxOutputCards) {
    continue; // ❌ No cabe, saltar
  }


  // 3.4: CONVERTIDORES
  // Si entrada es HDMI pero queremos convertir a SDI
  List<Converter> converters = [];
  if (needsConversion(mainInputType, outputCards)) {
    converters = availableConverters
      .where((c) => c.supportsConversion('HDMI', 'RJ45'))
      .take(1)
      .toList();
  }


  // 3.5: CALCULAR COSTO
  int totalCost = processor.price;
  totalCost += inputCards.fold(0, (sum, card) => sum + (card.price ?? 0));
  totalCost += outputCards.fold(0, (sum, card) => sum + (card.price ?? 0));
  totalCost += converters.fold(0, (sum, c) => sum + (c.price ?? 0));

  // Ejemplo: $8000 + $500 + ($1500 × 2) + $200 = $11,700


  // 3.6: CREAR SOLUCIÓN
  allSolutions.add(ConfigurationSolution(
    id: '${processor.id}_sol_${allSolutions.length}',
    processors: [processor],
    inputCards: inputCards,
    outputCards: outputCards,
    converters: converters,
    totalCost: totalCost,
    solutionType: 'single_processor',
    metadata: {
      'pixelCapacity': processor.maxPixels,
      'processorSlots': processor.maxInputCards + processor.maxOutputCards,
      'usedSlots': slotsNeeded,
    },
  ));
}
```

#### Paso 4: Ordenar y Retornar

```dart
// Ordenar por costo (más barato primero)
allSolutions.sort((a, b) => a.totalCost.compareTo(b.totalCost));

// Retornar solo top 5 para no abrumar usuario
return allSolutions.take(5).toList();

/* Ejemplo de resultado:
[
  {
    processor: "Brompton SX40",
    inputCards: [HDMI Card 1],
    outputCards: [RJ45 Card 1, RJ45 Card 2],
    totalCost: $11,700,   ✓← OPCIÓN MÁS BARATA
  },
  {
    processor: "Brompton SX40",
    inputCards: [HDMI Card 2],
    outputCards: [RJ45 Card 3, RJ45 Card 4],
    totalCost: $12,000,
  },
  {
    processor: "Brompton SX80",
    inputCards: [DP Card 1],
    outputCards: [RJ45 Card 1, ...],
    totalCost: $19,500,
  },
  ...
]
*/
```

---

## Implementación de Pasos

### Estructura General de un Paso

Todos los pasos siguen un patrón similar:

```dart
class StepXName extends StatelessWidget {
  const StepXName({super.key});

  @override
  Widget build(BuildContext context) {
    // BlocBuilder escucha cambios de ProcessorBloc
    return BlocBuilder<ProcessorBloc, ProcessorState>(
      builder: (context, state) {
        // Mostrar contenido dinamico basado en state
        return _buildContent(context, state);
      },
    );
  }

  Widget _buildContent(BuildContext context, ProcessorState state) {
    return Column(
      children: [
        // Encabezado
        _buildHeader(context),

        // Contenido específico del paso
        _buildWizardContent(context, state),
      ],
    );
  }

  void _handleUserAction(BuildContext context) {
    // Disparar evento en el bloc
    context.read<ProcessorBloc>().add(
      EventoEspecifico(parametro: value),
    );
  }
}
```

### Descripción de Cada Paso

#### **PASO 1: step_1_confirmation.dart**

- **Propósito:** Mostrar datos confirmados de la pantalla
- **Datos mostrados:**
  - Resolución: `state.result!.width × state.result!.height`
  - Dimensiones: `state.product!.width m × state.product!.height m`
  - Total de tiles
- **Interactividad:** Solo lectura (botón "Next" para continuar)
- **Evento:** `ProcessorStepChanged(2)`

#### **PASO 2: step_2_brand_selection.dart**

```dart
// Renderizar botones para cada marca disponible
['NovaStar', 'Brompton'].forEach((brand) {
  ElevatedButton(
    onPressed: () {
      // Disparar evento de selección
      context.read<ProcessorBloc>().add(BrandSelected(brand));
    },
    child: Text(brand),
  );
});

// Validación Brompton especial
if (brand == 'Brompton' && !isCompatible(state.product)) {
  showDialog(
    context: context,
    builder: (_) => AlertDialog(
      title: Text('Compatibility Issue'),
      content: Text('This product is not compatible with Brompton'),
    ),
  );
}
```

#### **PASO 3: step_3_application_selection.dart**

```dart
// Mostrar checkboxes para cada aplicación disponible
// Cargar desde: state.recommendedProcessors[0].applications
ListView.builder(
  itemCount: availableApplications.length,
  itemBuilder: (context, index) {
    final app = availableApplications[index];
    final isSelected = state.selectedApplications.contains(app);

    return CheckboxListTile(
      title: Text(app),
      value: isSelected,
      onChanged: (_) {
        // Toggle de aplicación
        context.read<ProcessorBloc>().add(
          ApplicationToggled(app),
        );
      },
    );
  },
)
```

#### **PASO 4: step_4_input_connector_selection.dart**

```dart
// Sección 1: Seleccionar tipo de entrada principal
DropdownButton<String>(
  value: state.selectedMainInputType,
  items: ['HDMI', 'DisplayPort', 'DVI', 'SDI'].map((type) {
    return DropdownMenuItem(
      value: type,
      child: Text(type),
    );
  }).toList(),
  onChanged: (selectedType) {
    context.read<ProcessorBloc>().add(
      MainInputTypeSelected(selectedType!),
    );
  },
)

// Sección 2: Configurar entradas auxiliares
// Mostrar sliders o input fields para cantidad
state.availableInputCards.forEach((card) {
  Slider(
    value: state.selectedAuxiliaryInputs[card.name]?.toDouble() ?? 0,
    max: 4,
    onChanged: (value) {
      context.read<ProcessorBloc>().add(
        AuxiliaryInputToggled(card.name, value.toInt()),
      );
    },
  );
});
```

#### **PASO 5: step_5_output_connector_selection.dart**

```dart
// Sección 1: Seleccionar tipo de salida
Row(
  children: [
    Radio<String>(
      value: 'RJ45',
      groupValue: state.selectedOutputType,
      onChanged: (value) {
        context.read<ProcessorBloc>().add(
          OutputTypeSelected(value!),
        );
      },
    ),
    Text('RJ45'),
    Radio<String>(
      value: 'OpticalFiber',
      groupValue: state.selectedOutputType,
      onChanged: (value) {
        context.read<ProcessorBloc>().add(
          OutputTypeSelected(value!),
        );
      },
    ),
    Text('Optical Fiber'),
  ],
);

// Sección 2: Mostrar tarjetas disponibles (cargadas automáticamente)
// Cuando user selecciona RJ45, API carga tarjetas RJ45
state.availableOutputCards.forEach((card) {
  ListTile(
    title: Text(card.name),
    subtitle: Text('${card.connectorsOutput["RJ45"]} ports'),
  );
});
```

#### **PASO 6A: step_6_brompton_configuration.dart (Brompton)**

```dart
// Mostrar controles para cada parámetro
StatefulWidget {
  int _frameRate = 60;
  int _bitDepth = 8;
  bool _ull = false;
  bool _failover = false;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Frame Rate Selector
        DropdownButton(
          value: _frameRate,
          items: [60, 120, 240].map((rate) =>
            DropdownMenuItem(value: rate, child: Text('$rate Hz'))
          ).toList(),
          onChanged: (rate) => setState(() => _frameRate = rate),
        ),

        // Bit Depth Selector
        DropdownButton(
          value: _bitDepth,
          items: [8, 10, 12].map((depth) =>
            DropdownMenuItem(value: depth, child: Text('$depth bits'))
          ).toList(),
          onChanged: (depth) => setState(() => _bitDepth = depth),
        ),

        // Toggles
        SwitchListTile(
          title: Text('Ultra-Low Latency (ULL)'),
          value: _ull,
          onChanged: (value) => setState(() => _ull = value),
        ),

        SwitchListTile(
          title: Text('Failover'),
          value: _failover,
          onChanged: (value) => setState(() => _failover = value),
        ),
      ],
    );
  }

  // En botón Next:
  context.read<ProcessorBloc>().add(
    BromptonConfigurationUpdated(BromptonConfiguration(
      frameRate: _frameRate,
      bitDepth: _bitDepth,
      ull: _ull,
      failover: _failover,
    )),
  );
}
```

#### **PASO 6B: step_6_results.dart (NovaStar) / PASO 7: step_7_brompton_results.dart (Brompton)**

```dart
@override
Widget build(BuildContext context) {
  return BlocBuilder<ProcessorBloc, ProcessorState>(
    builder: (context, state) {

      // Mostrar estado de carga
      if (state.status == ProcessorStatus.loading) {
        return Center(child: CircularProgressIndicator());
      }

      // Mostrar error
      if (state.status == ProcessorStatus.failure) {
        return ErrorWidget(message: state.errorMessage);
      }

      // Mostrar soluciones
      return Column(
        children: [
          Expanded(
            child: ListView.builder(
              itemCount: state.recommendedSolutions!.length,
              itemBuilder: (context, index) {
                final solution = state.recommendedSolutions![index];
                final isSelected = state.selectedSolutionIndex == index;

                return SolutionCard(
                  solution: solution,
                  isSelected: isSelected,
                  onTap: () {
                    context.read<ProcessorBloc>().add(
                      SolutionSelected(index),
                    );
                  },
                );
              },
            ),
          ),

          // Formulario de usuario
          UserInfoForm(
            onSubmit: (userData) {
              // Enviar por email
              _emailService.sendResults(
                solution: state.recommendedSolutions![state.selectedSolutionIndex],
                userData: userData,
              );
            },
          ),
        ],
      );
    },
  );
}
```

---

## Sistema de Estados

### Estados Posibles del Wizard

```dart
enum ProcessorStatus {
  initial,    // Inicial, no ha ocurrido nada
  loading,    // Calculando soluciones o cargando datos
  success,    // Completado exitosamente
  failure,    // Error ocurrió
}
```

### Estado en Diferentes Momentos

**Momento 1: Inicio**

```dart
ProcessorState(
  currentStep: 1,
  result: ConfigurationResult(1920, 1080, 10, 5),
  product: Product('Product Name'),
  selectedBrand: null,
  selectedApplications: [],
  status: ProcessorStatus.initial,
  recommendedProcessors: null,
  recommendedSolutions: null,
)
```

**Momento 2: Después de seleccionar marca**

```dart
ProcessorState(
  currentStep: 2,
  selectedBrand: 'Brompton',
  recommendedProcessors: [SX10{...}, SX20{...}, SX40{...}],
  bromptonConfig: BromptonConfiguration(),
  status: ProcessorStatus.success,
)
```

**Momento 3: Durante cálculo**

```dart
ProcessorState(
  currentStep: 5,
  selectedApplications: ['Broadcast'],
  selectedMainInputType: 'HDMI',
  selectedOutputType: 'RJ45',
  status: ProcessorStatus.loading,  // ← Muestra spinner
)
```

**Momento 4: Después del cálculo**

```dart
ProcessorState(
  currentStep: 6,
  recommendedSolutions: [
    ConfigurationSolution(
      processors: [SX40],
      inputCards: [...],
      outputCards: [...],
      totalCost: 11700,
    ),
    ...
  ],
  selectedSolutionIndex: 0,
  status: ProcessorStatus.success,
)
```

---

## Modo Dual-Pantalla

### ¿Qué es el Modo Dual-Screen?

Permite configurar 2 pantallas LED **simultáneamente** y comparar sus procesadores en paralelo.

```
┌─────────────────────────────┐
│     Processor Wizard         │
├─────────────────────────────┤
│ SCREEN 1    │    SCREEN 2    │  ← Tabs
├─────────────┼────────────────┤
│ Resolución: │ Resolución:    │
│ 1920×1080   │ 3840×2160      │
│             │                │
│ Brand:      │ Brand:         │
│ [Brompton]  │ [NovaStar]     │
│             │                │
│ App:        │ App:           │
│ ☑ Broadcast │ ☑ Rental       │
│             │                │
│ [Next ►]    │ [◄ Prev][Next ►│
└─────────────┴────────────────┘
```

### Implementación Técnica

**Archivo:** `lib/modules/processor/widgets/wizard/dual_screen_processor_wizard.dart`

```dart
class DualScreenProcessorWizard extends StatelessWidget {
  final ConfigurationResult result1;
  final Product product1;
  final ConfigurationResult result2;
  final Product product2;
  final ProcessorBloc processorBloc;

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<ProcessorBloc, ProcessorState>(
      builder: (context, state) {
        return Column(
          children: [
            // Tabs para seleccionar pantalla
            TabBar(
              tabs: [
                Tab(text: 'Screen 1 (${product1.width}×${product1.height})'),
                Tab(text: 'Screen 2 (${product2.width}×${product2.height})'),
              ],
              onTap: (index) {
                context.read<ProcessorBloc>().add(
                  ScreenTabChanged(index + 1), // 1 o 2
                );
              },
            ),

            // Stack muestra pantalla 1 o 2 según tab activo
            Expanded(
              child: IndexedStack(
                index: state.currentScreenTab - 1,
                children: [
                  _buildScreenContent(context, 1, state, result1, product1),
                  _buildScreenContent(context, 2, state, result2, product2),
                ],
              ),
            ),

            // Botones de navegación (compartidos)
            _buildNavigationButtons(context, state),
          ],
        );
      },
    );
  }
}
```

### Intercepción de Eventos - Dual Screen

El wizard debe distinguir entre eventos de Pantalla 1 y Pantalla 2:

```dart
// Cuando usuario en Screen 1 selecciona "Brompton"
// Genera: ScreenSpecificBrandSelected_1('Brompton')
//
// Cuando usuario en Screen 2 selecciona "NovaStar"
// Genera: ScreenSpecificBrandSelected_2('NovaStar')

// ProcessorBloc maneja ambos:
// on<ScreenSpecificBrandSelected_1>() → actualiza state.selectedBrand
// on<ScreenSpecificBrandSelected_2>() → actualiza state.selectedBrand2
```

### Estado Dual-Screen en ProcessorState

```dart
class ProcessorState {
  // ── PANTALLA 1 ──
  final ConfigurationResult? result;
  final Product? product;
  final String? selectedBrand;
  final List<String> selectedApplications;
  final String? selectedMainInputType;
  final String? selectedOutputType;

  // ── PANTALLA 2 ──
  final ConfigurationResult? result2;
  final Product? product2;
  final String? selectedBrand2;
  final List<String> selectedApplications2;
  final String? selectedMainInputType2;
  final String? selectedOutputType2;

  // ── CONTROL ──
  final bool isDualScreenMode;
  final int currentScreenTab;  // 1 o 2: cuál está visible
  final int currentStep;       // Paso común en ambas
}
```

---

## Servicios y APIs

### ProcessorApiService

```dart
class ProcessorApiService {
  final Dio _dio;

  // Obtener procesadores de una marca
  Future<List<Processor>> getProcessors(String brand) async {
    final response = await _dio.get(
      '$baseUrl/api/processors/$brand',
    );
    return (response.data as List)
      .map((p) => Processor.fromJson(p))
      .toList();
  }
}

// LLAMADAS API:
// GET /api/processors/Brompton
// GET /api/processors/NovaStar
```

### ReceivingCardApiService

```dart
class ReceivingCardApiService {
  Future<List<ReceivingCard>> getInputCards() async {
    final response = await _dio.get('$baseUrl/api/receiving-cards/input');
    return (response.data as List)
      .map((c) => ReceivingCard.fromJson(c))
      .toList();
  }

  Future<List<ReceivingCard>> getOutputCards() async {
    final response = await _dio.get('$baseUrl/api/receiving-cards/output');
    return (response.data as List)
      .map((c) => ReceivingCard.fromJson(c))
      .toList();
  }
}
```

### EmailClientService

```dart
class EmailClientService {
  Future<void> sendResults({
    required ConfigurationSolution solution,
    required UserData userData,
  }) async {
    // Construir email HTML
    final htmlBody = '''
      <h1>LED Screen Processor Configuration</h1>
      <p>Hello ${userData.name},</p>

      <h2>Recommended Solution</h2>
      <p>Processor: ${solution.processors[0].name}</p>
      <p>Input Cards: ${solution.inputCards.map((c) => c.name).join(', ')}</p>
      <p>Output Cards: ${solution.outputCards.map((c) => c.name).join(', ')}</p>
      <p><strong>Total Cost: \$${solution.totalCost}</strong></p>

      <p>Best regards,<br>Alfalite Team</p>
    ''';

    // Enviar via backend API
    await _dio.post('$baseUrl/api/email/send-configuration', data: {
      'to': userData.email,
      'subject': 'Your LED Processor Configuration',
      'html': htmlBody,
      'configuration': solution.toJson(),
    });
  }
}
```

---

## Guía de Extensión

### ¿Cómo Agregar un Nuevo Paso?

1. **Crear archivo del paso:**

```dart
// lib/modules/processor/widgets/steps/step_8_advanced_settings.dart

class Step8AdvancedSettings extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return BlocBuilder<ProcessorBloc, ProcessorState>(
      builder: (context, state) {
        return Column(
          children: [
            _buildHeader(context),
            _buildContent(context, state),
          ],
        );
      },
    );
  }
}
```

2. **Agregar eventos si es necesario:**

```dart
// En processor_events.dart
class AdvancedSettingChanged extends ProcessorEvent {
  final String setting;
  final dynamic value;

  const AdvancedSettingChanged(this.setting, this.value);

  @override
  List<Object> get props => [setting, value];
}
```

3. **Agregar manejador evento:**

```dart
// En processor_bloc.dart
on<AdvancedSettingChanged>(_onAdvancedSettingChanged);

// En processor_event_handlers.dart
Future<void> _onAdvancedSettingChanged(
  AdvancedSettingChanged event,
  Emitter<ProcessorState> emit,
) async {
  // Lógica aquí
}
```

4. **Agregar campo a ProcessorState:**

```dart
// En processor_states.dart
class ProcessorState extends Equatable {
  final Map<String, dynamic>? advancedSettings;

  // Actualizar copyWith()
}
```

5. **Registrar paso en ProcessorWizard:**

```dart
// En processor_wizard.dart
_getStepsForBrand(String? brand) {
  return [
    Step1Confirmation(),
    Step2BrandSelection(),
    Step3ApplicationSelection(),
    Step4InputConnectorSelection(),
    Step5OutputConnectorSelection(),
    if (brand == 'Brompton') ...[
      Step6BromptonConfiguration(),
      Step7BromptonResults(),
    ] else ...[
      Step6Results(),
    ],
    // ← NUEVO PASO AQUÍ
    Step8AdvancedSettings(),
  ];
}
```

### ¿Cómo Cambiar la Lógica de Cálculo?

1. **Modificar ProcessorCalculationService:**

```dart
List<ConfigurationSolution> getRecommendedSolutions({...}) {
  // Modificar algoritmo de filtrado
  // Cambiar criterios de ranking
  // Agregar new tipos de validación
}
```

2. **Agregar configuración nueva a BromptonConfiguration:**

```dart
class BromptonConfiguration {
  final int frameRate;
  final int bitDepth;
  final bool ull;
  final bool newSetting; // ← NUEVA
}
```

3. **Actualizar paso de configuración:**

```dart
// En step_6_brompton_configuration.dart
bool _newSetting = false;

// En botón Next:
context.read<ProcessorBloc>().add(
  BromptonConfigurationUpdated(BromptonConfiguration(
    frameRate: _frameRate,
    bitDepth: _bitDepth,
    ull: _ull,
    newSetting: _newSetting, // ← NUEVO
  )),
);
```

---

## Resumen Visual

```
FLUJO GENERAL DEL WIZARD
========================

    Usuario: [Hacer click en "Processor Wizard"]
                     │
                     ▼
    ┌─────────────────────────────┐
    │  ProcessorBloc inicializa   │
    │  currentStep: 1             │
    └─────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
    PASO 1       PASO 2       PASO 3
    Confirm      Brand        Apps
        │            │            │
        ├────────────┼────────────┤
        │    PASO 4 | PASO 5      │
        │    Input  | Output      │
        │            │            │
        │    [CalculationRun]     │
        │            ▼            │
        │    ProcessorCalculation │
        │    Service.calculate()  │
        │            │            │
        └────────────┼────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
    SI BROMPTON            SI NOVASTAR
        │                         │
        ▼                         ▼
    PASO 6A                   PASO 6B
    Brompton Config           Results
        │                         │
        ▼                         ▼
    PASO 7                      SEND
    Results & Email            EMAIL
        │                         │
        └────────────┬────────────┘
                     ▼
            ✓ WIZARD COMPLETO
```

---

## Conclusión

El **Processor Wizard** es un sistema sofisticado de multi-paso que:

1. **Recolecta especificaciones** del usuario (6 tipos de datos)
2. **Calcula requisitos** de infraestructura (píxeles, puertos, slots)
3. **Filtra opciones** según criterios técnicos
4. **Genera soluciones** óptimas ordenadas por costo
5. **Soporta comparación** de 2 pantallas en paralelo
6. **Envía resultados** automáticamente por email

Su arquitectura basada en **BLoC** lo hace:

- **Mantenible:** Separación clara de responsabilidades
- **Testeable:** Fácil mockear servicios
- **Escalable:** Agregar pasos/eventos sin afectar código existente
- **Reusable:** Widgets y servicios reutilizables
