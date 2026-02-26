import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class RidesService {
  constructor(
    @Inject('SUPABASE_CLIENT')
    private readonly supabase: SupabaseClient,
  ) {}

  async getAllRides() {
    const { data, error } = await this.supabase
      .from('rides')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  }

  async createRide(payload: any) {
    const { data, error } = await this.supabase
      .from('rides')
      .insert([payload])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async completeRide(id: string) {
    const { data, error } = await this.supabase
      .from('rides')
      .update({ status: 'completed' })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async deleteRide(id: string) {
    const { error } = await this.supabase
      .from('rides')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);

    return { message: 'Ride eliminado' };
  }
}