-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('pending', 'verified', 'rejected', 'suspended');

-- CreateEnum
CREATE TYPE "CarrierAuthorityType" AS ENUM ('common_carrier', 'contract_carrier', 'private_carrier');

-- CreateEnum
CREATE TYPE "ShipmentStatus" AS ENUM ('quoted', 'booked', 'confirmed', 'in_progress', 'in_transit', 'delivered', 'cancelled', 'disputed', 'damaged', 'lost');

-- CreateEnum
CREATE TYPE "TruckStatus" AS ENUM ('available', 'in_maintenance', 'in_transit', 'out_of_service');

-- CreateEnum
CREATE TYPE "DriverStatus" AS ENUM ('active', 'inactive', 'on_leave', 'terminated');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Freight" (
    "id" TEXT NOT NULL,
    "freightOwnerId" TEXT NOT NULL,
    "freightNumber" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "productDescription" TEXT,
    "productType" TEXT NOT NULL,
    "hsCode" TEXT,
    "unitType" TEXT NOT NULL DEFAULT 'pieces',
    "quantity" INTEGER NOT NULL,
    "unitWeight" DOUBLE PRECISION NOT NULL,
    "totalWeight" DOUBLE PRECISION NOT NULL,
    "length" DOUBLE PRECISION,
    "width" DOUBLE PRECISION,
    "height" DOUBLE PRECISION,
    "volume" DOUBLE PRECISION NOT NULL,
    "isHazmat" BOOLEAN NOT NULL DEFAULT false,
    "hazmatClass" TEXT,
    "hazmatUNNumber" TEXT,
    "hazmatDescription" TEXT,
    "isFragile" BOOLEAN NOT NULL DEFAULT false,
    "isPerishable" BOOLEAN NOT NULL DEFAULT false,
    "temperatureMin" DOUBLE PRECISION,
    "temperatureMax" DOUBLE PRECISION,
    "isValueable" BOOLEAN NOT NULL DEFAULT false,
    "declaredValue" BIGINT,
    "requiresHandling" TEXT[],
    "currentWarehouseId" TEXT,
    "storageStartDate" TIMESTAMP(3),
    "storageEndDate" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'pending_shipment',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Freight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shipment" (
    "id" TEXT NOT NULL,
    "shipmentNumber" TEXT NOT NULL,
    "freightOwnerId" TEXT NOT NULL,
    "brokerId" TEXT NOT NULL,
    "carrierId" TEXT NOT NULL,
    "driverId" TEXT,
    "truckId" TEXT,
    "originWarehouseId" TEXT NOT NULL,
    "destinationWarehouseId" TEXT NOT NULL,
    "pickupScheduled" TIMESTAMP(3) NOT NULL,
    "pickupActual" TIMESTAMP(3),
    "deliveryScheduled" TIMESTAMP(3) NOT NULL,
    "deliveryActual" TIMESTAMP(3),
    "status" "ShipmentStatus" NOT NULL DEFAULT 'quoted',
    "baseRate" BIGINT NOT NULL,
    "surchargeRate" BIGINT NOT NULL DEFAULT 0,
    "fuelSurcharge" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "fuelSurchargeAmount" BIGINT NOT NULL DEFAULT 0,
    "marketAdjustment" BIGINT NOT NULL DEFAULT 0,
    "customerRate" BIGINT NOT NULL,
    "brokerRate" BIGINT NOT NULL,
    "carrierRate" BIGINT NOT NULL,
    "estimatedRevenue" BIGINT NOT NULL,
    "estimatedCost" BIGINT NOT NULL,
    "estimatedMargin" BIGINT NOT NULL,
    "actualRevenue" BIGINT,
    "actualCost" BIGINT,
    "actualMargin" BIGINT,
    "distance" DOUBLE PRECISION,
    "estimatedOD" DOUBLE PRECISION,
    "actualOD" DOUBLE PRECISION,
    "poNumber" TEXT,
    "referenceNumbers" TEXT[],
    "specialInstructions" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "confirmedAt" TIMESTAMP(3),
    "pickedUpAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),

    CONSTRAINT "Shipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Truck" (
    "id" TEXT NOT NULL,
    "carrierId" TEXT NOT NULL,
    "licensePlate" TEXT NOT NULL,
    "vin" TEXT NOT NULL,
    "tractorNumber" TEXT NOT NULL,
    "trailerNumber" TEXT,
    "trailerType" TEXT NOT NULL,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "colors" TEXT,
    "maxWeightCapacity" BIGINT NOT NULL,
    "maxVolumeCapacity" DOUBLE PRECISION NOT NULL,
    "mileage" BIGINT NOT NULL,
    "nextMaintenanceDate" TIMESTAMP(3),
    "lastInspectionDate" TIMESTAMP(3),
    "inspectionStatus" TEXT NOT NULL DEFAULT 'pass',
    "registrationExpiry" TIMESTAMP(3) NOT NULL,
    "safetyInspectionDate" TIMESTAMP(3) NOT NULL,
    "safetyInspectionExpiry" TIMESTAMP(3) NOT NULL,
    "hasGPS" BOOLEAN NOT NULL DEFAULT true,
    "hasTemperatureControl" BOOLEAN NOT NULL DEFAULT false,
    "hasLiftGate" BOOLEAN NOT NULL DEFAULT false,
    "hasSideAwning" BOOLEAN NOT NULL DEFAULT false,
    "hasSecureStorage" BOOLEAN NOT NULL DEFAULT false,
    "status" "TruckStatus" NOT NULL DEFAULT 'available',
    "currentDriverId" TEXT,
    "lastKnownLocation" TEXT,
    "lastLocationUpdate" TIMESTAMP(3),
    "purchaseDate" TIMESTAMP(3) NOT NULL,
    "purchasePrice" BIGINT NOT NULL,
    "insuranceCost" BIGINT NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "retirementDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Truck_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Warehouse" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'US',
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "managerName" TEXT NOT NULL,
    "managerEmail" TEXT NOT NULL,
    "managerPhone" TEXT NOT NULL,
    "totalCapacityM3" BIGINT NOT NULL,
    "totalCapacityKg" BIGINT NOT NULL,
    "usedCapacityM3" BIGINT NOT NULL DEFAULT 0,
    "usedCapacityKg" BIGINT NOT NULL DEFAULT 0,
    "hasLoadingDocks" INTEGER NOT NULL DEFAULT 0,
    "hasRefrigeration" BOOLEAN NOT NULL DEFAULT false,
    "hasHazmatStorage" BOOLEAN NOT NULL DEFAULT false,
    "hasSecurityCameras" BOOLEAN NOT NULL DEFAULT true,
    "operatingHours" TEXT NOT NULL,
    "equipment" TEXT[],
    "certifications" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Warehouse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Broker" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "registrationNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'US',
    "contactPersonName" TEXT NOT NULL,
    "contactPhone" TEXT NOT NULL,
    "licenseNumber" TEXT NOT NULL,
    "licenseExpiryDate" TIMESTAMP(3) NOT NULL,
    "insuranceProvider" TEXT NOT NULL,
    "insurancePolicyId" TEXT NOT NULL,
    "insuranceExpiryDate" TIMESTAMP(3) NOT NULL,
    "operatingRegions" TEXT[],
    "specializations" TEXT[],
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 5.0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "totalShipments" INTEGER NOT NULL DEFAULT 0,
    "onTimeDelivery" DOUBLE PRECISION NOT NULL DEFAULT 100,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Broker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Carrier" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "registrationNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'US',
    "contactPersonName" TEXT NOT NULL,
    "contactPhone" TEXT NOT NULL,
    "mcNumber" TEXT NOT NULL,
    "dotNumber" TEXT NOT NULL,
    "operatingAuthority" "CarrierAuthorityType" NOT NULL,
    "licenseNumber" TEXT NOT NULL,
    "licenseExpiryDate" TIMESTAMP(3) NOT NULL,
    "insuranceProvider" TEXT NOT NULL,
    "insurancePolicyId" TEXT NOT NULL,
    "insuranceExpiryDate" TIMESTAMP(3) NOT NULL,
    "liabilityLimit" BIGINT NOT NULL,
    "cargoInsurance" BOOLEAN NOT NULL DEFAULT true,
    "totalTrucks" INTEGER NOT NULL DEFAULT 0,
    "totalDrivers" INTEGER NOT NULL DEFAULT 0,
    "fleetTypes" TEXT[],
    "specializations" TEXT[],
    "averageFleetAge" INTEGER,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 5.0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "totalShipments" INTEGER NOT NULL DEFAULT 0,
    "onTimeDelivery" DOUBLE PRECISION NOT NULL DEFAULT 100,
    "damageRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "safetyScore" DOUBLE PRECISION NOT NULL DEFAULT 100,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Carrier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Driver" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'US',
    "driversLicenseNumber" TEXT NOT NULL,
    "driversLicenseState" TEXT NOT NULL,
    "driversLicenseExpiry" TIMESTAMP(3) NOT NULL,
    "ssn" TEXT NOT NULL,
    "carrierId" TEXT NOT NULL,
    "employmentStatus" "DriverStatus" NOT NULL DEFAULT 'active',
    "hireDate" TIMESTAMP(3) NOT NULL,
    "yearsOfExperience" INTEGER NOT NULL,
    "cdlClass" TEXT NOT NULL,
    "endorsements" TEXT[],
    "medicalCertDate" TIMESTAMP(3) NOT NULL,
    "trainingCertifications" TEXT[],
    "backgroundCheckDate" TIMESTAMP(3),
    "backgroundCheckStatus" "VerificationStatus" NOT NULL DEFAULT 'pending',
    "mvr" TEXT,
    "accidentsCount" INTEGER NOT NULL DEFAULT 0,
    "violationsCount" INTEGER NOT NULL DEFAULT 0,
    "totalMilesDriven" BIGINT NOT NULL DEFAULT 0,
    "totalShipmentsCompleted" INTEGER NOT NULL DEFAULT 0,
    "safetyRating" DOUBLE PRECISION NOT NULL DEFAULT 100,
    "onTimeDelivery" DOUBLE PRECISION NOT NULL DEFAULT 100,
    "currentTruckId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Driver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FreightOwner" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'US',
    "contactPersonName" TEXT NOT NULL,
    "contactPhone" TEXT NOT NULL,
    "taxId" TEXT,
    "businessType" TEXT NOT NULL,
    "hazmatApproved" BOOLEAN NOT NULL DEFAULT false,
    "internationalShipping" BOOLEAN NOT NULL DEFAULT false,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 5.0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "totalShipments" INTEGER NOT NULL DEFAULT 0,
    "preferredPaymentMethod" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FreightOwner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DriverViolation" (
    "id" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "violationNumber" TEXT NOT NULL,
    "violationType" TEXT NOT NULL,
    "violationCode" TEXT NOT NULL,
    "violationDate" TIMESTAMP(3) NOT NULL,
    "discoveredDate" TIMESTAMP(3) NOT NULL,
    "location" TEXT,
    "description" TEXT NOT NULL,
    "fineAmount" BIGINT,
    "status" TEXT NOT NULL DEFAULT 'open',
    "authority" TEXT NOT NULL,
    "reportedBy" TEXT,
    "injuryCount" INTEGER NOT NULL DEFAULT 0,
    "propertyDamage" BIGINT NOT NULL DEFAULT 0,
    "severity" TEXT NOT NULL DEFAULT 'medium',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DriverViolation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DriverIncident" (
    "id" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "incidentNumber" TEXT NOT NULL,
    "incidentType" TEXT NOT NULL,
    "incidentDate" TIMESTAMP(3) NOT NULL,
    "reportedDate" TIMESTAMP(3) NOT NULL,
    "location" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "description" TEXT NOT NULL,
    "injuryCount" INTEGER NOT NULL DEFAULT 0,
    "injurySeverity" TEXT,
    "propertyDamage" BIGINT NOT NULL DEFAULT 0,
    "repairCost" BIGINT,
    "thirdPartyInvolved" BOOLEAN NOT NULL DEFAULT false,
    "thirdPartyName" TEXT,
    "policeReportNumber" TEXT,
    "insuranceClaim" TEXT,
    "weatherCondition" TEXT,
    "roadCondition" TEXT,
    "driverFault" BOOLEAN NOT NULL DEFAULT false,
    "resultingCharges" TEXT[],
    "severity" TEXT NOT NULL DEFAULT 'medium',
    "investigationCompleted" BOOLEAN NOT NULL DEFAULT false,
    "investigationNotes" TEXT,
    "trainingRequired" BOOLEAN NOT NULL DEFAULT false,
    "trainingCompleted" BOOLEAN NOT NULL DEFAULT false,
    "trainingDate" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DriverIncident_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BrokerCarrierContract" (
    "id" TEXT NOT NULL,
    "brokerId" TEXT NOT NULL,
    "carrierId" TEXT NOT NULL,
    "contractNumber" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "defaultRate" BIGINT NOT NULL,
    "minRate" BIGINT NOT NULL,
    "maxRate" BIGINT NOT NULL,
    "volumeDiscount" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "volumeThreshold" INTEGER,
    "termsDays" INTEGER NOT NULL DEFAULT 30,
    "paymentTerms" TEXT NOT NULL DEFAULT 'Net30',
    "baselineFuel" DOUBLE PRECISION NOT NULL DEFAULT 3.0,
    "fuelSurchargeFormula" TEXT NOT NULL DEFAULT '(current_price - baseline) * 0.90',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BrokerCarrierContract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BrokerRate" (
    "id" TEXT NOT NULL,
    "contractId" TEXT NOT NULL,
    "brokerRateId" TEXT NOT NULL,
    "originState" TEXT,
    "destState" TEXT,
    "originCity" TEXT,
    "destCity" TEXT,
    "laneDescription" TEXT,
    "rate" BIGINT NOT NULL,
    "minimumCharge" BIGINT NOT NULL,
    "effectiveDate" TIMESTAMP(3) NOT NULL,
    "expiryDate" TIMESTAMP(3),
    "freightClassMin" INTEGER,
    "freightClassMax" INTEGER,
    "weightMin" DOUBLE PRECISION,
    "weightMax" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BrokerRate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarrierRate" (
    "id" TEXT NOT NULL,
    "carrierId" TEXT NOT NULL,
    "carrierRateId" TEXT NOT NULL,
    "originState" TEXT,
    "destState" TEXT,
    "originCity" TEXT,
    "destCity" TEXT,
    "laneDescription" TEXT,
    "baseRate" BIGINT NOT NULL,
    "minRate" BIGINT NOT NULL,
    "maxRate" BIGINT NOT NULL,
    "costPerMile" DOUBLE PRECISION,
    "deadheadCost" BIGINT,
    "effectiveDate" TIMESTAMP(3) NOT NULL,
    "expiryDate" TIMESTAMP(3),
    "freightClassMin" INTEGER,
    "freightClassMax" INTEGER,
    "weightMin" DOUBLE PRECISION,
    "weightMax" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CarrierRate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarrierAccessorial" (
    "id" TEXT NOT NULL,
    "carrierId" TEXT NOT NULL,
    "serviceCode" TEXT NOT NULL,
    "serviceName" TEXT NOT NULL,
    "serviceDescription" TEXT,
    "unitType" TEXT NOT NULL DEFAULT 'flat',
    "unitRate" BIGINT NOT NULL,
    "availableRegions" TEXT[],
    "minRate" BIGINT NOT NULL DEFAULT 0,
    "maxRate" BIGINT NOT NULL DEFAULT 0,
    "isApproved" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CarrierAccessorial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShipmentFreight" (
    "id" TEXT NOT NULL,
    "shipmentId" TEXT NOT NULL,
    "freightId" TEXT NOT NULL,
    "sequenceNumber" INTEGER NOT NULL,
    "pickedUpAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),

    CONSTRAINT "ShipmentFreight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShipmentStop" (
    "id" TEXT NOT NULL,
    "shipmentId" TEXT NOT NULL,
    "sequenceNumber" INTEGER NOT NULL,
    "stopType" TEXT NOT NULL DEFAULT 'intermediate',
    "warehouseId" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "address" TEXT,
    "arrivedAt" TIMESTAMP(3),
    "departedAt" TIMESTAMP(3),
    "duration" INTEGER,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShipmentStop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShipmentLog" (
    "id" TEXT NOT NULL,
    "shipmentId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "eventTime" TIMESTAMP(3) NOT NULL,
    "location" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "mileage" DOUBLE PRECISION,
    "fuelLevel" TEXT,
    "temperature" DOUBLE PRECISION,
    "humidity" DOUBLE PRECISION,
    "deviceId" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShipmentLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShipmentEvent" (
    "id" TEXT NOT NULL,
    "shipmentId" TEXT NOT NULL,
    "eventCode" TEXT NOT NULL,
    "eventDescription" TEXT NOT NULL,
    "eventTime" TIMESTAMP(3) NOT NULL,
    "severity" TEXT NOT NULL DEFAULT 'info',
    "requiresAction" BOOLEAN NOT NULL DEFAULT false,
    "actionTaken" TEXT,
    "actionDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShipmentEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShipmentDocument" (
    "id" TEXT NOT NULL,
    "shipmentId" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "documentNumber" TEXT,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileSize" INTEGER,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "issueDate" TIMESTAMP(3),
    "expiryDate" TIMESTAMP(3),
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedAt" TIMESTAMP(3),
    "verifiedBy" TEXT,

    CONSTRAINT "ShipmentDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TruckMaintenance" (
    "id" TEXT NOT NULL,
    "truckId" TEXT NOT NULL,
    "maintenanceNumber" TEXT NOT NULL,
    "maintenanceType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "scheduledDate" TIMESTAMP(3) NOT NULL,
    "completedDate" TIMESTAMP(3),
    "mileageAtService" DOUBLE PRECISION,
    "status" TEXT NOT NULL DEFAULT 'scheduled',
    "estimatedCost" BIGINT NOT NULL,
    "actualCost" BIGINT,
    "servicedBy" TEXT,
    "serviceProvider" TEXT,
    "warrantyExpires" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "TruckMaintenance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TruckInspection" (
    "id" TEXT NOT NULL,
    "truckId" TEXT NOT NULL,
    "inspectionNumber" TEXT NOT NULL,
    "inspectionType" TEXT NOT NULL,
    "inspectionDate" TIMESTAMP(3) NOT NULL,
    "nextDueDate" TIMESTAMP(3),
    "mileageAtInspection" DOUBLE PRECISION,
    "status" TEXT NOT NULL DEFAULT 'passed',
    "inspectorName" TEXT NOT NULL,
    "inspectorId" TEXT,
    "criticalFindings" TEXT[],
    "minorFindings" TEXT[],
    "safetyRating" INTEGER,
    "maintenanceRating" INTEGER,
    "requiredActions" TEXT,
    "actionDeadline" TIMESTAMP(3),
    "actionCompleted" BOOLEAN NOT NULL DEFAULT false,
    "certificationExpires" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TruckInspection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TruckViolation" (
    "id" TEXT NOT NULL,
    "truckId" TEXT NOT NULL,
    "violationNumber" TEXT NOT NULL,
    "violationType" TEXT NOT NULL,
    "violationCode" TEXT NOT NULL,
    "violationDate" TIMESTAMP(3) NOT NULL,
    "discoveredDate" TIMESTAMP(3) NOT NULL,
    "location" TEXT,
    "description" TEXT NOT NULL,
    "fineAmount" BIGINT,
    "status" TEXT NOT NULL DEFAULT 'open',
    "authority" TEXT NOT NULL,
    "reportedBy" TEXT,
    "correctionDeadline" TIMESTAMP(3),
    "correctionDate" TIMESTAMP(3),
    "severity" TEXT NOT NULL DEFAULT 'medium',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TruckViolation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "reviewNumber" TEXT NOT NULL,
    "reviewType" TEXT NOT NULL,
    "brokerId" TEXT,
    "carrierId" TEXT,
    "reviewedBy" TEXT NOT NULL,
    "reviewerType" TEXT NOT NULL,
    "shipmentNumber" TEXT,
    "rating" INTEGER NOT NULL,
    "categories" TEXT[],
    "categoryRatings" DOUBLE PRECISION[],
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "positivePoints" TEXT[],
    "negativePoints" TEXT[],
    "recommendedFix" TEXT,
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "helpfulCount" INTEGER NOT NULL DEFAULT 0,
    "unhelpfulCount" INTEGER NOT NULL DEFAULT 0,
    "response" TEXT,
    "respondedAt" TIMESTAMP(3),
    "respondedBy" TEXT,
    "status" TEXT NOT NULL DEFAULT 'published',
    "reviewDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE INDEX "session_userId_idx" ON "session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE INDEX "account_userId_idx" ON "account"("userId");

-- CreateIndex
CREATE INDEX "verification_identifier_idx" ON "verification"("identifier");

-- CreateIndex
CREATE UNIQUE INDEX "Freight_freightNumber_key" ON "Freight"("freightNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Shipment_shipmentNumber_key" ON "Shipment"("shipmentNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Truck_licensePlate_key" ON "Truck"("licensePlate");

-- CreateIndex
CREATE UNIQUE INDEX "Truck_vin_key" ON "Truck"("vin");

-- CreateIndex
CREATE UNIQUE INDEX "Truck_tractorNumber_key" ON "Truck"("tractorNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Truck_trailerNumber_key" ON "Truck"("trailerNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Truck_currentDriverId_key" ON "Truck"("currentDriverId");

-- CreateIndex
CREATE UNIQUE INDEX "Warehouse_code_key" ON "Warehouse"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Broker_companyName_key" ON "Broker"("companyName");

-- CreateIndex
CREATE UNIQUE INDEX "Broker_registrationNumber_key" ON "Broker"("registrationNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Broker_email_key" ON "Broker"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Broker_licenseNumber_key" ON "Broker"("licenseNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Carrier_companyName_key" ON "Carrier"("companyName");

-- CreateIndex
CREATE UNIQUE INDEX "Carrier_registrationNumber_key" ON "Carrier"("registrationNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Carrier_email_key" ON "Carrier"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Carrier_mcNumber_key" ON "Carrier"("mcNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Carrier_dotNumber_key" ON "Carrier"("dotNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Driver_email_key" ON "Driver"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Driver_driversLicenseNumber_key" ON "Driver"("driversLicenseNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Driver_ssn_key" ON "Driver"("ssn");

-- CreateIndex
CREATE UNIQUE INDEX "FreightOwner_companyName_key" ON "FreightOwner"("companyName");

-- CreateIndex
CREATE UNIQUE INDEX "FreightOwner_email_key" ON "FreightOwner"("email");

-- CreateIndex
CREATE UNIQUE INDEX "FreightOwner_taxId_key" ON "FreightOwner"("taxId");

-- CreateIndex
CREATE UNIQUE INDEX "DriverViolation_violationNumber_key" ON "DriverViolation"("violationNumber");

-- CreateIndex
CREATE UNIQUE INDEX "DriverIncident_incidentNumber_key" ON "DriverIncident"("incidentNumber");

-- CreateIndex
CREATE UNIQUE INDEX "BrokerCarrierContract_contractNumber_key" ON "BrokerCarrierContract"("contractNumber");

-- CreateIndex
CREATE UNIQUE INDEX "BrokerCarrierContract_brokerId_carrierId_key" ON "BrokerCarrierContract"("brokerId", "carrierId");

-- CreateIndex
CREATE UNIQUE INDEX "BrokerRate_contractId_brokerRateId_key" ON "BrokerRate"("contractId", "brokerRateId");

-- CreateIndex
CREATE UNIQUE INDEX "CarrierRate_carrierRateId_key" ON "CarrierRate"("carrierRateId");

-- CreateIndex
CREATE UNIQUE INDEX "CarrierAccessorial_carrierId_serviceCode_key" ON "CarrierAccessorial"("carrierId", "serviceCode");

-- CreateIndex
CREATE UNIQUE INDEX "ShipmentFreight_shipmentId_freightId_key" ON "ShipmentFreight"("shipmentId", "freightId");

-- CreateIndex
CREATE UNIQUE INDEX "TruckMaintenance_maintenanceNumber_key" ON "TruckMaintenance"("maintenanceNumber");

-- CreateIndex
CREATE UNIQUE INDEX "TruckInspection_inspectionNumber_key" ON "TruckInspection"("inspectionNumber");

-- CreateIndex
CREATE UNIQUE INDEX "TruckViolation_violationNumber_key" ON "TruckViolation"("violationNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Review_reviewNumber_key" ON "Review"("reviewNumber");

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Freight" ADD CONSTRAINT "Freight_freightOwnerId_fkey" FOREIGN KEY ("freightOwnerId") REFERENCES "FreightOwner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Freight" ADD CONSTRAINT "Freight_currentWarehouseId_fkey" FOREIGN KEY ("currentWarehouseId") REFERENCES "Warehouse"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shipment" ADD CONSTRAINT "Shipment_freightOwnerId_fkey" FOREIGN KEY ("freightOwnerId") REFERENCES "FreightOwner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shipment" ADD CONSTRAINT "Shipment_brokerId_fkey" FOREIGN KEY ("brokerId") REFERENCES "Broker"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shipment" ADD CONSTRAINT "Shipment_carrierId_fkey" FOREIGN KEY ("carrierId") REFERENCES "Carrier"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shipment" ADD CONSTRAINT "Shipment_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shipment" ADD CONSTRAINT "Shipment_truckId_fkey" FOREIGN KEY ("truckId") REFERENCES "Truck"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shipment" ADD CONSTRAINT "Shipment_originWarehouseId_fkey" FOREIGN KEY ("originWarehouseId") REFERENCES "Warehouse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shipment" ADD CONSTRAINT "Shipment_destinationWarehouseId_fkey" FOREIGN KEY ("destinationWarehouseId") REFERENCES "Warehouse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Truck" ADD CONSTRAINT "Truck_carrierId_fkey" FOREIGN KEY ("carrierId") REFERENCES "Carrier"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Truck" ADD CONSTRAINT "Truck_currentDriverId_fkey" FOREIGN KEY ("currentDriverId") REFERENCES "Driver"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Driver" ADD CONSTRAINT "Driver_carrierId_fkey" FOREIGN KEY ("carrierId") REFERENCES "Carrier"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DriverViolation" ADD CONSTRAINT "DriverViolation_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DriverIncident" ADD CONSTRAINT "DriverIncident_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BrokerCarrierContract" ADD CONSTRAINT "BrokerCarrierContract_brokerId_fkey" FOREIGN KEY ("brokerId") REFERENCES "Broker"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BrokerCarrierContract" ADD CONSTRAINT "BrokerCarrierContract_carrierId_fkey" FOREIGN KEY ("carrierId") REFERENCES "Carrier"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BrokerRate" ADD CONSTRAINT "BrokerRate_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "BrokerCarrierContract"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarrierRate" ADD CONSTRAINT "CarrierRate_carrierId_fkey" FOREIGN KEY ("carrierId") REFERENCES "Carrier"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarrierAccessorial" ADD CONSTRAINT "CarrierAccessorial_carrierId_fkey" FOREIGN KEY ("carrierId") REFERENCES "Carrier"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShipmentFreight" ADD CONSTRAINT "ShipmentFreight_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "Shipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShipmentFreight" ADD CONSTRAINT "ShipmentFreight_freightId_fkey" FOREIGN KEY ("freightId") REFERENCES "Freight"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShipmentStop" ADD CONSTRAINT "ShipmentStop_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "Shipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShipmentStop" ADD CONSTRAINT "ShipmentStop_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "Warehouse"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShipmentLog" ADD CONSTRAINT "ShipmentLog_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "Shipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShipmentEvent" ADD CONSTRAINT "ShipmentEvent_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "Shipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShipmentDocument" ADD CONSTRAINT "ShipmentDocument_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "Shipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TruckMaintenance" ADD CONSTRAINT "TruckMaintenance_truckId_fkey" FOREIGN KEY ("truckId") REFERENCES "Truck"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TruckInspection" ADD CONSTRAINT "TruckInspection_truckId_fkey" FOREIGN KEY ("truckId") REFERENCES "Truck"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TruckViolation" ADD CONSTRAINT "TruckViolation_truckId_fkey" FOREIGN KEY ("truckId") REFERENCES "Truck"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_brokerId_fkey" FOREIGN KEY ("brokerId") REFERENCES "Broker"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_carrierId_fkey" FOREIGN KEY ("carrierId") REFERENCES "Carrier"("id") ON DELETE CASCADE ON UPDATE CASCADE;
