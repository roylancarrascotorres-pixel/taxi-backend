// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { WalletsService } from '../wallet/wallets.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,

    private walletsService: WalletsService, // ✅ ahora usamos WalletsService
  ) {}

  async createUser(name: string, phone: string, password: string): Promise<User> {
    // Crear wallet usando WalletsService
    const wallet = await this.walletsService.createWallet();

    // Crear usuario con wallet
    const user = this.usersRepo.create({ name, phone, password, wallet });
    return this.usersRepo.save(user);
  }

  findAll(): Promise<User[]> {
    return this.usersRepo.find({ relations: ['wallet'] });
  }

  findById(id: number): Promise<User | null> {
    return this.usersRepo.findOne({ where: { id }, relations: ['wallet'] });
  }
}