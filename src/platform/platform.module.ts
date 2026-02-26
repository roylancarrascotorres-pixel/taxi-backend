import { Module } from '@nestjs/common';
import { PlatformEarningsRepo } from './platform-earnings.repository';

@Module({
  providers: [PlatformEarningsRepo],
  exports: [PlatformEarningsRepo],
})
export class PlatformModule {}