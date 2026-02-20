export interface CreateVehicleInput {
  carrierI: string;
  vin: string;
  licensePlate: string;
  make: string;
  model: string;
  year: number;
  capacity: number;
  status?: string;
}

export interface UpdateVehicleInput {
  status?: string;
  capacity?: number;
  currentDriverId?: string | null;
}

export interface VehicleResponse {
  id: string;
  carrierId: string;
  vin: string;
  licensePlate: string;
  make: string;
  model: string;
  year: number;
  capacity: number;
  status: string;
  currentDriverId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
