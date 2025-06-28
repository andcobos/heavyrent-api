import { Test, TestingModule } from '@nestjs/testing';
import { MachinesService } from './machines.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Machine } from './machine.entity/machine.entity';
import { User } from '../users/user.entity/user.entity';
import { Repository } from 'typeorm';

describe('MachinesService', () => {
  let service: MachinesService;
  let machineRepo: jest.Mocked<Repository<Machine>>;
  let userRepo: jest.Mocked<Repository<User>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MachinesService,
        {
          provide: getRepositoryToken(Machine),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MachinesService>(MachinesService);
    machineRepo = module.get(getRepositoryToken(Machine));
    userRepo = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});