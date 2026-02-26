import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class RidesService {
  constructor(
    @Inject('SUPABASE_CLIENT')
    private readonly supabase: SupabaseClient,
  ) {}

  // 🔹 Obtener todos los rides
  async getAllRides() {
    const { data, error } = await this.supabase
      .from('rides')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  // 🔹 Obtener ride por ID
  async getRideById(id: string) {
    const { data, error } = await this.supabase
      .from('rides')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      throw new NotFoundException('Ride no encontrado');
    }

    return data;
  }

  // 🔹 Crear ride
  async createRide(payload: any) {
    const { data, error } = await this.supabase
      .from('rides')
      .insert([payload])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  // 🔹 Completar ride
  async completeRide(id: string) {
    const { data, error } = await this.supabase
      .from('rides')
      .update({ status: 'completed' })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  // 🔹 Eliminar ride
  async deleteRide(id: string) {
    const { error } = await this.supabase
      .from('rides')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }

    return { message: 'Ride eliminado correctamente' };
  }
}