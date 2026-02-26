// src/supabase/supabase.module.ts
import { Module, Global } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';

@Global()
@Module({
  providers: [
    {
      provide: 'SUPABASE_CLIENT',
      useValue: createClient(
        'https://YOUR_PROJECT_REF.supabase.co', // tu URL de Supabase
        'YOUR_ANON_KEY' // tu anon/public key o service key segura
      ),
    },
  ],
  exports: ['SUPABASE_CLIENT'],
})
export class SupabaseModule {}