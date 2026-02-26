import { Injectable } from '@nestjs/common';

export type WalletTransaction = {
  userId: string;
  type: string;
  amount: number;
  date: Date;
};

@Injectable()
export class WalletRepo {
  private balances = new Map<string, number>();
  private transactions: WalletTransaction[] = [];

  async credit(userId: string, amount: number) {
    const current = this.balances.get(userId) || 0;
    this.balances.set(userId, current + amount);
    await this.logTransaction(userId, 'CREDIT', amount);
  }

  async debit(userId: string, amount: number) {
    const current = this.balances.get(userId) || 0;
    this.balances.set(userId, current - amount);
    await this.logTransaction(userId, 'DEBIT', amount);
  }

  async getBalance(userId: string) {
    return this.balances.get(userId) || 0;
  }

  async logTransaction(userId: string, type: string, amount: number) {
    this.transactions.push({
      userId,
      type,
      amount,
      date: new Date(),
    });
  }
}