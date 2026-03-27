export class ConverterDto {
  id: string;
  name: string;
  inputType: string; // 'HDMI', 'DP', 'RJ45', etc
  outputType: string;
  brand: 'NovaStar' | 'Brompton' | 'Generic';
  cost: number;
  specifications: Record<string, any>;
}
