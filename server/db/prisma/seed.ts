import { prisma } from "./lib/prisma";

async function main() {
  console.log("🌱 Seeding database...\n");

  try {
    // Users
    const user = await prisma.user.upsert({
      where: { email: "admin@gruzin.com" },
      update: {},
      create: {
        id: "user-1",
        name: "Admin",
        email: "admin@gruzin.com",
        emailVerified: true,
      },
    });

    const session = await prisma.session.upsert({
      where: { token: "token-1" },
      update: {},
      create: {
        id: "session-1",
        token: "token-1",
        expiresAt: new Date(Date.now() + 86400000),
        userId: user.id,
      },
    });

    const account = await prisma.account.upsert({
      where: { id: "account-1" },
      update: {},
      create: {
        id: "account-1",
        accountId: "acc-1",
        providerId: "credentials",
        userId: user.id,
      },
    });

    const verification = await prisma.verification.upsert({
      where: { id: "verify-1" },
      update: {},
      create: {
        id: "verify-1",
        identifier: "admin@gruzin.com",
        value: "code-1",
        expiresAt: new Date(Date.now() + 86400000),
      },
    });

    console.log("✅ Auth: User, Session, Account, Verification");

    // Warehouse
    const warehouse = await prisma.warehouse.upsert({
      where: { code: "WH-001" },
      update: {},
      create: {
        id: "wh-1",
        name: "Main Warehouse",
        code: "WH-001",
        type: "general",
        address: "123 Main",
        city: "Chicago",
        state: "IL",
        zipCode: "60601",
        latitude: 41.88,
        longitude: -87.63,
        managerName: "Mgr",
        managerEmail: "mgr@wh.com",
        managerPhone: "+1-312-555-0100",
        totalCapacityM3: 10000,
        totalCapacityKg: BigInt(500000000),
        operatingHours: "24/7",
      },
    });

    const broker = await prisma.broker.upsert({
      where: { email: "broker@co.com" },
      update: {},
      create: {
        id: "broker-1",
        companyName: "Broker Inc",
        registrationNumber: "BR-001",
        email: "broker@co.com",
        phone: "+1-312-555-0200",
        address: "500 Main",
        city: "Chicago",
        state: "IL",
        zipCode: "60601",
        contactPersonName: "John",
        contactPhone: "+1-312-555-0201",
        licenseNumber: "LIC-001",
        licenseExpiryDate: new Date("2027-12-31"),
        insuranceProvider: "Ins Co",
        insurancePolicyId: "POL-001",
        insuranceExpiryDate: new Date("2027-12-31"),
        operatingRegions: ["Midwest"],
        specializations: ["FTL"],
        verificationStatus: "verified",
      },
    });

    const carrier = await prisma.carrier.upsert({
      where: { email: "carrier@truck.com" },
      update: {},
      create: {
        id: "carrier-1",
        companyName: "Carrier Trucking",
        registrationNumber: "CAR-001",
        email: "carrier@truck.com",
        phone: "+1-815-555-0300",
        address: "300 Route",
        city: "Springfield",
        state: "IL",
        zipCode: "62701",
        contactPersonName: "Bob",
        contactPhone: "+1-815-555-0301",
        mcNumber: "MC-001",
        dotNumber: "DOT-001",
        operatingAuthority: "common_carrier",
        licenseNumber: "LIC-CAR-001",
        licenseExpiryDate: new Date("2027-09-30"),
        insuranceProvider: "Ins Co",
        insurancePolicyId: "POL-CAR-001",
        insuranceExpiryDate: new Date("2027-08-31"),
        liabilityLimit: BigInt(1000000),
        fleetTypes: ["Van"],
        specializations: ["FTL"],
        verificationStatus: "verified",
      },
    });

    const driver = await prisma.driver.upsert({
      where: { email: "driver@truck.com" },
      update: {},
      create: {
        id: "driver-1",
        firstName: "James",
        lastName: "Driver",
        email: "driver@truck.com",
        phone: "+1-815-555-0400",
        dateOfBirth: new Date("1985-03-15"),
        address: "600 Main",
        city: "Springfield",
        state: "IL",
        zipCode: "62701",
        driversLicenseNumber: "IL-DL-123456",
        driversLicenseState: "IL",
        driversLicenseExpiry: new Date("2028-06-15"),
        ssn: "SSN-111-11-1111",
        carrierId: carrier.id,
        employmentStatus: "active",
        hireDate: new Date("2020-01-15"),
        yearsOfExperience: 5,
        cdlClass: "A",
        endorsements: ["H"],
        medicalCertDate: new Date("2026-12-31"),
        trainingCertifications: ["CDL_PASSENGER"],
        verificationStatus: "verified",
      },
    });

    const freightOwner = await prisma.freightOwner.upsert({
      where: { email: "owner@co.com" },
      update: {},
      create: {
        id: "owner-1",
        companyName: "Owner Corp",
        email: "owner@co.com",
        phone: "+1-312-555-0500",
        address: "800 Main",
        city: "Chicago",
        state: "IL",
        zipCode: "60601",
        contactPersonName: "Lisa",
        contactPhone: "+1-312-555-0501",
        businessType: "manufacturing",
        verificationStatus: "verified",
      },
    });

    console.log("✅ Parties: Warehouse, Broker, Carrier, Driver, FreightOwner");

    // Truck
    const truck = await prisma.truck.upsert({
      where: { licensePlate: "IL-TRK-001" },
      update: {},
      create: {
        id: "truck-1",
        carrierId: carrier.id,
        licensePlate: "IL-TRK-001",
        vin: "1HGBH42JXMN109186",
        tractorNumber: "TRACTOR-1",
        trailerType: "Van",
        make: "Freightliner",
        model: "Cascadia",
        year: 2022,
        maxWeightCapacity: BigInt(80000),
        maxVolumeCapacity: 3000,
        mileage: BigInt(125000),
        registrationExpiry: new Date("2027-12-31"),
        safetyInspectionDate: new Date("2026-01-15"),
        safetyInspectionExpiry: new Date("2027-01-15"),
        currentDriverId: driver.id,
        purchaseDate: new Date("2022-06-15"),
        purchasePrice: BigInt(145000),
      },
    });

    console.log("✅ Vehicles: Truck");

    // Freight
    const freight = await prisma.freight.upsert({
      where: { freightNumber: "FRGT-001" },
      update: {},
      create: {
        id: "freight-1",
        freightNumber: "FRGT-001",
        freightOwnerId: freightOwner.id,
        currentWarehouseId: warehouse.id,
        productName: "Electronics",
        productType: "Goods",
        unitType: "units",
        quantity: 100,
        unitWeight: 2.5,
        totalWeight: 250,
        volume: 150,
        status: "available",
      },
    });

    console.log("✅ Freight: Freight");

    // Shipment
    const shipment = await prisma.shipment.upsert({
      where: { shipmentNumber: "SHIP-001" },
      update: {},
      create: {
        id: "shipment-1",
        shipmentNumber: "SHIP-001",
        freightOwnerId: freightOwner.id,
        brokerId: broker.id,
        originWarehouseId: warehouse.id,
        pickupScheduled: new Date(Date.now() + 86400000),
        deliveryScheduled: new Date(Date.now() + 259200000),
        status: "draft",
        brokerMarginPercent: 0.1,
      },
    });

    console.log("✅ Shipment: Shipment");

    // BidRule
    const bidRule = await prisma.bidRule.upsert({
      where: { id: "rule-1" },
      update: {},
      create: {
        id: "rule-1",
        shipmentId: shipment.id,
        ruleType: "insurance_amount",
        requirementValue: "1000000",
        enforced: true,
      },
    });

    // ShipmentBid
    const shipmentBid = await prisma.shipmentBid.upsert({
      where: { id: "bid-1" },
      update: {},
      create: {
        id: "bid-1",
        shipmentId: shipment.id,
        carrierId: carrier.id,
        rate: BigInt(2400),
        surcharges: BigInt(100),
        totalRate: BigInt(2500),
        submittedAt: new Date(),
      },
    });

    // BidRequirement
    const bidRequirement = await prisma.bidRequirement.upsert({
      where: { id: "bidreq-1" },
      update: {},
      create: {
        id: "bidreq-1",
        bidRuleId: bidRule.id,
        bidId: shipmentBid.id,
        carrierResponse: "2000000",
        meetsRule: true,
      },
    });

    console.log("✅ Bidding: BidRule, ShipmentBid, BidRequirement");

    // WarehouseNeed
    const warehouseNeed = await prisma.warehouseNeed.upsert({
      where: { id: "whneed-1" },
      update: {},
      create: {
        id: "whneed-1",
        shipmentId: shipment.id,
        brokerId: broker.id,
        capacityM3: 500,
        arrivalDate: new Date(Date.now() + 86400000),
        departureDate: new Date(Date.now() + 259200000),
        status: "posted",
        warehouseId: warehouse.id,
      },
    });

    // WarehouseBid
    const warehouseBid = await prisma.warehouseBid.upsert({
      where: { id: "whbid-1" },
      update: {},
      create: {
        id: "whbid-1",
        warehouseNeedId: warehouseNeed.id,
        warehouseId: warehouse.id,
        ratePerM3: 25.5,
        surcharges: 5.0,
        totalRate: 12500.0,
        submittedAt: new Date(),
      },
    });

    console.log("✅ Warehouse: WarehouseNeed, WarehouseBid");

    // ShipmentStop
    const shipmentStop = await prisma.shipmentStop.upsert({
      where: { id: "stop-1" },
      update: {},
      create: {
        id: "stop-1",
        shipmentId: shipment.id,
        sequenceNumber: 1,
        stopType: "pickup",
        warehouseId: warehouse.id,
        latitude: 41.88,
        longitude: -87.63,
      },
    });

    // ShipmentFreight
    const shipmentFreight = await prisma.shipmentFreight.upsert({
      where: { id: "sfr-1" },
      update: {},
      create: {
        id: "sfr-1",
        shipmentId: shipment.id,
        freightId: freight.id,
        sequenceNumber: 1,
      },
    });

    // ShipmentDocument
    const shipmentDocument = await prisma.shipmentDocument.upsert({
      where: { id: "doc-1" },
      update: {},
      create: {
        id: "doc-1",
        shipmentId: shipment.id,
        documentType: "bill_of_lading",
        documentNumber: "BOL-001",
        fileName: "bol-001.pdf",
        fileUrl: "https://files.example.com/bol-001.pdf",
      },
    });

    // ShipmentEvent
    const shipmentEvent = await prisma.shipmentEvent.upsert({
      where: { id: "evt-1" },
      update: {},
      create: {
        id: "evt-1",
        shipmentId: shipment.id,
        eventCode: "shipment_created",
        eventDescription: "Shipment created successfully",
        eventTime: new Date(),
      },
    });

    // ShipmentLog
    const shipmentLog = await prisma.shipmentLog.upsert({
      where: { id: "log-1" },
      update: {},
      create: {
        id: "log-1",
        shipmentId: shipment.id,
        eventType: "created",
        eventTime: new Date(),
      },
    });

    console.log("✅ Shipment Support: Stop, Freight, Document, Event, Log");

    // BrokerCarrierContract
    const contract = await prisma.brokerCarrierContract.upsert({
      where: { id: "contract-1" },
      update: {},
      create: {
        id: "contract-1",
        brokerId: broker.id,
        carrierId: carrier.id,
        contractNumber: "BC-001",
        status: "active",
        startDate: new Date("2026-01-01"),
        endDate: new Date("2026-12-31"),
        defaultRate: BigInt(2500),
        minRate: BigInt(2000),
        maxRate: BigInt(3500),
      },
    });

    // BrokerRate
    const brokerRate = await prisma.brokerRate.upsert({
      where: { id: "brate-1" },
      update: {},
      create: {
        id: "brate-1",
        contractId: contract.id,
        brokerRateId: "brate-001",
        originState: "IL",
        destState: "GA",
        originCity: "Chicago",
        destCity: "Atlanta",
        rate: BigInt(2500),
        minimumCharge: BigInt(500),
        effectiveDate: new Date("2026-01-01"),
      },
    });

    // CarrierRate
    const carrierRate = await prisma.carrierRate.upsert({
      where: { id: "crate-1" },
      update: {},
      create: {
        id: "crate-1",
        carrierId: carrier.id,
        carrierRateId: "crate-001",
        originState: "IL",
        destState: "GA",
        originCity: "Chicago",
        destCity: "Atlanta",
        baseRate: BigInt(2000),
        minRate: BigInt(1800),
        maxRate: BigInt(2200),
        effectiveDate: new Date("2026-01-01"),
      },
    });

    // CarrierAccessorial
    const accessorial = await prisma.carrierAccessorial.upsert({
      where: { id: "acc-1" },
      update: {},
      create: {
        id: "acc-1",
        carrierId: carrier.id,
        serviceCode: "detention",
        serviceName: "Detention Charge",
        unitRate: BigInt(50),
      },
    });

    console.log(
      "✅ Contracts: BrokerCarrierContract, BrokerRate, CarrierRate, Accessorial",
    );

    // TruckMaintenance
    const maintenance = await prisma.truckMaintenance.upsert({
      where: { id: "maint-1" },
      update: {},
      create: {
        id: "maint-1",
        truckId: truck.id,
        maintenanceNumber: "MAINT-2026-001",
        maintenanceType: "oil_change",
        description: "Routine oil change and filter replacement",
        scheduledDate: new Date("2026-02-01"),
        estimatedCost: BigInt(150),
      },
    });

    // TruckInspection
    const inspection = await prisma.truckInspection.upsert({
      where: { id: "insp-1" },
      update: {},
      create: {
        id: "insp-1",
        truckId: truck.id,
        inspectionNumber: "INSP-2026-001",
        inspectionType: "dov_inspection",
        inspectionDate: new Date("2026-01-15"),
        inspectorName: "John Inspector",
        status: "passed",
      },
    });

    // TruckViolation
    const violation = await prisma.truckViolation.upsert({
      where: { id: "viol-1" },
      update: {},
      create: {
        id: "viol-1",
        truckId: truck.id,
        violationNumber: "VIOL-2025-001",
        violationType: "equipment_failure",
        violationCode: "EQ-FAIL-01",
        violationDate: new Date("2025-06-15"),
        discoveredDate: new Date("2025-06-15"),
        description: "Faulty brake system",
        authority: "DOT Inspector",
        status: "resolved",
      },
    });

    console.log("✅ Truck Maintenance: Maintenance, Inspection, Violation");

    // DriverIncident
    const incident = await prisma.driverIncident.upsert({
      where: { id: "inc-1" },
      update: {},
      create: {
        id: "inc-1",
        driverId: driver.id,
        incidentNumber: "INC-2025-001",
        incidentType: "minor_accident",
        incidentDate: new Date("2025-11-10"),
        reportedDate: new Date("2025-11-10"),
        description: "Minor fender bender at loading dock",
      },
    });

    // DriverViolation
    const drivViolation = await prisma.driverViolation.upsert({
      where: { id: "dviol-1" },
      update: {},
      create: {
        id: "dviol-1",
        driverId: driver.id,
        violationNumber: "DVIOL-2025-001",
        violationType: "speeding",
        violationCode: "SPEED-05",
        violationDate: new Date("2025-05-20"),
        discoveredDate: new Date("2025-05-20"),
        description: "Speeding 15 mph over limit",
        authority: "State Police",
        status: "paid",
      },
    });

    console.log("✅ Driver Compliance: Incident, Violation");

    // CancellationFee
    const cancFee = await prisma.cancellationFee.upsert({
      where: { id: "cancfee-1" },
      update: {},
      create: {
        id: "cancfee-1",
        shipmentId: shipment.id,
        originalValue: BigInt(5000),
        feePercentage: 0.05,
        totalFeeAmount: BigInt(250),
        cancelledBy: "owner",
        bidderIds: [carrier.id],
      },
    });

    // PenaltyPayment
    const penalty = await prisma.penaltyPayment.upsert({
      where: { id: "pen-1" },
      update: {},
      create: {
        id: "pen-1",
        cancellationFeeId: cancFee.id,
        recipientId: carrier.id,
        recipientType: "carrier",
        amountPaid: BigInt(250),
      },
    });

    console.log("✅ Penalties: CancellationFee, PenaltyPayment");

    // Review
    const review = await prisma.review.upsert({
      where: { id: "review-1" },
      update: {},
      create: {
        id: "review-1",
        reviewNumber: "REV-2026-001",
        reviewType: "shipment",
        shipmentNumber: shipment.shipmentNumber,
        carrierId: carrier.id,
        reviewedBy: freightOwner.id,
        reviewerType: "freight_owner",
        rating: 5,
        title: "Excellent service",
        content: "Very professional and on-time delivery",
        reviewDate: new Date(),
      },
    });

    console.log("✅ Reviews: Review\n");

    console.log("✅ 🎉 ALL 33 MODELS SEEDED SUCCESSFULLY! 🎉\n");
  } catch (error) {
    console.error("❌ Seed Error:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
