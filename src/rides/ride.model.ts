export enum RideStatus {
  REQUESTED = 'REQUESTED',
  DRIVER_ASSIGNED = 'DRIVER_ASSIGNED',
  DRIVER_ARRIVED = 'DRIVER_ARRIVED',
  TRIP_STARTED = 'TRIP_STARTED',
  TRIP_COMPLETED = 'TRIP_COMPLETED',
  CANCELLED = 'CANCELLED'
}

export class RideModel {
  id!: number;
  clientId!: number;
  driverId!: number;
  vehicleTypeId!: number;
  pickupLat!: number;
  pickupLng!: number;
  dropLat!: number;
  dropLng!: number;
  price!: number;
  status!: RideStatus;
  createdAt!: Date;
}