import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';

const mockProductsRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  remove: jest.fn(),
};

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductsRepository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a product', async () => {
      const product = { id: 1, name: 'Laptop', price: 999.99, stock: 10 };
      mockProductsRepository.create.mockReturnValue(product);
      mockProductsRepository.save.mockResolvedValue(product);

      const result = await service.create({ name: 'Laptop', price: 999.99, stock: 10 });
      expect(result).toEqual(product);
    });
  });

  describe('findOne', () => {
    it('should return product if found', async () => {
      const product = { id: 1, name: 'Laptop' };
      mockProductsRepository.findOne.mockResolvedValue(product);
      const result = await service.findOne(1);
      expect(result).toEqual(product);
    });

    it('should throw NotFoundException if not found', async () => {
      mockProductsRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update product fields', async () => {
      const product = { id: 1, name: 'Old', price: 100 };
      mockProductsRepository.findOne.mockResolvedValue(product);
      mockProductsRepository.save.mockImplementation((p) => Promise.resolve(p));

      const result = await service.update(1, { name: 'New', price: 200 });
      expect(result.name).toBe('New');
      expect(result.price).toBe(200);
    });
  });

  describe('remove', () => {
    it('should remove product', async () => {
      const product = { id: 1, name: 'Laptop' };
      mockProductsRepository.findOne.mockResolvedValue(product);
      mockProductsRepository.remove.mockResolvedValue(undefined);
      await expect(service.remove(1)).resolves.toBeUndefined();
    });
  });
});
