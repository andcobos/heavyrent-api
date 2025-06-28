import { Controller, Get, Param, Patch, Body, Delete } from '@nestjs/common';
import { RentalsService } from './rentals.service';

@Controller('rentals')
export class RentalsController {
  constructor(private readonly rentalsService: RentalsService) {}

  @Get('user/:id')
  findByUser(@Param('id') id: number) {
    return this.rentalsService.findByUser(+id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: number,
    @Body() body: { status: string },
  ) {
    return this.rentalsService.updateStatus(id, body.status);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.rentalsService.delete(id);
  }
}
