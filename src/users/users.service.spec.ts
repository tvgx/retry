import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User, UserRole } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

const mockUsersRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  remove: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new user with hashed password', async () => {
      mockUsersRepository.findOne.mockResolvedValue(null);
      const saved: Partial<User> = {
        id: 1,
        email: 'test@example.com',
        name: 'Test',
        role: UserRole.CUSTOMER,
      };
      mockUsersRepository.create.mockReturnValue(saved);
      mockUsersRepository.save.mockResolvedValue(saved);

      const result = await service.create({
        email: 'test@example.com',
        name: 'Test',
        password: 'password123',
      });

      expect(result).toEqual(saved);
      expect(mockUsersRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ email: 'test@example.com' }),
      );
    });

    it('should throw ConflictException if email already in use', async () => {
      mockUsersRepository.findOne.mockResolvedValue({ id: 1 });

      await expect(
        service.create({
          email: 'existing@example.com',
          name: 'User',
          password: 'password123',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findOne', () => {
    it('should return a user if found', async () => {
      const user: Partial<User> = { id: 1, email: 'test@example.com', name: 'Test' };
      mockUsersRepository.findOne.mockResolvedValue(user);

      const result = await service.findOne(1);
      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUsersRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and return user', async () => {
      const user: Partial<User> = { id: 1, email: 'a@b.com', name: 'Old' };
      mockUsersRepository.findOne.mockResolvedValue(user);
      mockUsersRepository.save.mockResolvedValue({ ...user, name: 'New' });

      const result = await service.update(1, { name: 'New' });
      expect(result.name).toBe('New');
    });

    it('should hash password if updated', async () => {
      const user: Partial<User> = { id: 1, email: 'a@b.com', name: 'A', password: 'old' };
      mockUsersRepository.findOne.mockResolvedValue(user);
      mockUsersRepository.save.mockImplementation((u) => Promise.resolve(u));

      const result = await service.update(1, { password: 'newpass1' });
      const isHashed = await bcrypt.compare('newpass1', result.password!);
      expect(isHashed).toBe(true);
    });
  });

  describe('remove', () => {
    it('should remove user', async () => {
      const user: Partial<User> = { id: 1 };
      mockUsersRepository.findOne.mockResolvedValue(user);
      mockUsersRepository.remove.mockResolvedValue(undefined);

      await expect(service.remove(1)).resolves.toBeUndefined();
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUsersRepository.findOne.mockResolvedValue(null);
      await expect(service.remove(99)).rejects.toThrow(NotFoundException);
    });
  });
});
