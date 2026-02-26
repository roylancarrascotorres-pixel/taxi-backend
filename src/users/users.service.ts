import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Wallet } from '../wallet/wallet.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
    @InjectRepository(Wallet)
    private walletRepo: Repository<Wallet>,
  ) {}

  async createUser(name: string, phone: string, password: string): Promise<User> {
    const wallet = this.walletRepo.create({ balance: 0 });
    await this.walletRepo.save(wallet);

    const user = this.usersRepo.create({
      fullName: name,
      phone,
      password,
      wallet,
    });

    return this.usersRepo.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepo.find({ relations: ['wallet'] });
  }

  async findById(id: number): Promise<User> {
    const user = await this.usersRepo.findOne({ where: { id }, relations: ['wallet'] });
    if (!user) throw new Error('User not found');
    return user;
  }
}