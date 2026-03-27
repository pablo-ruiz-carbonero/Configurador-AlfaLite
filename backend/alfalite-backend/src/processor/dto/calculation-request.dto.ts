import { BromptonConfigDto } from './brompton-config.dto';
import { NovaStarConfigDto } from './novastar-config.dto';

export class CalculationRequestDto {
  // DATOS DE PANTALLA
  screenData: {
    width: number; // pixels horizontales
    height: number; // pixels verticales
    physicalWidth: number; // metros
    physicalHeight: number; // metros
    pixelPitch?: number; // mm
  };

  // SELECCIONES DEL USUARIO
  selectedBrand: 'NovaStar' | 'Brompton';
  selectedApplications: string[]; // e.g., ['Broadcast', 'Rental']

  // ENTRADA
  selectedMainInputType: string; // 'HDMI', 'DP', 'Fiber'
  selectedAuxiliaryInputs: Record<string, number>; // e.g., {'ScalerInput': 1}

  // SALIDA
  selectedOutputType: 'RJ45' | 'OpticalFiber';
  selectedAuxiliaryOutputs: Record<string, number>; // e.g., {'Backup': 2}

  // CONFIGURACIÓN ESPECÍFICA
  bromptonConfig?: BromptonConfigDto;
  novastarConfig?: NovaStarConfigDto;
}
