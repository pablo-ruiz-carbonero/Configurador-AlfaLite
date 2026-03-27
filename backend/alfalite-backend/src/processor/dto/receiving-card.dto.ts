export class ReceivingCardDto {
  id: string;
  name: string;
  type: 'input' | 'output' | 'auxiliary';
  processorBrand: 'NovaStar' | 'Brompton';
  processorModel?: string;
  connectorType: 'HDMI' | 'DP' | 'RJ45' | 'OpticalFiber' | 'DVI' | 'Fiber';
  maxChannels?: number;
  cost: number;
  specifications: Record<string, any>;
}
