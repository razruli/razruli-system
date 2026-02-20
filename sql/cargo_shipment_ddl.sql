-- ============================================================================
-- CARGO SHIPMENT SYSTEM - PostgreSQL DDL (CREATE TABLE statements)
-- ============================================================================
-- This is a direct PostgreSQL implementation (alternative to Prisma ORM)
-- Execute in order to set up the database schema

-- ============================================================================
-- ENUMS (PostgreSQL types for constrained values)
-- ============================================================================

CREATE TYPE carrier_authorit_type AS ENUM (
  'common_carrier',
  'contract_carrier',
  'private_carrier'
);

CREATE TYPE shipment_status AS ENUM (
  'booked',
  'confirmed',
  'in_progress',
  'in_transit',
  'delivered',
  'cancelled',
  'disputed',
  'damaged',
  'lost'
);

CREATE TYPE truck_status AS ENUM (
  'available',
  'in_maintenance',
  'in_transit',
  'out_of_service'
);

CREATE TYPE driver_status AS ENUM (
  'active',
  'inactive',
  'on_leave',
  'terminated'
);

CREATE TYPE verification_status AS ENUM (
  'pending',
  'verified',
  'rejected',
  'suspended'
);

-- ============================================================================
-- CORE PARTY TABLES
-- ============================================================================

-- BROKER TABLE
CREATE TABLE broker (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name VARCHAR(255) NOT NULL UNIQUE,
  registration_number VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20) NOT NULL,
  
  -- Address
  address VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(50) NOT NULL,
  zip_code VARCHAR(20) NOT NULL,
  country VARCHAR(100) NOT NULL DEFAULT 'US',
  
  -- Contact person
  contact_person_name VARCHAR(255) NOT NULL,
  contact_phone VARCHAR(20) NOT NULL,
  
  -- Licensing & Insurance
  license_number VARCHAR(100) NOT NULL UNIQUE,
  license_expiry_date DATE NOT NULL,
  insurance_provider VARCHAR(255) NOT NULL,
  insurance_policy_id VARCHAR(100) NOT NULL,
  insurance_expiry_date DATE NOT NULL,
  
  -- Capabilities
  operating_regions TEXT[] NOT NULL DEFAULT '{}',
  specializations TEXT[] NOT NULL DEFAULT '{}',
  
  -- Performance metrics
  rating DECIMAL(3,2) DEFAULT 5.00,
  review_count INTEGER DEFAULT 0,
  total_shipments INTEGER DEFAULT 0,
  on_time_delivery DECIMAL(5,2) DEFAULT 100.00, -- Percentage
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  verification_status verification_status DEFAULT 'pending',
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT broker_valid_rating CHECK (rating >= 1 AND rating <= 5),
  CONSTRAINT broker_valid_ontime CHECK (on_time_delivery >= 0 AND on_time_delivery <= 100)
);

-- CARRIER TABLE
CREATE TABLE carrier (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name VARCHAR(255) NOT NULL UNIQUE,
  registration_number VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20) NOT NULL,
  
  -- Address
  address VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(50) NOT NULL,
  zip_code VARCHAR(20) NOT NULL,
  country VARCHAR(100) NOT NULL DEFAULT 'US',
  
  -- Contact person
  contact_person_name VARCHAR(255) NOT NULL,
  contact_phone VARCHAR(20) NOT NULL,
  
  -- DOT/MC Numbers
  mc_number VARCHAR(100) NOT NULL UNIQUE,
  dot_number VARCHAR(100) NOT NULL UNIQUE,
  operating_authority carrier_authorit_type NOT NULL,
  
  -- License & Insurance
  license_number VARCHAR(100) NOT NULL,
  license_expiry_date DATE NOT NULL,
  insurance_provider VARCHAR(255) NOT NULL,
  insurance_policy_id VARCHAR(100) NOT NULL,
  insurance_expiry_date DATE NOT NULL,
  liability_limit BIGINT NOT NULL, -- In cents
  cargo_insurance BOOLEAN DEFAULT true,
  
  -- Fleet stats
  total_trucks INTEGER DEFAULT 0,
  total_drivers INTEGER DEFAULT 0,
  
  -- Capabilities
  fleet_types TEXT[] NOT NULL DEFAULT '{}',
  specializations TEXT[] NOT NULL DEFAULT '{}',
  average_fleet_age INTEGER, -- Years
  
  -- Performance metrics
  rating DECIMAL(3,2) DEFAULT 5.00,
  review_count INTEGER DEFAULT 0,
  total_shipments INTEGER DEFAULT 0,
  on_time_delivery DECIMAL(5,2) DEFAULT 100.00,
  damage_rate DECIMAL(5,2) DEFAULT 0.00,
  safety_score DECIMAL(5,2) DEFAULT 100.00,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  verification_status verification_status DEFAULT 'pending',
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT carrier_valid_rating CHECK (rating >= 1 AND rating <= 5),
  CONSTRAINT carrier_valid_ontime CHECK (on_time_delivery >= 0 AND on_time_delivery <= 100),
  CONSTRAINT carrier_valid_damage CHECK (damage_rate >= 0 AND damage_rate <= 100)
);

-- DRIVER TABLE
CREATE TABLE driver (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20) NOT NULL,
  date_of_birth DATE NOT NULL,
  
  -- Address
  address VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(50) NOT NULL,
  zip_code VARCHAR(20) NOT NULL,
  country VARCHAR(100) NOT NULL DEFAULT 'US',
  
  -- Identification
  drivers_license_number VARCHAR(50) NOT NULL UNIQUE,
  drivers_license_state VARCHAR(2) NOT NULL,
  drivers_license_expiry DATE NOT NULL,
  ssn VARCHAR(11), -- Encrypted in production
  
  -- Employment
  carrier_id UUID NOT NULL,
  employment_status driver_status DEFAULT 'active',
  hire_date DATE NOT NULL,
  
  -- CDL & Certifications
  years_of_experience INTEGER NOT NULL,
  cdl_class CHAR(1) NOT NULL, -- A, B, C
  endorsements TEXT[] NOT NULL DEFAULT '{}',
  medical_cert_date DATE NOT NULL,
  training_certifications TEXT[] NOT NULL DEFAULT '{}',
  
  -- Background
  background_check_date DATE,
  background_check_status verification_status DEFAULT 'pending',
  mvr TEXT, -- Motor Vehicle Record summary
  accidents_count INTEGER DEFAULT 0,
  violations_count INTEGER DEFAULT 0,
  
  -- Performance
  total_miles_driven BIGINT DEFAULT 0,
  total_shipments_completed INTEGER DEFAULT 0,
  safety_rating DECIMAL(5,2) DEFAULT 100.00,
  on_time_delivery DECIMAL(5,2) DEFAULT 100.00,
  
  -- Current assignment
  current_truck_id UUID,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  verification_status verification_status DEFAULT 'pending',
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (carrier_id) REFERENCES carrier(id) ON DELETE CASCADE,
  FOREIGN KEY (current_truck_id) REFERENCES truck(id) ON DELETE SET NULL,
  CONSTRAINT driver_age CHECK (CURRENT_DATE - date_of_birth > INTERVAL '21 years'),
  CONSTRAINT driver_valid_safety CHECK (safety_rating >= 0 AND safety_rating <= 100)
);

-- FREIGHT OWNER TABLE
CREATE TABLE freight_owner (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20) NOT NULL,
  
  -- Address
  address VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(50) NOT NULL,
  zip_code VARCHAR(20) NOT NULL,
  country VARCHAR(100) NOT NULL DEFAULT 'US',
  
  -- Contact person
  contact_person_name VARCHAR(255) NOT NULL,
  contact_phone VARCHAR(20) NOT NULL,
  
  -- Business info
  tax_id VARCHAR(50) UNIQUE,
  business_type VARCHAR(100) NOT NULL, -- Manufacturer, Distributor, etc.
  
  -- Compliance
  hazmat_approved BOOLEAN DEFAULT false,
  international_shipping BOOLEAN DEFAULT false,
  
  -- Ratings
  rating DECIMAL(3,2) DEFAULT 5.00,
  review_count INTEGER DEFAULT 0,
  total_shipments INTEGER DEFAULT 0,
  
  -- Payment
  preferred_payment_method VARCHAR(50),
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  verification_status verification_status DEFAULT 'pending',
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT owner_valid_rating CHECK (rating >= 1 AND rating <= 5)
);

-- WAREHOUSE TABLE
CREATE TABLE warehouse (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  code VARCHAR(20) NOT NULL UNIQUE,
  type VARCHAR(100) NOT NULL, -- Distribution Center, Private, Cross-dock, Bonded
  
  -- Location
  address VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(50) NOT NULL,
  zip_code VARCHAR(20) NOT NULL,
  country VARCHAR(100) NOT NULL DEFAULT 'US',
  latitude DECIMAL(10,8) NOT NULL,
  longitude DECIMAL(11,8) NOT NULL,
  
  -- Contact
  manager_name VARCHAR(255) NOT NULL,
  manager_email VARCHAR(255) NOT NULL,
  manager_phone VARCHAR(20) NOT NULL,
  
  -- Capacity
  total_capacity_m3 BIGINT NOT NULL, -- Cubic meters
  total_capacity_kg BIGINT NOT NULL, -- Kilograms
  used_capacity_m3 BIGINT DEFAULT 0,
  used_capacity_kg BIGINT DEFAULT 0,
  
  -- Features
  loading_docks INTEGER DEFAULT 0,
  has_refrigeration BOOLEAN DEFAULT false,
  has_hazmat_storage BOOLEAN DEFAULT false,
  has_security_cameras BOOLEAN DEFAULT true,
  operating_hours VARCHAR(50) NOT NULL DEFAULT '9AM-5PM',
  
  -- Equipment
  equipment TEXT[] NOT NULL DEFAULT '{}',
  certifications TEXT[] NOT NULL DEFAULT '{}',
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT warehouse_valid_capacity CHECK (used_capacity_m3 <= total_capacity_m3),
  CONSTRAINT warehouse_valid_weight CHECK (used_capacity_kg <= total_capacity_kg)
);

-- ============================================================================
-- MAIN OBJECTS TABLES
-- ============================================================================

-- TRUCK TABLE
CREATE TABLE truck (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  carrier_id UUID NOT NULL,
  
  -- Identification
  license_plate VARCHAR(20) NOT NULL UNIQUE,
  vin VARCHAR(17) NOT NULL UNIQUE,
  tractor_number VARCHAR(50) NOT NULL UNIQUE,
  trailer_number VARCHAR(50) UNIQUE,
  
  -- Specifications
  make VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  year INTEGER NOT NULL,
  colors VARCHAR(100),
  trailer_type VARCHAR(100) NOT NULL,
  
  -- Capacity
  max_weight_capacity BIGINT NOT NULL, -- kg
  max_volume_capacity DECIMAL(10,3) NOT NULL, -- m3
  
  -- Condition
  mileage BIGINT NOT NULL DEFAULT 0,
  next_maintenance_date DATE,
  last_inspection_date DATE,
  inspection_status VARCHAR(20) DEFAULT 'pass',
  
  -- Certifications
  registration_expiry DATE NOT NULL,
  safety_inspection_date DATE NOT NULL,
  safety_inspection_expiry DATE NOT NULL,
  
  -- Features
  has_gps BOOLEAN DEFAULT true,
  has_temperature_control BOOLEAN DEFAULT false,
  has_lift_gate BOOLEAN DEFAULT false,
  has_side_awning BOOLEAN DEFAULT false,
  has_secure_storage BOOLEAN DEFAULT false,
  
  -- Status & Location
  status truck_status DEFAULT 'available',
  current_driver_id UUID,
  last_known_location VARCHAR(255),
  last_location_update TIMESTAMP,
  
  -- Financial
  purchase_date DATE NOT NULL,
  purchase_price BIGINT NOT NULL, -- cents
  insurance_cost BIGINT DEFAULT 0, -- Annual, cents
  
  -- Lifecycle
  is_active BOOLEAN DEFAULT true,
  retirement_date DATE,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (carrier_id) REFERENCES carrier(id) ON DELETE CASCADE,
  FOREIGN KEY (current_driver_id) REFERENCES driver(id) ON DELETE SET NULL,
  CONSTRAINT truck_valid_year CHECK (year >= 1990 AND year <= EXTRACT(YEAR FROM CURRENT_DATE))
);

-- FREIGHT TABLE
CREATE TABLE freight (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  freight_owner_id UUID NOT NULL,
  
  -- Identification
  freight_number VARCHAR(50) NOT NULL UNIQUE,
  
  -- Product
  product_name VARCHAR(255) NOT NULL,
  product_description TEXT,
  product_type VARCHAR(100) NOT NULL,
  hs_code VARCHAR(20),
  
  -- Dimensions & Weight
  unit_type VARCHAR(50) DEFAULT 'pieces',
  quantity INTEGER NOT NULL,
  unit_weight DECIMAL(10,3) NOT NULL, -- kg
  total_weight DECIMAL(12,3) NOT NULL, -- kg
  length DECIMAL(10,3), -- cm
  width DECIMAL(10,3), -- cm
  height DECIMAL(10,3), -- cm
  volume DECIMAL(12,3) NOT NULL, -- m3
  
  -- Special properties
  is_hazmat BOOLEAN DEFAULT false,
  hazmat_class VARCHAR(5),
  hazmat_un_number VARCHAR(10),
  hazmat_description TEXT,
  
  is_fragile BOOLEAN DEFAULT false,
  is_perishable BOOLEAN DEFAULT false,
  temperature_min DECIMAL(5,2),
  temperature_max DECIMAL(5,2),
  
  is_valuable BOOLEAN DEFAULT false,
  declared_value BIGINT, -- cents
  
  requires_handling TEXT[] DEFAULT '{}',
  
  -- Storage
  current_warehouse_id UUID,
  storage_start_date TIMESTAMP,
  storage_end_date TIMESTAMP,
  
  -- Status
  status VARCHAR(50) DEFAULT 'pending_shipment',
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (freight_owner_id) REFERENCES freight_owner(id) ON DELETE CASCADE,
  FOREIGN KEY (current_warehouse_id) REFERENCES warehouse(id) ON DELETE SET NULL,
  CONSTRAINT freight_valid_qty CHECK (quantity > 0),
  CONSTRAINT freight_valid_weight CHECK (unit_weight > 0 AND total_weight > 0),
  CONSTRAINT freight_valid_volume CHECK (volume > 0)
);

-- SHIPMENT TABLE (THE MAIN ORCHESTRATION TABLE)
CREATE TABLE shipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_number VARCHAR(50) NOT NULL UNIQUE,
  
  -- Parties
  freight_owner_id UUID NOT NULL,
  broker_id UUID NOT NULL,
  carrier_id UUID NOT NULL,
  driver_id UUID,
  truck_id UUID,
  
  -- Route
  origin_warehouse_id UUID NOT NULL,
  destination_warehouse_id UUID NOT NULL,
  
  origin_address VARCHAR(255) NOT NULL,
  origin_city VARCHAR(100) NOT NULL,
  origin_state VARCHAR(50) NOT NULL,
  
  destination_address VARCHAR(255) NOT NULL,
  destination_city VARCHAR(100) NOT NULL,
  destination_state VARCHAR(50) NOT NULL,
  
  -- Timing
  pickup_scheduled_date TIMESTAMP NOT NULL,
  pickup_actual_date TIMESTAMP,
  delivery_scheduled_date TIMESTAMP NOT NULL,
  delivery_actual_date TIMESTAMP,
  
  -- Freight summary
  total_pieces INTEGER NOT NULL,
  total_weight DECIMAL(12,3) NOT NULL, -- kg
  total_volume DECIMAL(12,3) NOT NULL, -- m3
  total_value BIGINT NOT NULL, -- cents
  
  -- Pricing
  broker_rate BIGINT NOT NULL, -- cents
  carrier_rate BIGINT NOT NULL, -- cents
  broker_profit BIGINT GENERATED ALWAYS AS (broker_rate - carrier_rate) STORED,
  
  -- Charges
  accessorials TEXT[] DEFAULT '{}',
  accessorial_cost BIGINT DEFAULT 0,
  
  insurance_value BIGINT,
  insurance_cost BIGINT DEFAULT 0,
  
  total_revenue BIGINT NOT NULL,
  total_cost BIGINT NOT NULL,
  
  -- Status & Tracking
  status shipment_status DEFAULT 'booked',
  current_location VARCHAR(255),
  tracking_number VARCHAR(50) UNIQUE,
  bol VARCHAR(100), -- Bill of Lading reference
  proof_of_delivery VARCHAR(255),
  
  -- Quality
  delivery_success BOOLEAN,
  damage_reported BOOLEAN DEFAULT false,
  damage_description TEXT,
  delay_reason TEXT,
  
  -- Notes
  special_instructions TEXT,
  internal_notes TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (freight_owner_id) REFERENCES freight_owner(id) ON DELETE RESTRICT,
  FOREIGN KEY (broker_id) REFERENCES broker(id) ON DELETE RESTRICT,
  FOREIGN KEY (carrier_id) REFERENCES carrier(id) ON DELETE RESTRICT,
  FOREIGN KEY (driver_id) REFERENCES driver(id) ON DELETE SET NULL,
  FOREIGN KEY (truck_id) REFERENCES truck(id) ON DELETE SET NULL,
  FOREIGN KEY (origin_warehouse_id) REFERENCES warehouse(id) ON DELETE RESTRICT,
  FOREIGN KEY (destination_warehouse_id) REFERENCES warehouse(id) ON DELETE RESTRICT,
  
  CONSTRAINT shipment_valid_pricing CHECK (broker_rate > 0 AND carrier_rate > 0),
  CONSTRAINT shipment_valid_weight CHECK (total_weight > 0),
  CONSTRAINT shipment_valid_volume CHECK (total_volume > 0)
);

-- ============================================================================
-- JUNCTION & SUPPORTING TABLES
-- ============================================================================

-- SHIPMENT_FREIGHT bridge table
CREATE TABLE shipment_freight (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id UUID NOT NULL,
  freight_id UUID NOT NULL,
  
  quantity INTEGER NOT NULL,
  weight DECIMAL(12,3) NOT NULL,
  volume DECIMAL(12,3) NOT NULL,
  
  FOREIGN KEY (shipment_id) REFERENCES shipment(id) ON DELETE CASCADE,
  FOREIGN KEY (freight_id) REFERENCES freight(id) ON DELETE CASCADE,
  UNIQUE(shipment_id, freight_id)
);

-- SHIPMENT_STOP table
CREATE TABLE shipment_stop (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id UUID NOT NULL,
  
  stop_sequence INTEGER NOT NULL,
  stop_type VARCHAR(50) NOT NULL, -- pickup, dropoff, consolidation
  
  address VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(50) NOT NULL,
  zip_code VARCHAR(20) NOT NULL,
  
  scheduled_arrival TIMESTAMP,
  actual_arrival TIMESTAMP,
  scheduled_departure TIMESTAMP,
  actual_departure TIMESTAMP,
  
  instruction TEXT,
  contact_name VARCHAR(255),
  contact_phone VARCHAR(20),
  
  FOREIGN KEY (shipment_id) REFERENCES shipment(id) ON DELETE CASCADE
);

-- SHIPMENT_LOG table (audit trail)
CREATE TABLE shipment_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id UUID NOT NULL,
  
  event_type VARCHAR(100) NOT NULL,
  location VARCHAR(255),
  notes TEXT,
  created_by VARCHAR(255),
  
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (shipment_id) REFERENCES shipment(id) ON DELETE CASCADE
);

-- SHIPMENT_EVENT table (tracking)
CREATE TABLE shipment_event (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id UUID NOT NULL,
  
  event_name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) NOT NULL,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (shipment_id) REFERENCES shipment(id) ON DELETE CASCADE
);

-- SHIPMENT_DOCUMENT table
CREATE TABLE shipment_document (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id UUID NOT NULL,
  
  document_type VARCHAR(50) NOT NULL, -- bol, pod, invoice
  document_url VARCHAR(500) NOT NULL,
  document_name VARCHAR(255) NOT NULL,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  uploaded_by VARCHAR(255),
  
  FOREIGN KEY (shipment_id) REFERENCES shipment(id) ON DELETE CASCADE
);

-- BROKER_CARRIER_CONTRACT table
CREATE TABLE broker_carrier_contract (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  broker_id UUID NOT NULL,
  carrier_id UUID NOT NULL,
  
  contract_number VARCHAR(100) NOT NULL UNIQUE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  
  -- Terms
  base_rate BIGINT NOT NULL, -- cents
  rate_unit VARCHAR(50) NOT NULL, -- per_mile, per_shipment
  payment_terms VARCHAR(50) NOT NULL, -- Net 30, Net 60
  min_shipments_monthly INTEGER,
  
  -- Scope
  lanes TEXT[] DEFAULT '{}',
  equipment_types TEXT[] DEFAULT '{}',
  service_types TEXT[] DEFAULT '{}',
  
  status VARCHAR(50) DEFAULT 'active',
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (broker_id) REFERENCES broker(id) ON DELETE CASCADE,
  FOREIGN KEY (carrier_id) REFERENCES carrier(id) ON DELETE CASCADE,
  UNIQUE(broker_id, carrier_id)
);

-- BROKER_RATE table
CREATE TABLE broker_rate (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  broker_id UUID NOT NULL,
  
  lane_origin VARCHAR(100) NOT NULL,
  lane_destination VARCHAR(100) NOT NULL,
  equipment_type VARCHAR(100) NOT NULL,
  freight_type VARCHAR(100),
  
  base_rate BIGINT NOT NULL,
  min_charge_rate BIGINT NOT NULL,
  rate_unit VARCHAR(50) DEFAULT 'per_mile',
  
  effective_from DATE NOT NULL,
  effective_to DATE,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (broker_id) REFERENCES broker(id) ON DELETE CASCADE
);

-- CARRIER_RATE table
CREATE TABLE carrier_rate (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  carrier_id UUID NOT NULL,
  
  lane_origin VARCHAR(100) NOT NULL,
  lane_destination VARCHAR(100) NOT NULL,
  equipment_type VARCHAR(100) NOT NULL,
  
  base_rate BIGINT NOT NULL,
  min_charge_rate BIGINT NOT NULL,
  rate_unit VARCHAR(50) DEFAULT 'per_mile',
  
  effective_from DATE NOT NULL,
  effective_to DATE,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (carrier_id) REFERENCES carrier(id) ON DELETE CASCADE
);

-- CARRIER_ACCESSORIAL table
CREATE TABLE carrier_accessorial (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  carrier_id UUID NOT NULL,
  
  service_code VARCHAR(20) NOT NULL UNIQUE,
  service_name VARCHAR(255) NOT NULL,
  description TEXT,
  
  base_charge BIGINT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (carrier_id) REFERENCES carrier(id) ON DELETE CASCADE
);

-- TRUCK_MAINTENANCE table
CREATE TABLE truck_maintenance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  truck_id UUID NOT NULL,
  
  service_date DATE NOT NULL,
  service_type VARCHAR(100) NOT NULL,
  description TEXT,
  cost BIGINT NOT NULL, -- cents
  
  next_service_due DATE,
  next_service_miles BIGINT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (truck_id) REFERENCES truck(id) ON DELETE CASCADE
);

-- TRUCK_INSPECTION table
CREATE TABLE truck_inspection (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  truck_id UUID NOT NULL,
  
  inspection_date DATE NOT NULL,
  inspection_type VARCHAR(50) NOT NULL,
  inspector_name VARCHAR(255) NOT NULL,
  
  status VARCHAR(20) DEFAULT 'pass',
  findings TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (truck_id) REFERENCES truck(id) ON DELETE CASCADE
);

-- TRUCK_VIOLATION table
CREATE TABLE truck_violation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  truck_id UUID NOT NULL,
  
  violation_date DATE NOT NULL,
  violation_type VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  severity VARCHAR(50) DEFAULT 'minor',
  
  fine BIGINT, -- cents
  status VARCHAR(50) DEFAULT 'open',
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (truck_id) REFERENCES truck(id) ON DELETE CASCADE
);

-- DRIVER_VIOLATION table
CREATE TABLE driver_violation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID NOT NULL,
  
  violation_date DATE NOT NULL,
  violation_type VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  severity VARCHAR(50) DEFAULT 'minor',
  
  location VARCHAR(255),
  fine BIGINT, -- cents
  status VARCHAR(50) DEFAULT 'open',
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (driver_id) REFERENCES driver(id) ON DELETE CASCADE
);

-- DRIVER_INCIDENT table
CREATE TABLE driver_incident (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID NOT NULL,
  
  incident_date DATE NOT NULL,
  incident_description TEXT NOT NULL,
  severity VARCHAR(50) NOT NULL,
  
  injuries_reported BOOLEAN DEFAULT false,
  property_damage BIGINT, -- cents
  
  reported_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) DEFAULT 'under_investigation',
  resolution TEXT,
  
  FOREIGN KEY (driver_id) REFERENCES driver(id) ON DELETE CASCADE
);

-- REVIEW table
CREATE TABLE review (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  broker_id UUID,
  carrier_id UUID,
  
  reviewer_id VARCHAR(255) NOT NULL,
  reviewer_type VARCHAR(50) NOT NULL,
  
  rating INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  comment TEXT,
  
  categories JSONB,
  is_verified BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (broker_id) REFERENCES broker(id) ON DELETE CASCADE,
  FOREIGN KEY (carrier_id) REFERENCES carrier(id) ON DELETE CASCADE,
  CONSTRAINT review_valid_rating CHECK (rating >= 1 AND rating <= 5)
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Shipment indexes
CREATE INDEX idx_shipment_number ON shipment(shipment_number);
CREATE INDEX idx_shipment_status ON shipment(status);
CREATE INDEX idx_shipment_carrier ON shipment(carrier_id);
CREATE INDEX idx_shipment_broker ON shipment(broker_id);
CREATE INDEX idx_shipment_driver ON shipment(driver_id);
CREATE INDEX idx_shipment_freight_owner ON shipment(freight_owner_id);
CREATE INDEX idx_shipment_truck ON shipment(truck_id);
CREATE INDEX idx_shipment_created ON shipment(created_at);
CREATE INDEX idx_shipment_delivery_date ON shipment(delivery_scheduled_date);

-- Truck indexes
CREATE INDEX idx_truck_carrier ON truck(carrier_id);
CREATE INDEX idx_truck_status ON truck(status);
CREATE INDEX idx_truck_license_plate ON truck(license_plate);
CREATE INDEX idx_truck_current_driver ON truck(current_driver_id);

-- Driver indexes
CREATE INDEX idx_driver_carrier ON driver(carrier_id);
CREATE INDEX idx_driver_status ON driver(employment_status);
CREATE INDEX idx_driver_current_truck ON driver(current_truck_id);
CREATE INDEX idx_driver_license ON driver(drivers_license_number);

-- Freight indexes
CREATE INDEX idx_freight_owner ON freight(freight_owner_id);
CREATE INDEX idx_freight_warehouse ON freight(current_warehouse_id);
CREATE INDEX idx_freight_hazmat ON freight(is_hazmat);
CREATE INDEX idx_freight_status ON freight(status);

-- Warehouse indexes
CREATE INDEX idx_warehouse_code ON warehouse(code);
CREATE INDEX idx_warehouse_city ON warehouse(city);

-- Broker/Carrier indexes
CREATE INDEX idx_broker_verification ON broker(verification_status);
CREATE INDEX idx_carrier_verification ON carrier(verification_status);

-- ============================================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================================

-- Active shipments
CREATE VIEW v_active_shipments AS
SELECT s.*, 
       c.company_name as carrier_name,
       d.first_name, d.last_name,
       t.license_plate,
       f.company_name as freight_owner_name
FROM shipment s
LEFT JOIN carrier c ON s.carrier_id = c.id
LEFT JOIN driver d ON s.driver_id = d.id
LEFT JOIN truck t ON s.truck_id = t.id
LEFT JOIN freight_owner f ON s.freight_owner_id = f.id
WHERE s.status IN ('booked', 'confirmed', 'in_progress', 'in_transit');

-- Carrier performance
CREATE VIEW v_carrier_performance AS
SELECT 
  c.id,
  c.company_name,
  COUNT(s.id) as total_shipments,
  COUNT(s.id) FILTER (WHERE s.delivery_actual_date <= s.delivery_scheduled_date) as on_time_shipments,
  ROUND(100.0 * COUNT(s.id) FILTER (WHERE s.delivery_actual_date <= s.delivery_scheduled_date) / NULLIF(COUNT(s.id), 0), 2) as on_time_percentage,
  COUNT(s.id) FILTER (WHERE s.damage_reported = true) as damage_count,
  ROUND(100.0 * COUNT(s.id) FILTER (WHERE s.damage_reported = true) / NULLIF(COUNT(s.id), 0), 2) as damage_percentage,
  AVG(CAST(s.broker_rate - s.carrier_rate AS FLOAT)) as avg_broker_profit,
  SUM(s.carrier_rate) as total_carrier_revenue
FROM carrier c
LEFT JOIN shipment s ON c.id = s.carrier_id AND s.status = 'delivered'
GROUP BY c.id, c.company_name;

-- Driver performance
CREATE VIEW v_driver_performance AS
SELECT
  d.id,
  d.first_name,
  d.last_name,
  d.carrier_id,
  COUNT(s.id) as total_shipments,
  COUNT(s.id) FILTER (WHERE s.delivery_actual_date <= s.delivery_scheduled_date) as on_time_shipments,
  ROUND(100.0 * COUNT(s.id) FILTER (WHERE s.delivery_actual_date <= s.delivery_scheduled_date) / NULLIF(COUNT(s.id), 0), 2) as on_time_percentage,
  COUNT(s.id) FILTER (WHERE s.damage_reported = true) as damages,
  d.violations_count,
  d.accidents_count
FROM driver d
LEFT JOIN shipment s ON d.id = s.driver_id AND s.status = 'delivered'
GROUP BY d.id, d.first_name, d.last_name, d.carrier_id, d.violations_count, d.accidents_count;

-- ============================================================================
-- SAMPLE DATA INSERTS (OPTIONAL - for testing)
-- ============================================================================

-- You can add sample data here for testing purposes
-- Example usage would go here...
