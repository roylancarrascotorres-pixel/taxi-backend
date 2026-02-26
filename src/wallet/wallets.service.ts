import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from './wallet.entity';

@Injectable()
export class WalletsService {
  constructor(
    @InjectRepository(Wallet)
    private walletsRepository: Repository<Wallet>,
  ) {}

  async createWallet(): Promise<Wallet> {
    const wallet = this.walletsRepository.create({ balance: 0 });
    return await this.walletsRepository.save(wallet);
  }

  async addBalance(walletId: number, amount: number): Promise<Wallet> {
    const wallet = await this.walletsRepository.findOne({ where: { id: walletId } });
    if (!wallet) throw new Error('Wallet not found');
    wallet.balance += amount;
    return this.walletsRepository.save(wallet);
  }

  async subtractBalance(walletId: number, amount: number): Promise<Wallet> {
    const wallet = await this.walletsRepository.findOne({ where: { id: walletId } });
    if (!wallet) throw new Error('Wallet not found');
    if (wallet.balance < amount) throw new Error('Insufficient balance');
    wallet.balance -= amount;
    return this.walletsRepository.save(wallet);
  }

  async getBalance(walletId: number): Promise<number> {
    const wallet = await this.walletsRepository.findOne({ where: { id: walletId } });
    if (!wallet) throw new Error('Wallet not found');
    return wallet.balance;
  }
}