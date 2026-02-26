import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { Repository } from 'typeorm';
import { UpdateDriverDto } from './dto/update-driver.dto'; // El DTO para la actualización

@Controller('drivers')
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Post('register')
  create(@Body() body: { fullname: string; phone: string }) {
    return this.driversService.createDriver(body.fullname, body.phone, 'default123');
  }

  @Get()
  all() {
    return this.driversService.findAll();
  }

  @Get(':id')
  byId(@Param('id') id: number) {
    return this.driversService.findById(id);
  }
}