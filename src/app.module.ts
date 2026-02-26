import { Module } from '@nestjs/common';
import { SupabaseModule } from './supabase/supabase.module';
import { RidesModule } from './rides/rides.module';

@Module({
  imports: [
    SupabaseModule,
    RidesModule,
  ],
})
export class AppModule {}