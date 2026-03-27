import { Injectable } from '@nestjs/common';
import { ReceivingCardDto } from '../dto';
import { RECEIVING_CARDS } from './mock-data';

@Injectable()
export class ReceivingCardApiService {
  async getInputCards(): Promise<ReceivingCardDto[]> {
    return RECEIVING_CARDS.filter(
      (c) => c.type === 'input',
    ) as ReceivingCardDto[];
  }

  async getOutputCards(): Promise<ReceivingCardDto[]> {
    return RECEIVING_CARDS.filter(
      (c) => c.type === 'output',
    ) as ReceivingCardDto[];
  }

  async getAuxiliaryCards(): Promise<ReceivingCardDto[]> {
    return RECEIVING_CARDS.filter(
      (c) => c.type === 'auxiliary',
    ) as ReceivingCardDto[];
  }

  async getCardsByBrand(
    brand: 'NovaStar' | 'Brompton',
  ): Promise<ReceivingCardDto[]> {
    return RECEIVING_CARDS.filter(
      (c) => c.processorBrand === brand,
    ) as ReceivingCardDto[];
  }

  async getAllCards(): Promise<ReceivingCardDto[]> {
    return RECEIVING_CARDS as ReceivingCardDto[];
  }
}
