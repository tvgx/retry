import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';

const mockCategoriesRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  remove: jest.fn(),
};

describe('CategoriesService', () => {
  let service: CategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(Category),
          useValue: mockCategoriesRepository,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new category', async () => {
      mockCategoriesRepository.findOne.mockResolvedValue(null);
      const category = { id: 1, name: 'Electronics' };
      mockCategoriesRepository.create.mockReturnValue(category);
      mockCategoriesRepository.save.mockResolvedValue(category);

      const result = await service.create({ name: 'Electronics' });
      expect(result).toEqual(category);
    });

    it('should throw ConflictException if name already exists', async () => {
      mockCategoriesRepository.findOne.mockResolvedValue({ id: 1, name: 'Electronics' });
      await expect(service.create({ name: 'Electronics' })).rejects.toThrow(ConflictException);
    });
  });

  describe('findOne', () => {
    it('should return category if found', async () => {
      const category = { id: 1, name: 'Electronics' };
      mockCategoriesRepository.findOne.mockResolvedValue(category);
      const result = await service.findOne(1);
      expect(result).toEqual(category);
    });

    it('should throw NotFoundException if not found', async () => {
      mockCategoriesRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a category', async () => {
      const category = { id: 1, name: 'Electronics' };
      mockCategoriesRepository.findOne.mockResolvedValue(category);
      mockCategoriesRepository.remove.mockResolvedValue(undefined);
      await expect(service.remove(1)).resolves.toBeUndefined();
    });
  });
});
