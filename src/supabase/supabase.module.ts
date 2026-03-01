// src/supabase/supabase.module.ts
import { Module, Global } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';

@Global()
@Module({
  providers: [
    {
      provide: 'SUPABASE_CLIENT',
      useValue: createClient(
        'https://htawzwkztxtssvsxrzdu.supabase.co', // reemplazar con tu URL en producción si quieres
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0YXd6d2t6dHh0c3N2c3hyemR1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjA3NzAwOCwiZXhwIjoyMDg3NjUzMDA4fQ.oVBvFxFm7bmQtpMMtcgOoCsPeK7uQ5mKsKZhxane3BY' // reemplazar con tu KEY en producción
      ),
    },
  ],
  exports: ['SUPABASE_CLIENT'],
})
export class SupabaseModule {}