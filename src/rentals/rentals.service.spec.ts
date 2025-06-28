import { Test, TestingModule } from '@nestjs/testing';
import { RentalsService } from './rentals.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RentalRequest } from './rental-request.entity/rental-request.entity';
import { Machine } from 'src/machines/machine.entity/machine.entity';
import { User } from 'src/users/user.entity/user.entity';
import { Repository } from 'typeorm';
import { CreateRentalDto } from './dto/create-rental.dto';

describe('RentalsService', () => {
  let service: RentalsService;
  let rentalRepo: jest.Mocked<Repository<RentalRequest>>;
  let machineRepo: jest.Mocked<Repository<Machine>>;

  const rental = {
    id: 1,
    machine: { id: 1 } as Machine,
    user: { id: 1 } as User,
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
    status: 'pending',
  } as RentalRequest;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RentalsService,
        {
          provide: getRepositoryToken(RentalRequest),
          useValue: {
            find: jest.fn(),
            findOneBy: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Machine),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RentalsService>(RentalsService);
    rentalRepo = module.get(getRepositoryToken(RentalRequest));
    machineRepo = module.get(getRepositoryToken(Machine));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all rentals', async () => {
    rentalRepo.find.mockResolvedValue([rental]);
    const result = await service.findAll();
    expect(result).toEqual([rental]);
  });

  it('should return rentals by user', async () => {
    rentalRepo.find.mockResolvedValue([rental]);
    const result = await service.findByUser(1);
    expect(result).toEqual([rental]);
  });

  it('should return one rental by id', async () => {
    rentalRepo.findOne.mockResolvedValue(rental);
    const result = await service.findOne(1);
    expect(result).toEqual(rental);
  });

  it('should create a rental', async () => {
    const dto: CreateRentalDto = {
      machineId: 1,
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
    };

    machineRepo.findOne.mockResolvedValue(rental.machine);
    rentalRepo.create.mockReturnValue(rental);
    rentalRepo.save.mockResolvedValue(rental);

    const result = await service.create(dto, { id: 1 } as User);
    expect(result).toEqual(rental);
  });

  it('should update rental status', async () => {
    rentalRepo.findOneBy.mockResolvedValue(rental);
    rentalRepo.save.mockResolvedValue({ ...rental, status: 'approved' });

    const result = await service.updateStatus(1, 'approved');
    expect(result.status).toBe('approved');
  });

  it('should delete a rental', async () => {
    rentalRepo.findOneBy.mockResolvedValue(rental);
    rentalRepo.remove.mockResolvedValue(rental);

    const result = await service.delete(1);
    expect(result).toEqual(rental);
  });
});
