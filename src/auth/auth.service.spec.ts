import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;

  const mockUsersService = {
    create: jest.fn(),
    findByEmail: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('test.jwt.token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register and return access_token', async () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        name: 'Test',
        role: UserRole.CUSTOMER,
      };
      mockUsersService.create.mockResolvedValue(user);

      const result = await service.register({
        email: user.email,
        name: user.name,
        password: 'password123',
      });

      expect(result.access_token).toBe('test.jwt.token');
      expect(result.user.email).toBe(user.email);
    });
  });

  describe('login', () => {
    it('should return access_token on valid credentials', async () => {
      const hashed = await bcrypt.hash('password123', 10);
      const user = {
        id: 1,
        email: 'test@example.com',
        name: 'Test',
        role: UserRole.CUSTOMER,
        password: hashed,
      };
      mockUsersService.findByEmail.mockResolvedValue(user);

      const result = await service.login({
        email: user.email,
        password: 'password123',
      });

      expect(result.access_token).toBe('test.jwt.token');
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);
      await expect(
        service.login({ email: 'no@example.com', password: 'pass' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException on wrong password', async () => {
      const hashed = await bcrypt.hash('correct', 10);
      mockUsersService.findByEmail.mockResolvedValue({ id: 1, password: hashed });
      await expect(
        service.login({ email: 'test@example.com', password: 'wrong' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
