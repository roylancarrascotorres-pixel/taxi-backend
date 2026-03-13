import { Module } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { DriversController } from './drivers.controller';
import { Driver } from './driver.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletsModule } from '../wallet/wallets.module'; // ✅ Importar WalletsModule

@Module({
  imports: [
    TypeOrmModule.forFeature([Driver]),
    WalletsModule, // ✅ WalletsService y repositorios ahora disponibles
  ],
  providers: [DriversService],
  controllers: [DriversController],
  exports: [DriversService],
})
export class DriversModule {}