// src/admin/admin.controller.ts
import { Controller, Post, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../common/enums/role.enum';

import { User } from '../users/user.entity';
import { Driver } from '../drivers/driver.entity';
import { Wallet } from '../wallet/wallet.entity';
import { Ride } from '../rides/ride.entity';
import { DailyReward } from '../rewards/daily-reward.entity';
import { Vehicle } from '../vehicles/vehicle.entity';

@Controller('admin')
@UseGuards(AuthGuard, RolesGuard)
export class AdminController {
  constructor(private readonly dataSource: DataSource) {}

  // Endpoint para limpiar todas las tablas principales
  @Post('clear-tables')
  @Roles(Role.ADMIN)
  async clearTables() {
    try {
      const tables = [Ride, DailyReward, Vehicle, Wallet, Driver, User];

      // Limpiar cada tabla respetando dependencias
      for (const table of tables) {
        const repo = this.dataSource.getRepository(table);
        if (repo.metadata) {
          await repo.clear();
          console.log(`✅ Tabla ${repo.metadata.tableName} limpiada`);
        }
      }

      return { message: 'Todas las tablas fueron limpiadas correctamente' };
    } catch (err) {
      console.error('❌ Error limpiando tablas:', err);
      throw new HttpException(
        'Error al limpiar tablas',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}