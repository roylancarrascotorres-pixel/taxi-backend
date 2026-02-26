// src/drivers/dto/update-driver.dto.ts
import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateDriverDto {
  @IsOptional()
  @IsString()
  @Length(7, 20)
  phone?: string; // Solo se permite actualizar el teléfono
}