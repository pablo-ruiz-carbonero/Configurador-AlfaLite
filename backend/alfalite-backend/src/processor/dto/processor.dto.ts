export class ProcessorDto {
  id: string;
  name: string;
  brand: 'NovaStar' | 'Brompton';
  model: string;
  maxInputsHDMI?: number;
  maxInputsDP?: number;
  maxInputsFiber?: number;
  maxOutputs: number;
  maxPixels: number;
  supportedResolutions: string[];
  frameRates: number[];
  bitDepths: number[];
  cost: number;
  features: string[];
  specifications: Record<string, any>;
}
