import { Test, TestingModule } from '@nestjs/testing';
import { MachinesController } from './machines.controller';
import { MachinesService } from './machines.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Machine } from './machine.entity/machine.entity';
import { User } from '../users/user.entity/user.entity';

describe('MachinesController', () => {
  let controller: MachinesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MachinesController],
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

    controller = module.get<MachinesController>(MachinesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});