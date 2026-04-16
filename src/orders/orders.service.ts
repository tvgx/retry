import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { ProductsService } from '../products/products.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemsRepository: Repository<OrderItem>,
    private readonly productsService: ProductsService,
  ) {}

  async create(userId: number, createOrderDto: CreateOrderDto): Promise<Order> {
    let total = 0;
    const itemsData: Partial<OrderItem>[] = [];
    const fetchedProducts: { product: any; quantity: number }[] = [];

    for (const itemDto of createOrderDto.items) {
      const product = await this.productsService.findOne(itemDto.productId);
      if (product.stock < itemDto.quantity) {
        throw new BadRequestException(
          `Insufficient stock for product "${product.name}"`,
        );
      }
      const unitPrice = Number(product.price);
      total += unitPrice * itemDto.quantity;
      itemsData.push({
        productId: product.id,
        quantity: itemDto.quantity,
        unitPrice,
      });
      fetchedProducts.push({ product, quantity: itemDto.quantity });
    }

    const order = this.ordersRepository.create({
      userId,
      shippingAddress: createOrderDto.shippingAddress,
      total,
      items: itemsData as OrderItem[],
    });

    const savedOrder = await this.ordersRepository.save(order);

    // Decrease stock using already-fetched products
    for (const { product, quantity } of fetchedProducts) {
      await this.productsService.update(product.id, {
        stock: product.stock - quantity,
      });
    }

    return savedOrder;
  }

  findAll(): Promise<Order[]> {
    return this.ordersRepository.find({ relations: ['items', 'items.product', 'user'] });
  }

  async findByUser(userId: number): Promise<Order[]> {
    return this.ordersRepository.find({
      where: { userId },
      relations: ['items', 'items.product'],
    });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['items', 'items.product', 'user'],
    });
    if (!order) {
      throw new NotFoundException(`Order #${id} not found`);
    }
    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id);
    Object.assign(order, updateOrderDto);
    return this.ordersRepository.save(order);
  }

  async remove(id: number): Promise<void> {
    const order = await this.findOne(id);
    await this.ordersRepository.remove(order);
  }
}
