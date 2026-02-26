import { Injectable } from '@nestjs/common';

@Injectable()
export class SystemConfigRepo {
  private config = {
    use_rating_rule: true,
    commission_percentage: 15,
    dynamic_pricing_enabled: true,
    grace_wait_minutes: 5,
  };

  async get() {
    return this.config;
  }

  async set(newConfig: any) {
    this.config = { ...this.config, ...newConfig };
  }
}