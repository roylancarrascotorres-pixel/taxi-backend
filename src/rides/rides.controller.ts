import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { RidesService } from './rides.service';

@Controller('rides')
export class RidesController {
  constructor(private readonly ridesService: RidesService) {}

  @Get()
  getAll() {
    return this.ridesService.getAllRides();
  }

  @Post()
  create(@Body() body: any) {
    return this.ridesService.createRide(body);
  }

  @Patch(':id/complete')
  complete(@Param('id') id: string) {
    return this.ridesService.completeRide(id);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.ridesService.deleteRide(id);
  }
}