import { Module } from '@nestjs/common';
import { ProcessorController } from './processor.controller';
import { ProcessorService } from './processor.service';
import {
  ProcessorApiService,
  ReceivingCardApiService,
  ConverterApiService,
  ProcessorCalculationService,
  EmailClientService,
} from './services';

@Module({
  controllers: [ProcessorController],
  providers: [
    ProcessorService,
    ProcessorApiService,
    ReceivingCardApiService,
    ConverterApiService,
    ProcessorCalculationService,
    EmailClientService,
  ],
  exports: [ProcessorService],
})
export class ProcessorModule {}
