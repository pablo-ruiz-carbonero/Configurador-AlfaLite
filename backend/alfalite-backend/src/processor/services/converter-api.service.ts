import { Injectable } from '@nestjs/common';
import { ConverterDto } from '../dto';
import { CONVERTERS } from './mock-data';

@Injectable()
export class ConverterApiService {
  async getConverters(): Promise<ConverterDto[]> {
    return CONVERTERS as ConverterDto[];
  }

  async getConvertersByType(
    inputType: string,
    outputType?: string,
  ): Promise<ConverterDto[]> {
    return CONVERTERS.filter((c) => {
      const inputMatch = c.inputType
        .toLowerCase()
        .includes(inputType.toLowerCase());
      const outputMatch =
        !outputType ||
        c.outputType.toLowerCase().includes(outputType.toLowerCase());
      return inputMatch && outputMatch;
    }) as ConverterDto[];
  }
}
