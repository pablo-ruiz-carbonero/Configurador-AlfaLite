import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateApiDto } from './dto/create-api.dto';
import { UpdateApiDto } from './dto/update-api.dto';

@Injectable()
export class ApiService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createApiDto: CreateApiDto) {
    const product = this.productRepository.create(createApiDto);
    return await this.productRepository.save(product);
  }

  async findAll() {
    return await this.productRepository.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) throw new NotFoundException(`Producto #${id} no existe`);
    return product;
  }

  async update(id: number, updateApiDto: UpdateApiDto) {
    const product = await this.productRepository.preload({
      id,
      ...updateApiDto,
    });
    if (!product) throw new NotFoundException(`Producto #${id} no existe`);
    return await this.productRepository.save(product);
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    return await this.productRepository.remove(product);
  }
}
