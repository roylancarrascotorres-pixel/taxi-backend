// src/wallet/wallets.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from './wallet.entity';
import { WalletTransaction, WalletTransactionType } from './wallet-transaction.entity';

@Injectable()
export class WalletsService {
  constructor(
    @InjectRepository(Wallet)
    private walletsRepository: Repository<Wallet>,

    @InjectRepository(WalletTransaction)
    private walletTransactionRepo: Repository<WalletTransaction>,
  ) {}

  async createWallet(): Promise<Wallet> {
    const wallet = this.walletsRepository.create({ balance: 0 });
    return this.walletsRepository.save(wallet);
  }

  async getBalance(walletId: number): Promise<number> {
    const wallet = await this.walletsRepository.findOne({ where: { id: walletId } });
    if (!wallet) throw new Error('Wallet not found');
    return wallet.balance;
  }

  async rechargeWallet(walletId: number, amount: number): Promise<Wallet> {
    const wallet = await this.walletsRepository.findOne({ where: { id: walletId } });
    if (!wallet) throw new Error('Wallet not found');
    wallet.balance += amount;
    await this.walletsRepository.save(wallet);

    const tx = this.walletTransactionRepo.create({
      wallet,
      type: WalletTransactionType.BONUS,
      amount,
      description: 'Recharge',
    });
    await this.walletTransactionRepo.save(tx);

    return wallet;
  }

  async applyTransaction(walletId: number, amount: number, type: WalletTransactionType, description?: string): Promise<Wallet> {
    const wallet = await this.walletsRepository.findOne({ where: { id: walletId } });
    if (!wallet) throw new Error('Wallet not found');

    if (type === WalletTransactionType.RIDE_PAYMENT || type === WalletTransactionType.PENALTY) {
      if (wallet.balance + amount < 0) throw new Error('Insufficient balance');
    }

    wallet.balance += amount;
    await this.walletsRepository.save(wallet);

    const tx = this.walletTransactionRepo.create({
      wallet,
      type,
      amount,
      description,
    });
    await this.walletTransactionRepo.save(tx);

    return wallet;
  }
}