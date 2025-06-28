import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Machine } from 'src/machines/machine.entity/machine.entity';
import { CreateMachineDto } from 'src/machines/dto/create-machine.dto';
import { UpdateMachineDto } from 'src/machines/dto/update-machine.dto';
import { User } from 'src/users/user.entity/user.entity';

@Injectable()
export class MachinesService {
  constructor(
    @InjectRepository(Machine)
    private machineRepo: Repository<Machine>,

    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async findAll(): Promise<Machine[]> {
    return this.machineRepo.find();
  }

  async create(userPayload: { userId: number }, dto: CreateMachineDto): Promise<Machine> {
    const user = await this.userRepo.findOne({ where: { id: userPayload.userId } });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const machine = this.machineRepo.create({ ...dto, createdBy: user });
    return this.machineRepo.save(machine);
  }

  async update(id: number, dto: UpdateMachineDto): Promise<Machine> {
    const machine = await this.machineRepo.findOne({ where: { id } });
    if (!machine) throw new NotFoundException('Machine not found');

    Object.assign(machine, dto);
    return this.machineRepo.save(machine);
  }

  async remove(id: number): Promise<void> {
    const result = await this.machineRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Machine not found');
    }
  }
}