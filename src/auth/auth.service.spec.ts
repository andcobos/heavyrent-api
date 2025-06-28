import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let usersService: UsersService;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    name: 'Test User',
    role: 'customer',
    machines: [],
    rentals: [],
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock-jwt-token'),
  };

  const mockUsersService = {
    findOrCreate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    usersService = module.get<UsersService>(UsersService);

    jest.clearAllMocks();
  });

  it('should create user and return JWT token', async () => {
    mockUsersService.findOrCreate.mockResolvedValue(mockUser);

    const result = await service.validateOAuthLogin('test@example.com', 'Test User');

    expect(mockUsersService.findOrCreate).toHaveBeenCalledWith({
      email: 'test@example.com',
      name: 'Test User',
    });
    expect(mockJwtService.sign).toHaveBeenCalledWith({
      email: 'test@example.com',
      sub: 1,
    });
    expect(result).toEqual({
      acces_token: 'mock-jwt-token',
    });
  });

  it('should handle existing user and return JWT token', async () => {
    const existingUser = { ...mockUser, id: 2, email: 'existing@example.com' };
    mockUsersService.findOrCreate.mockResolvedValue(existingUser);

    const result = await service.validateOAuthLogin('existing@example.com', 'Existing User');

    expect(mockUsersService.findOrCreate).toHaveBeenCalledWith({
      email: 'existing@example.com',
      name: 'Existing User',
    });
    expect(mockJwtService.sign).toHaveBeenCalledWith({
      email: 'existing@example.com',
      sub: 2,
    });
    expect(result.acces_token).toBe('mock-jwt-token');
  });

  it('should throw error when user creation fails', async () => {
    mockUsersService.findOrCreate.mockRejectedValue(new Error('Database error'));

    await expect(
      service.validateOAuthLogin('test@example.com', 'Test User')
    ).rejects.toThrow('Database error');

    expect(mockJwtService.sign).not.toHaveBeenCalled();
  });
});