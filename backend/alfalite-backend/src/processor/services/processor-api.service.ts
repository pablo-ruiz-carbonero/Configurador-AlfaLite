import { Injectable } from '@nestjs/common';
import { ProcessorDto } from '../dto';
import { NOVASTAR_PROCESSORS, BROMPTON_PROCESSORS } from './mock-data';

@Injectable()
export class ProcessorApiService {
  async getProcessors(brand: 'NovaStar' | 'Brompton'): Promise<ProcessorDto[]> {
    // En un sistema real, esto vendría de una base de datos
    const processors =
      brand === 'NovaStar' ? NOVASTAR_PROCESSORS : BROMPTON_PROCESSORS;
    return processors as ProcessorDto[];
  }

  async getProcessorById(id: string): Promise<ProcessorDto | null> {
    const allProcessors = [
      ...(NOVASTAR_PROCESSORS as ProcessorDto[]),
      ...(BROMPTON_PROCESSORS as ProcessorDto[]),
    ];
    return allProcessors.find((p) => p.id === id) || null;
  }

  async getAllProcessors(): Promise<ProcessorDto[]> {
    return [
      ...(NOVASTAR_PROCESSORS as ProcessorDto[]),
      ...(BROMPTON_PROCESSORS as ProcessorDto[]),
    ];
  }
}
