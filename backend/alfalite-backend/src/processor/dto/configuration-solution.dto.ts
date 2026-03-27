import { ProcessorDto } from './processor.dto';
import { ReceivingCardDto } from './receiving-card.dto';

export class ConfigurationSolutionDto {
  id: string;
  rank: number; // 1, 2, 3, etc para ordenar por relevancia
  processors: ProcessorDto[];
  inputCards: ReceivingCardDto[];
  outputCards: ReceivingCardDto[];
  auxiliaryOutputCards?: ReceivingCardDto[];
  auxiliaryInputCards?: ReceivingCardDto[];
  totalCost: number;
  costBreakdown: Record<string, number>;
  solutionType: 'single_processor' | 'multi_processor' | 'h_series';
  totalTiles?: number;
  tilesPerProcessor?: number;
  summary: string;
  advantages: string[];
  considerations: string[];
  metadata: Record<string, any>;
}
