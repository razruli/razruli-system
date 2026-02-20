/*
  Warnings:

  - The values [quoted,booked,confirmed,in_progress,damaged,lost] on the enum `ShipmentStatus` will be removed. If these variants are still used in the database, this will fail.
  - The `status` column on the `Freight` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `brokerRate` on the `Shipment` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "FreightStatus" AS ENUM ('draft', 'available', 'claimed', 'assigned', 'completed', 'archived');

-- CreateEnum
CREATE TYPE "WarehouseNeedStatus" AS ENUM ('posted', 'bidding_open', 'bids_received', 'warehouse_selected', 'assigned', 'in_storage', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "BidStatus" AS ENUM ('pending', 'rule_compliant', 'rule_non_compliant', 'accepted', 'rejected', 'expired');

-- CreateEnum
CREATE TYPE "RuleType" AS ENUM ('insurance_amount', 'hos_clean', 'vehicle_age', 'hazmat_certified', 'temperature_control', 'early_confirm', 'capacity_match', 'access_hours', 'location_proximity');

-- AlterEnum
BEGIN;
CREATE TYPE "ShipmentStatus_new" AS ENUM ('draft', 'posted', 'bidding_open', 'bids_received', 'bid_selected', 'assigned', 'in_transit', 'delivered', 'completed', 'cancelled', 'disputed');
ALTER TABLE "public"."Shipment" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Shipment" ALTER COLUMN "status" TYPE "ShipmentStatus_new" USING ("status"::text::"ShipmentStatus_new");
ALTER TYPE "ShipmentStatus" RENAME TO "ShipmentStatus_old";
ALTER TYPE "ShipmentStatus_new" RENAME TO "ShipmentStatus";
DROP TYPE "public"."ShipmentStatus_old";
ALTER TABLE "Shipment" ALTER COLUMN "status" SET DEFAULT 'draft';
COMMIT;

-- DropForeignKey
ALTER TABLE "Shipment" DROP CONSTRAINT "Shipment_carrierId_fkey";

-- DropForeignKey
ALTER TABLE "Shipment" DROP CONSTRAINT "Shipment_destinationWarehouseId_fkey";

-- AlterTable
ALTER TABLE "Freight" ADD COLUMN     "brokerId" TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" "FreightStatus" NOT NULL DEFAULT 'draft';

-- AlterTable
ALTER TABLE "Shipment" DROP COLUMN "brokerRate",
ADD COLUMN     "acceptedBidId" TEXT,
ADD COLUMN     "biddingOpenUntil" TIMESTAMP(3),
ADD COLUMN     "biddingOpenedAt" TIMESTAMP(3),
ADD COLUMN     "brokerMarginAmount" BIGINT,
ADD COLUMN     "brokerMarginPercent" DOUBLE PRECISION NOT NULL DEFAULT 0.10,
ADD COLUMN     "ownerBudget" BIGINT,
ALTER COLUMN "carrierId" DROP NOT NULL,
ALTER COLUMN "destinationWarehouseId" DROP NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'draft',
ALTER COLUMN "baseRate" DROP NOT NULL,
ALTER COLUMN "customerRate" DROP NOT NULL,
ALTER COLUMN "carrierRate" DROP NOT NULL,
ALTER COLUMN "estimatedRevenue" DROP NOT NULL,
ALTER COLUMN "estimatedCost" DROP NOT NULL,
ALTER COLUMN "estimatedMargin" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Warehouse" ADD COLUMN     "baseRateHazmat" DOUBLE PRECISION,
ADD COLUMN     "baseRateRefrigerated" DOUBLE PRECISION,
ADD COLUMN     "baseRateStandard" DOUBLE PRECISION,
ADD COLUMN     "damageRatePercent" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "onTimeReleasePercent" DOUBLE PRECISION NOT NULL DEFAULT 100.0,
ADD COLUMN     "operates24x7" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "rating" DOUBLE PRECISION NOT NULL DEFAULT 5.0,
ADD COLUMN     "reviewCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "surchargesJson" JSONB,
ADD COLUMN     "totalWarehouses" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'pending',
ADD COLUMN     "volumeDiscountsJson" JSONB,
ALTER COLUMN "totalCapacityM3" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "usedCapacityM3" SET DEFAULT 0,
ALTER COLUMN "usedCapacityM3" SET DATA TYPE DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "BidRule" (
    "id" TEXT NOT NULL,
    "shipmentId" TEXT NOT NULL,
    "ruleType" "RuleType" NOT NULL,
    "requirementValue" TEXT NOT NULL,
    "enforced" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BidRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BidRequirement" (
    "id" TEXT NOT NULL,
    "bidRuleId" TEXT NOT NULL,
    "bidId" TEXT NOT NULL,
    "carrierResponse" TEXT,
    "meetsRule" BOOLEAN NOT NULL,
    "validationNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BidRequirement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShipmentBid" (
    "id" TEXT NOT NULL,
    "shipmentId" TEXT NOT NULL,
    "carrierId" TEXT NOT NULL,
    "rate" BIGINT NOT NULL,
    "surcharges" BIGINT NOT NULL DEFAULT 0,
    "totalRate" BIGINT NOT NULL,
    "status" "BidStatus" NOT NULL DEFAULT 'pending',
    "acceptedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "confirmedPaperworkAt" TIMESTAMP(3),
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShipmentBid_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WarehouseNeed" (
    "id" TEXT NOT NULL,
    "shipmentId" TEXT NOT NULL,
    "brokerId" TEXT NOT NULL,
    "capacityM3" DOUBLE PRECISION NOT NULL,
    "capacityKg" DOUBLE PRECISION,
    "isRefrigerated" BOOLEAN NOT NULL DEFAULT false,
    "isHazmat" BOOLEAN NOT NULL DEFAULT false,
    "requiresSecure" BOOLEAN NOT NULL DEFAULT false,
    "requires24x7" BOOLEAN NOT NULL DEFAULT false,
    "arrivalDate" TIMESTAMP(3) NOT NULL,
    "departureDate" TIMESTAMP(3) NOT NULL,
    "earlyReleaseOption" BOOLEAN NOT NULL DEFAULT false,
    "bidRulesJson" JSONB,
    "selectedBidId" TEXT,
    "status" "WarehouseNeedStatus" NOT NULL DEFAULT 'posted',
    "biddingOpenedAt" TIMESTAMP(3),
    "biddingOpenUntil" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "warehouseId" TEXT,

    CONSTRAINT "WarehouseNeed_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WarehouseBid" (
    "id" TEXT NOT NULL,
    "warehouseNeedId" TEXT NOT NULL,
    "warehouseId" TEXT NOT NULL,
    "ratePerM3" DOUBLE PRECISION NOT NULL,
    "surcharges" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "totalRate" DOUBLE PRECISION NOT NULL,
    "includesMonitoring" BOOLEAN NOT NULL DEFAULT false,
    "includedServices" TEXT[],
    "guarantees" TEXT,
    "status" "BidStatus" NOT NULL DEFAULT 'pending',
    "acceptedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "confirmedCapacityAt" TIMESTAMP(3),
    "capacityConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "counterOfferRound" INTEGER NOT NULL DEFAULT 0,
    "counterOfferAt" TIMESTAMP(3),
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WarehouseBid_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CancellationFee" (
    "id" TEXT NOT NULL,
    "shipmentId" TEXT,
    "warehouseNeedId" TEXT,
    "originalValue" BIGINT NOT NULL,
    "feePercentage" DOUBLE PRECISION NOT NULL,
    "totalFeeAmount" BIGINT NOT NULL,
    "cancelledBy" TEXT NOT NULL,
    "cancelledByUserId" TEXT,
    "bidderIds" TEXT[],
    "paidBidderIds" TEXT[],
    "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "distributedAt" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'pending',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CancellationFee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PenaltyPayment" (
    "id" TEXT NOT NULL,
    "cancellationFeeId" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "recipientType" TEXT NOT NULL,
    "amountPaid" BIGINT NOT NULL,
    "paymentStatus" TEXT NOT NULL DEFAULT 'pending',
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PenaltyPayment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BidRule_shipmentId_idx" ON "BidRule"("shipmentId");

-- CreateIndex
CREATE UNIQUE INDEX "BidRule_shipmentId_ruleType_key" ON "BidRule"("shipmentId", "ruleType");

-- CreateIndex
CREATE INDEX "BidRequirement_bidId_idx" ON "BidRequirement"("bidId");

-- CreateIndex
CREATE UNIQUE INDEX "BidRequirement_bidRuleId_bidId_key" ON "BidRequirement"("bidRuleId", "bidId");

-- CreateIndex
CREATE INDEX "ShipmentBid_shipmentId_status_idx" ON "ShipmentBid"("shipmentId", "status");

-- CreateIndex
CREATE INDEX "ShipmentBid_carrierId_status_idx" ON "ShipmentBid"("carrierId", "status");

-- CreateIndex
CREATE INDEX "ShipmentBid_submittedAt_idx" ON "ShipmentBid"("submittedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ShipmentBid_shipmentId_carrierId_key" ON "ShipmentBid"("shipmentId", "carrierId");

-- CreateIndex
CREATE INDEX "WarehouseNeed_shipmentId_status_idx" ON "WarehouseNeed"("shipmentId", "status");

-- CreateIndex
CREATE INDEX "WarehouseNeed_brokerId_status_idx" ON "WarehouseNeed"("brokerId", "status");

-- CreateIndex
CREATE INDEX "WarehouseNeed_createdAt_status_idx" ON "WarehouseNeed"("createdAt", "status");

-- CreateIndex
CREATE INDEX "WarehouseNeed_biddingOpenUntil_status_idx" ON "WarehouseNeed"("biddingOpenUntil", "status");

-- CreateIndex
CREATE INDEX "WarehouseBid_warehouseNeedId_status_idx" ON "WarehouseBid"("warehouseNeedId", "status");

-- CreateIndex
CREATE INDEX "WarehouseBid_warehouseId_status_idx" ON "WarehouseBid"("warehouseId", "status");

-- CreateIndex
CREATE INDEX "WarehouseBid_submittedAt_idx" ON "WarehouseBid"("submittedAt");

-- CreateIndex
CREATE UNIQUE INDEX "WarehouseBid_warehouseNeedId_warehouseId_key" ON "WarehouseBid"("warehouseNeedId", "warehouseId");

-- CreateIndex
CREATE UNIQUE INDEX "CancellationFee_shipmentId_key" ON "CancellationFee"("shipmentId");

-- CreateIndex
CREATE UNIQUE INDEX "CancellationFee_warehouseNeedId_key" ON "CancellationFee"("warehouseNeedId");

-- CreateIndex
CREATE INDEX "CancellationFee_shipmentId_idx" ON "CancellationFee"("shipmentId");

-- CreateIndex
CREATE INDEX "CancellationFee_warehouseNeedId_idx" ON "CancellationFee"("warehouseNeedId");

-- CreateIndex
CREATE INDEX "CancellationFee_status_idx" ON "CancellationFee"("status");

-- CreateIndex
CREATE INDEX "CancellationFee_distributedAt_idx" ON "CancellationFee"("distributedAt");

-- CreateIndex
CREATE INDEX "PenaltyPayment_recipientId_paymentStatus_idx" ON "PenaltyPayment"("recipientId", "paymentStatus");

-- CreateIndex
CREATE INDEX "PenaltyPayment_paidAt_idx" ON "PenaltyPayment"("paidAt");

-- CreateIndex
CREATE UNIQUE INDEX "PenaltyPayment_cancellationFeeId_recipientId_key" ON "PenaltyPayment"("cancellationFeeId", "recipientId");

-- CreateIndex
CREATE INDEX "Broker_isActive_rating_idx" ON "Broker"("isActive", "rating");

-- CreateIndex
CREATE INDEX "Broker_createdAt_idx" ON "Broker"("createdAt");

-- CreateIndex
CREATE INDEX "Carrier_isActive_rating_idx" ON "Carrier"("isActive", "rating");

-- CreateIndex
CREATE INDEX "Carrier_createdAt_idx" ON "Carrier"("createdAt");

-- CreateIndex
CREATE INDEX "Freight_freightOwnerId_status_idx" ON "Freight"("freightOwnerId", "status");

-- CreateIndex
CREATE INDEX "Freight_brokerId_status_idx" ON "Freight"("brokerId", "status");

-- CreateIndex
CREATE INDEX "Freight_createdAt_status_idx" ON "Freight"("createdAt", "status");

-- CreateIndex
CREATE INDEX "Shipment_brokerId_status_idx" ON "Shipment"("brokerId", "status");

-- CreateIndex
CREATE INDEX "Shipment_carrierId_status_idx" ON "Shipment"("carrierId", "status");

-- CreateIndex
CREATE INDEX "Shipment_freightOwnerId_status_idx" ON "Shipment"("freightOwnerId", "status");

-- CreateIndex
CREATE INDEX "Shipment_createdAt_status_idx" ON "Shipment"("createdAt", "status");

-- CreateIndex
CREATE INDEX "Shipment_biddingOpenUntil_status_idx" ON "Shipment"("biddingOpenUntil", "status");

-- CreateIndex
CREATE INDEX "Warehouse_city_state_type_idx" ON "Warehouse"("city", "state", "type");

-- CreateIndex
CREATE INDEX "Warehouse_isActive_rating_idx" ON "Warehouse"("isActive", "rating");

-- CreateIndex
CREATE INDEX "Warehouse_createdAt_idx" ON "Warehouse"("createdAt");

-- AddForeignKey
ALTER TABLE "Freight" ADD CONSTRAINT "Freight_brokerId_fkey" FOREIGN KEY ("brokerId") REFERENCES "Broker"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shipment" ADD CONSTRAINT "Shipment_carrierId_fkey" FOREIGN KEY ("carrierId") REFERENCES "Carrier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shipment" ADD CONSTRAINT "Shipment_destinationWarehouseId_fkey" FOREIGN KEY ("destinationWarehouseId") REFERENCES "Warehouse"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BidRule" ADD CONSTRAINT "BidRule_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "Shipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BidRequirement" ADD CONSTRAINT "BidRequirement_bidRuleId_fkey" FOREIGN KEY ("bidRuleId") REFERENCES "BidRule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BidRequirement" ADD CONSTRAINT "BidRequirement_bidId_fkey" FOREIGN KEY ("bidId") REFERENCES "ShipmentBid"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShipmentBid" ADD CONSTRAINT "ShipmentBid_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "Shipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShipmentBid" ADD CONSTRAINT "ShipmentBid_carrierId_fkey" FOREIGN KEY ("carrierId") REFERENCES "Carrier"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WarehouseNeed" ADD CONSTRAINT "WarehouseNeed_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "Shipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WarehouseNeed" ADD CONSTRAINT "WarehouseNeed_brokerId_fkey" FOREIGN KEY ("brokerId") REFERENCES "Broker"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WarehouseNeed" ADD CONSTRAINT "WarehouseNeed_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "Warehouse"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WarehouseBid" ADD CONSTRAINT "WarehouseBid_warehouseNeedId_fkey" FOREIGN KEY ("warehouseNeedId") REFERENCES "WarehouseNeed"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WarehouseBid" ADD CONSTRAINT "WarehouseBid_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "Warehouse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CancellationFee" ADD CONSTRAINT "CancellationFee_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "Shipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CancellationFee" ADD CONSTRAINT "CancellationFee_warehouseNeedId_fkey" FOREIGN KEY ("warehouseNeedId") REFERENCES "WarehouseNeed"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PenaltyPayment" ADD CONSTRAINT "PenaltyPayment_cancellationFeeId_fkey" FOREIGN KEY ("cancellationFeeId") REFERENCES "CancellationFee"("id") ON DELETE CASCADE ON UPDATE CASCADE;
