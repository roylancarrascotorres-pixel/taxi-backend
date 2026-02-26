// src/users/users.controller.ts
import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  create(@Body() body: { fullName: string; phone: string }) {
    // 🔑 Ahora usamos exactamente fullName (coincide con el script)
    return this.usersService.createUser(body.fullName, body.phone, 'default123');
  }

  @Get()
  all() {
    return this.usersService.findAll();
  }

  @Get(':id')
  byId(@Param('id') id: number) {
    return this.usersService.findById(id);
  }
}