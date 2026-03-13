// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';
import { WalletsModule } from '../wallet/wallets.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), // solo User
    WalletsModule,                    // ✅ WalletsService y WalletRepository disponibles
  ],
  providers: [UsersService],          // UsersService ahora obtiene WalletsService vía WalletsModule
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}