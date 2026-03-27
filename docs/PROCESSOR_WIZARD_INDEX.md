# 📚 Documentación del Processor Wizard - Indice Completo

Este documento actúa como índice y resumen ejecutivo para toda la documentación del Processor Wizard.

---

## 📍 Ubicación de Documentos

### En Tu Workspace (Directorio Raíz)

```
/home/raspy/CONFIGURADOR ALFALITE/Deployment-Configurator-backup-20251023-125935/
├── PROCESSOR_WIZARD_README.md                 ← 📄 DOCUMENTO PRINCIPAL
│   └── Explicación completa de la lógica del wizard
│       - Introducción general
│       - Arquitectura BLoC
│       - Componentes principales
│       - Flujo paso a paso
│       - Lógica de cálculo avanzada
│       - Implementación de pasos
│       - Sistema de estados
│       - Modo dual-pantalla
│       - Servicios y APIs
│       - Guía de extensión
│
├── PROCESSOR_WIZARD_NESTJS_REACT_PROMPT.md   ← 🤖 PARA IA (PORTEO)
│   └── Prompt detallado para portar a NestJS + React TS
│       - Contexto general
│       - Estructura de carpetas backend
│       - DTOs completos
│       - ProcessorService (equivalente a ProcessorBloc)
│       - ProcessorCalculationService
│       - Controller NestJS
│       - Redux Store React
│       - Componentes de pasos
│       - RTK Query
│       - Middleware
│       - Tests
│       - Instrucciones finales
│
└── Deployment-Configurator/
    └── Configurator/
        └── lib/
            └── modules/
                └── processor/                ← 📂 CÓDIGO FUENTE (FLUTTER)
                    ├── processor_module.dart
                    ├── processor_module.dart (exports)
                    │
                    ├── blocs/
                    │   ├── processor_bloc.dart           [⭐ ORQUESTADOR]
                    │   ├── processor_states.dart         [⭐ MODELO DE ESTADO]
                    │   ├── processor_events.dart         [⭐ EVENTOS]
                    │   ├── processor_event_handlers.dart [⭐ LÓGICA]
                    │   └── README.md
                    │
                    ├── services/
                    │   ├── api/
                    │   │   ├── processor_api_service.dart
                    │   │   ├── receiving_card_api_service.dart
                    │   │   └── converter_api_service.dart
                    │   │
                    │   ├── calculation/
                    │   │   ├── processor_calculation_service.dart  [⭐ LÓGICA CRÍTICA]
                    │   │   └── calculation_data.dart
                    │   │
                    │   └── email_client_service.dart
                    │
                    ├── widgets/
                    │   ├── wizard/
                    │   │   ├── processor_wizard.dart              [⭐ CONTAINER]
                    │   │   ├── dual_screen_processor_wizard.dart  [DUAL-SCREEN]
                    │   │   ├── screen_specific_processor_wrapper.dart
                    │   │   ├── dual_screen_processor_wrapper.dart
                    │   │   └── wizard_button.dart
                    │   │
                    │   └── steps/
                    │       ├── step_1_confirmation.dart                [PASO 1]
                    │       ├── step_2_brand_selection.dart             [PASO 2]
                    │       ├── step_3_application_selection.dart       [PASO 3]
                    │       ├── step_4_input_connector_selection.dart   [PASO 4]
                    │       ├── step_5_output_connector_selection.dart  [PASO 5]
                    │       ├── step_6_brompton_configuration.dart      [PASO 6A]
                    │       ├── step_6_results.dart                     [PASO 6B]
                    │       └── step_7_brompton_results.dart            [PASO 7]
                    │
                    └── models/                           [MODELOS DATOS]
                        ├── processor.dart
                        ├── receiving_card.dart
                        ├── configuration_solution.dart
                        ├── converter.dart
                        └── brompton_config.dart
```

---

## 🎯 Resumen Ejecutivo

### ¿QUÉ ES EL PROCESSOR WIZARD?

Un **sistema experto de 7 pasos** que recomienda procesadores LED optimizados basándose en especificaciones de pantalla.

**Entrada:** Resolución (1920×1080), Dimensiones (10m × 5m)  
**Proceso:** Filtrado + Cálculo de puertos + Ranking por costo  
**Salida:** Top 5 procesadores + tarjetas + convertidores ordenados por precio

### ARQUITECTURA PRINCIPAL

```
User Input
    ↓
[ProcessorBloc] ← Orquestador central (BLoC pattern)
    ├─ Gestiona estado
    ├─ Procesa eventos
    └─ Coordina servicios
         ↓
    [ProcessorCalculationService] ← Lógica matemática compleja
         ├─ Filtra procesadores
         ├─ Calcula puertos
         ├─ Genera soluciones
         └─ Ordena por costo

    [API Services] ← Obtienen datos
         ├─ ProcessorApiService
         ├─ ReceivingCardApiService
         └─ ConverterApiService

    [UI Widgets] ← 7 Pasos interactivos
         ├─ ProcessorWizard (contenedor)
         └─ Step1-Step7 (pasos)

    [EmailClientService] ← Envía resultados

    ↓
Results Email ← Usuario recibe recomendaciones
```

### COMPONENTES CRÍTICOS

1. **ProcessorBloc** (`processor_bloc.dart`)
   - 🎛️ Orquestador central
   - ~300 líneas
   - Maneja ~13 eventos distintos
   - Soporta modo simple y dual-screen

2. **ProcessorCalculationService** (`processor_calculation_service.dart`)
   - 🧮 Algoritmo de recomendación
   - ~500+ líneas
   - Lógica matemática compleja
   - Filtra, valida, calcula, ordena

3. **ProcessorState** (`processor_states.dart`)
   - 📊 Modelo de estado inmutable
   - 40+ campos
   - Tracks todas las selecciones del usuario
   - Duplicado para modo dual-screen

4. **7 Pasos del Wizard** (`step_X.dart`)
   - 🎨 Interfaz interactiva
   - Confirmación → Marca → Apps → Input → Output → Config → Resultados
   - Cada paso es un StatelessWidget con BlocBuilder

---

## 📖 CÓMO LEER LA DOCUMENTACIÓN

### Para Entender la Lógica General:

1. Lee: **[PROCESSOR_WIZARD_README.md](./PROCESSOR_WIZARD_README.md)**
   - Sección: "Introducción" (5 min)
   - Sección: "Arquitectura General" (5 min)
   - Sección: "Flujo Lógico Detallado" (15 min)

### Para Estudiar la Lógica de Cálculo:

1. Lee: **[PROCESSOR_WIZARD_README.md](./PROCESSOR_WIZARD_README.md)**
   - Sección: "Lógica de Cálculo Avanzada" (30 min)
   - Revisa: `ProcessorCalculationService` en el código

### Para Entender el BLoC:

1. Lee: **[PROCESSOR_WIZARD_README.md](./PROCESSOR_WIZARD_README.md)**
   - Sección: "Sistema de Estados" (10 min)
   - Revisa archivos:
     - `processor_bloc.dart`
     - `processor_states.dart`
     - `processor_events.dart`
     - `processor_event_handlers.dart`

### Para Entender los Pasos Individuales:

1. Lee: **[PROCESSOR_WIZARD_README.md](./PROCESSOR_WIZARD_README.md)**
   - Sección: "Implementación de Pasos" (20 min)
   - Código: `lib/modules/processor/widgets/steps/`

### Para Entender Modo Dual-Pantalla:

1. Lee: **[PROCESSOR_WIZARD_README.md](./PROCESSOR_WIZARD_README.md)**
   - Sección: "Modo Dual-Pantalla" (15 min)
   - Código: `dual_screen_processor_wizard.dart`

### Para Portar a NestJS + React:

1. Lee: **[PROCESSOR_WIZARD_NESTJS_REACT_PROMPT.md](./PROCESSOR_WIZARD_NESTJS_REACT_PROMPT.md)**
   - Sección: "FASES 1-11" (2-3 horas)
   - Usa este como prompt para IA
   - Implementa cada fase en orden

---

## 🔑 CONCEPTOS CLAVE

### BLoC Pattern

- **B**usiness **Lo**gic **C**omponent
- Separación de lógica de UI
- Unidireccional: Event → Bloc → State → UI
- Facilita testing y reusabilidad

### ProcessorCalculationService - El Corazón

El método `getRecommendedSolutions()` hace esto:

```
1. totalPixels = width × height              // 1920×1080 = 2M
2. requiredPorts = totalPixels / pixelsPerPort // 2M / 128k = 16 puertos
3. Filter processors que caben esa resolución
4. Para cada procesador:
   - Obtener tarjetas de entrada requeridas
   - Obtener tarjetas de salida (N×16 puertos)
   - Validar que caben en procesador
   - Obtener convertidores necesarios
   - Calcular costo total
   - Crear ConfigurationSolution
5. Ordenar por costo (más barato primero)
6. Retornar top 5
```

### Estados Posibles

```
INITIAL        → Recién abierto, sin datos
  ↓
LOADING        → Calculando soluciones (muestra spinner)
  ↓
SUCCESS        → Cálculo completado (muestra resultados)

FAILURE        → Error ocurrió (muestra mensaje error)
```

### Flujo de Eventos

```
               PASO 1         PASO 2          PASO 3
            Confirmation    Brand Select     Applications
                 │ Next           │ Click        │ Select
                 ↓               ↓               ↓
            [Emit Event] → [BLoC Maneja] → [Emit New State]
                            ↓
                      [UI se redibuja]
                            ↓
                      Avanza al siguiente paso
```

---

## 💾 ARCHIVOS FUENTE PRINCIPALES

| Archivo                              | Líneas      | Propósito                               |
| ------------------------------------ | ----------- | --------------------------------------- |
| `processor_bloc.dart`                | 200-300     | Orquestador central, registra eventos   |
| `processor_states.dart`              | 100-150     | Modelo de estado inmutable (40+ campos) |
| `processor_events.dart`              | 100-200     | Eventos que dispara el usuario          |
| `processor_event_handlers.dart`      | 500-700     | Implementación de manejadores           |
| `processor_calculation_service.dart` | 500-700     | **LÓGICA CRÍTICA** de recomendación     |
| `processor_wizard.dart`              | 200-250     | Container principal del wizard          |
| `step_*.dart` (7 archivos)           | 100-200 c/u | Interfaces de cada paso                 |
| `models/`                            | 200-300     | Processor, ReceivingCard, etc           |

**Total:** ~2500-3500 líneas de código Flutter

---

## 🎓 EJEMPLOS DE CASOS DE USO

### Caso 1: Usuario Configura Pantalla Brompton 1920×1080

```
PASO 1: Confirmación
  ✓ Muestra: 1920×1080, 10m×5m
  → Next

PASO 2: Selección de Marca
  ✓ Usuario selecciona "Brompton"
  ✓ API carga: [SX10, SX20, SX40, SX80]
  → Next (auto)

PASO 3: Aplicaciones
  ✓ Usuario selecciona: "Broadcast", "Sports"
  ✓ Filtra procesadores que soportan ambas
  → Next (manual)

PASO 4: Entrada
  ✓ Usuario selecciona: "HDMI"
  → Next (manual)

PASO 5: Salida
  ✓ Usuario selecciona: "RJ45"
  ✓ Cálculo automático:
    - 2M pixels necesitan 16 puertos RJ45
    - 16 puertos = 1 tarjeta RJ45 (16 puertos)
  → [CalculationRun] (automático)

  🧮 ProcessorCalculationService calcula:
    - Filtra: Solo Brompton que soporten Broadcast+Sports
    - Valida: Solo que caben 2M pixels
    - Genera soluciones:
      * SX40 + HDMI Card + RJ45 Card = $11,700
      * SX40 + HDMI Card + RJ45 Card = $12,000
      * SX80 + HDMI Card + RJ45 Card = $19,500
      * ...
    - Ordena por costo
    - Retorna top 5

PASO 6A: Configuración Brompton
  ✓ Usuario configura:
    - Frame Rate: 120 Hz
    - Bit Depth: 10 bits
    - ULL: Sí
  → Next

PASO 7: Resultados
  ✓ Muestra top 5 soluciones
  ✓ Usuario selecciona solución #1 ($11,700)
  ✓ Completa formulario (nombre, email, empresa)
  ✓ Click en "SEND"

  📧 EmailClientService envía:
    Asunto: "Your LED Processor Configuration"
    Cuerpo: [Solución con todos los detalles técnicos]

✓ WIZARD COMPLETADO
```

---

## 🚀 ¿CÓMO PORTAR A NESTJS + REACT?

**Referencia:** [PROCESSOR_WIZARD_NESTJS_REACT_PROMPT.md](./PROCESSOR_WIZARD_NESTJS_REACT_PROMPT.md)

**Mapeo 1:1:**

| Flutter                | NestJS                       |
| ---------------------- | ---------------------------- |
| ProcessorBloc          | ProcessorService             |
| ProcessorState         | Redux Store (processorSlice) |
| ProcessorEvent         | Redux Action                 |
| ProcessorEventHandlers | Redux Reducers + Middleware  |
| Services               | NestJS Services              |
| Widgets (Step1-7)      | React Components             |
| UI Build               | JSX/TSX                      |

**Clave:** ProcessorCalculationService se porta tal cual - es pure logic con 0 dependencias de Flutter.

---

## ✅ CHECKLIST PARA COMPRENDER TODO

- [ ] Lei PROCESSOR_WIZARD_README.md (secciones Intro + Arquitectura)
- [ ] Entiendo qué es BLoC pattern
- [ ] Entiendo los 7 pasos del wizard
- [ ] Entiendo cómo calcula ProcessorCalculationService
- [ ] Entiendo ProcessorState y seus campos
- [ ] Entiendo los eventos principales
- [ ] Entiendo el flujo paso a paso
- [ ] Lei código real de processor_bloc.dart
- [ ] Lei código real de processor_calculation_service.dart
- [ ] Entiendo modo dual-screen
- [ ] Preparado para portar a NestJS + React

---

## 📞 PREGUNTAS FRECUENTES

### ¿Dónde está la lógica de cálculo?

**Respuesta:** `processor_calculation_service.dart` líneas 1-500+

### ¿Cuál es el estado que se guarda?

**Respuesta:** `ProcessorState` en `processor_states.dart` - 40+ campos

### ¿Cómo avanzo entre pasos?

**Respuesta:** Disparar evento `ProcessorStepChanged(stepNumber)`

### ¿Por qué hay 2 modos (NovaStar vs Brompton)?

**Respuesta:** Diferentes pasos finales y configuraciones técnicas

### ¿Cómo envía email?

**Respuesta:** `EmailClientService.sendResults()` al finalizar

### ¿Es posible tener 2 pantallas al mismo tiempo?

**Respuesta:** Sí, modo dual-screen mediante `isDualScreenMode` flag

---

## 📝 Notas para Mantenimiento

1. **ProcessorCalculationService es el corazón** - Cualquier cambio aquí afecta el resultado final
2. **Estado es inmutable** - Siempre usar `copyWith()`, nunca muttar directamente
3. **BLoC maneja sincronización** - El wizard auto-avanza algunos pasos después de eventos
4. **Modo dual-screen duplica todo** - `fields` y `fields2` para pantalli 1 y 2
5. **Email es async** - Envío ocurre después de completar, puede fallar

---

## 📚 Referencias Adicionales

- **BLoC Library:** https://pub.dev/packages/flutter_bloc
- **Flutter State Management:** https://flutter.dev/docs/development/data-and-backend/state-mgmt
- **NestJS:** https://docs.nestjs.com
- **Redux:** https://redux.js.org
- **React:** https://react.dev

---

**Documento Creado:** 2024  
**Última Actualización:** Marzo 2026  
**Estado:** Completo y Actualizado
