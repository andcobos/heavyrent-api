import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    validateOAuthLogin: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);

    jest.clearAllMocks();
  });

  it('should handle Google OAuth redirect and return token', async () => {
    const mockRequest = {
      user: {
        email: 'test@example.com',
        name: 'Test User',
      },
    };

    const expectedResponse = {
      acces_token: 'mock-jwt-token',
    };

    mockAuthService.validateOAuthLogin.mockResolvedValue(expectedResponse);

    const result = await controller.googleAuthRedirect(mockRequest);

    expect(mockAuthService.validateOAuthLogin).toHaveBeenCalledWith(
      'test@example.com',
      'Test User'
    );
    expect(result).toEqual(expectedResponse);
  });

  it('should handle Google OAuth redirect with missing user data', async () => {
    const mockRequest = {
      user: {
        email: 'test@example.com',
        name: 'Test User',
      },
    };

    mockAuthService.validateOAuthLogin.mockRejectedValue(
      new Error('User validation failed')
    );

    await expect(controller.googleAuthRedirect(mockRequest)).rejects.toThrow(
      'User validation failed'
    );

    expect(mockAuthService.validateOAuthLogin).toHaveBeenCalledWith(
      'test@example.com',
      'Test User'
    );
  });
});