// src/rides/rides.module.ts
import { Module } from '@nestjs/common';
import { RidesService } from './rides.service';
import { RidesController } from './rides.controller';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  controllers: [RidesController],
  providers: [RidesService],
})
export class RidesModule {}