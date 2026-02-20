// ============================================================================
// SHIPMENT FREIGHT JUNCTION
// ============================================================================

export interface ShipmentFreightResponse {
  id: string;
  shipmentId: string;
  freightId: string;
  sequenceNumber: number;
  pickedUpAt: Date | null;
  deliveredAt: Date | null;
}

export interface CreateShipmentFreightInput {
  shipmentId: string;
  freightId: string;
  sequenceNumber: number;
  pickedUpAt?: Date;
  deliveredAt?: Date;
}

export interface UpdateShipmentFreightInput {
  sequenceNumber?: number;
  pickedUpAt?: Date;
  deliveredAt?: Date;
}

export interface ShipmentFreightFilters {
  shipmentId?: string;
  freightId?: string;
}

// ============================================================================
// SHIPMENT STOP
// ============================================================================

export interface ShipmentStopResponse {
  id: string;
  shipmentId: string;
  sequenceNumber: number;
  stopType: string;
  warehouseId: string | null;
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  arrivedAt: Date | null;
  departedAt: Date | null;
  duration: number | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateShipmentStopInput {
  shipmentId: string;
  sequenceNumber: number;
  stopType?: string;
  warehouseId?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  arrivedAt?: Date;
  departedAt?: Date;
  duration?: number;
  notes?: string;
}

export interface UpdateShipmentStopInput {
  sequenceNumber?: number;
  stopType?: string;
  warehouseId?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  arrivedAt?: Date;
  departedAt?: Date;
  duration?: number;
  notes?: string;
}

export interface ShipmentStopFilters {
  shipmentId?: string;
  stopType?: string;
  warehouseId?: string;
}

// ============================================================================
// SHIPMENT LOG (EVENT TRACKING)
// ============================================================================

export interface ShipmentLogResponse {
  id: string;
  shipmentId: string;
  eventType: string;
  eventTime: Date;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  mileage: number | null;
  fuelLevel: string | null;
  temperature: number | null;
  humidity: number | null;
  deviceId: string | null;
  notes: string | null;
  createdAt: Date;
}

export interface CreateShipmentLogInput {
  shipmentId: string;
  eventType: string;
  eventTime: Date;
  location?: string;
  latitude?: number;
  longitude?: number;
  mileage?: number;
  fuelLevel?: string;
  temperature?: number;
  humidity?: number;
  deviceId?: string;
  notes?: string;
}

export interface UpdateShipmentLogInput {
  eventType?: string;
  eventTime?: Date;
  location?: string;
  latitude?: number;
  longitude?: number;
  mileage?: number;
  fuelLevel?: string;
  temperature?: number;
  humidity?: number;
  deviceId?: string;
  notes?: string;
}

export interface ShipmentLogFilters {
  shipmentId?: string;
  eventType?: string;
  startTime?: Date;
  endTime?: Date;
}

// ============================================================================
// SHIPMENT EVENT
// ============================================================================

export interface ShipmentEventResponse {
  id: string;
  shipmentId: string;
  eventCode: string;
  eventDescription: string;
  eventTime: Date;
  severity: string;
  requiresAction: boolean;
  actionTaken: string | null;
  actionDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateShipmentEventInput {
  shipmentId: string;
  eventCode: string;
  eventDescription: string;
  eventTime: Date;
  severity?: string;
  requiresAction?: boolean;
  actionTaken?: string;
  actionDate?: Date;
}

export interface UpdateShipmentEventInput {
  eventCode?: string;
  eventDescription?: string;
  eventTime?: Date;
  severity?: string;
  requiresAction?: boolean;
  actionTaken?: string;
  actionDate?: Date;
}

export interface ShipmentEventFilters {
  shipmentId?: string;
  eventCode?: string;
  severity?: string;
  requiresAction?: boolean;
}

// ============================================================================
// SHIPMENT DOCUMENT
// ============================================================================

export interface ShipmentDocumentResponse {
  id: string;
  shipmentId: string;
  documentType: string;
  documentNumber: string | null;
  fileName: string;
  fileUrl: string;
  fileSize: number | null;
  uploadedAt: Date;
  expiresAt: Date | null;
  issueDate: Date | null;
  expiryDate: Date | null;
  verified: boolean;
  verifiedAt: Date | null;
  verifiedBy: string | null;
}

export interface CreateShipmentDocumentInput {
  shipmentId: string;
  documentType: string;
  documentNumber?: string;
  fileName: string;
  fileUrl: string;
  fileSize?: number;
  uploadedAt?: Date;
  expiresAt?: Date;
  issueDate?: Date;
  expiryDate?: Date;
  verified?: boolean;
  verifiedAt?: Date;
  verifiedBy?: string;
}

export interface UpdateShipmentDocumentInput {
  documentType?: string;
  documentNumber?: string;
  fileName?: string;
  fileUrl?: string;
  fileSize?: number;
  expiresAt?: Date;
  issueDate?: Date;
  expiryDate?: Date;
  verified?: boolean;
  verifiedAt?: Date;
  verifiedBy?: string;
}

export interface ShipmentDocumentFilters {
  shipmentId?: string;
  documentType?: string;
  verified?: boolean;
}
