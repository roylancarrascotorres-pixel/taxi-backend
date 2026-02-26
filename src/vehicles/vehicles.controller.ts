import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';

@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post('register')
  create(@Body() body: { type: string; plate: string; driverId: number }) {
    return this.vehiclesService.createVehicle(body.type, body.plate, body.driverId);
  }

  @Get()
  all() {
    return this.vehiclesService.findAll();
  }

  @Get(':id')
  byId(@Param('id') id: number) {
    return this.vehiclesService.findById(id);
  }
}