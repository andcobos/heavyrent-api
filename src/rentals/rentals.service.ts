import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RentalRequest } from './rental-request.entity/rental-request.entity';
import { CreateRentalDto } from './dto/create-rental.dto';
import { Machine } from 'src/machines/machine.entity/machine.entity';
import { User } from 'src/users/user.entity/user.entity';

@Injectable()
export class RentalsService {
  constructor(
    @InjectRepository(RentalRequest)
    private readonly rentalRepository: Repository<RentalRequest>,
    @InjectRepository(Machine)
    private readonly machineRepository: Repository<Machine>,
  ) {}

  async create(createRentalDto: CreateRentalDto, user: User) {
    const machine = await this.machineRepository.findOne({ where: { id: createRentalDto.machineId } });
    if (!machine) throw new NotFoundException('Machine not found');
    const rental = this.rentalRepository.create({
      ...createRentalDto,
      machine,
      user,
      status: 'pending',
    });
    return this.rentalRepository.save(rental);
  }

  async findAll() {
    return this.rentalRepository.find();
  }

  async findOne(id: number) {
    const rental = await this.rentalRepository.findOne({ where: { id } });
    if (!rental) throw new NotFoundException('Rental not found');
    return rental;
  }

  async findByUser(userId: number) {
    return this.rentalRepository.find({
      where: { user: { id: userId } },
    });
  }

  async updateStatus(id: number, status: string) {
    const rental = await this.rentalRepository.findOneBy({ id });
    if (!rental) throw new NotFoundException('Rental not found');
    rental.status = status;
    return this.rentalRepository.save(rental);
  }

  async delete(id: number) {
    const rental = await this.rentalRepository.findOneBy({ id });
    if (!rental) throw new NotFoundException('Rental not found');
    return this.rentalRepository.remove(rental);
  }
}
