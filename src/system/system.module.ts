import { Module } from '@nestjs/common';
import { SystemConfigRepo } from './system-config.repository';

@Module({
  providers: [SystemConfigRepo],
  exports: [SystemConfigRepo],
})
export class SystemModule {}