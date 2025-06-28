import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Machine } from 'src/machines/machine.entity/machine.entity';
import { MachinesService } from './machines.service';
import { MachinesController } from './machines.controller';
import { User } from 'src/users/user.entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Machine, User])], 
  providers: [MachinesService],
  controllers: [MachinesController],
})
export class MachinesModule {}