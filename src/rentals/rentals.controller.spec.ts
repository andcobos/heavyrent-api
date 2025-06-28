import { Test, TestingModule } from '@nestjs/testing';
import { RentalsController } from './rentals.controller';
import { RentalsService } from './rentals.service';

describe('RentalsController', () => {
  let controller: RentalsController;
  let service: RentalsService;

  const mockRental = {
    id: 1,
    status: 'pending',
  };

  const mockService = {
    findByUser: jest.fn().mockResolvedValue([mockRental]),
    updateStatus: jest.fn().mockResolvedValue({ ...mockRental, status: 'approved' }),
    delete: jest.fn().mockResolvedValue(mockRental),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RentalsController],
      providers: [
        {
          provide: RentalsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<RentalsController>(RentalsController);
    service = module.get<RentalsService>(RentalsService);
  });

  it('should return rentals by user', async () => {
    const result = await controller.findByUser(1);
    expect(result).toEqual([mockRental]);
    expect(service.findByUser).toHaveBeenCalledWith(1);
  });

  it('should update rental status', async () => {
    const result = await controller.updateStatus(1, { status: 'approved' });
    expect(result.status).toBe('approved');
    expect(service.updateStatus).toHaveBeenCalledWith(1, 'approved');
  });

  it('should delete a rental', async () => {
    const result = await controller.delete(1);
    expect(result).toEqual(mockRental);
    expect(service.delete).toHaveBeenCalledWith(1);
  });
});
