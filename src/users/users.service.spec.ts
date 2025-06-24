import { Repository } from 'typeorm';
import { User } from './user.entity/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let repo: Repository<User>;

  const mockUser: User = {
    id: 1,
    name: 'Juan Pérez',
    email: 'juan@example.com',
    role: '',
    machines: [],
    rentals: [],
  };

  const mockRepo = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get<Repository<User>>(getRepositoryToken(User));

    jest.clearAllMocks();
  });

  it('deberia crear un usuario si no existe', async () => {
    mockRepo.findOne.mockResolvedValue(null);
    mockRepo.create.mockReturnValue(mockUser);
    mockRepo.save.mockResolvedValue(mockUser);

    const result = await service.findOrCreate({ email: mockUser.email, name: mockUser.name });

    expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { email: mockUser.email } });
    expect(mockRepo.create).toHaveBeenCalledWith({ email: mockUser.email, name: mockUser.name });
    expect(mockRepo.save).toHaveBeenCalledWith(mockUser);
    expect(result).toEqual(mockUser);
  });

  it('deberia retornar un usuario existente en la bd', async () => {
    mockRepo.findOne.mockResolvedValue(mockUser);

    const result = await service.findOrCreate({ email: mockUser.email, name: mockUser.name });

    expect(mockRepo.findOne).toHaveBeenCalled();
    expect(mockRepo.create).not.toHaveBeenCalled();
    expect(mockRepo.save).not.toHaveBeenCalled();
    expect(result).toEqual(mockUser);
  });

  it('debería lanzar error si falta el email', async () => {
    await expect(
      service.findOrCreate({ email: '', name: 'Nombre' }),
    ).rejects.toThrow('Email es requerido');
  });

  it('deberia encontrar usuario por ID', async () => {
    mockRepo.findOne.mockResolvedValue(mockUser);

    const result = await service.findById(1);

    expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(result).toEqual(mockUser);
  });

  it('deberia retornar null si el ID no existe', async () => {
    mockRepo.findOne.mockResolvedValue(null);

    const result = await service.findById(999);

    expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { id: 999 } });
    expect(result).toBeNull();
  });

  it('deberia retornar todos los usuarios', async () => {
    const users = [mockUser, { ...mockUser, id: 2, email: 'otro@example.com' }];
    mockRepo.find.mockResolvedValue(users);

    const result = await service.findAll();

    expect(mockRepo.find).toHaveBeenCalled();
    expect(result).toEqual(users);
  });

  it('no deberia crear usuario si ya existe el correo', async () => {
    mockRepo.findOne.mockResolvedValue(mockUser);

    const result = await service.findOrCreate({ email: mockUser.email, name: 'Otro Nombre' });

    expect(mockRepo.create).not.toHaveBeenCalled();
    expect(mockRepo.save).not.toHaveBeenCalled();
    expect(result).toEqual(mockUser);
  });
});
