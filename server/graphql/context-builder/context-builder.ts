// server/graphql/context-builder.ts
/**
 * Context Builder - Initializes all services with LoaderRegistry and ResolverDependencies
 *
 * Pattern: Option 2 (Loaders in BaseService)
 * - Loaders created fresh per request via factory
 * - Services injected with LoaderRegistry
 * - ResolverDependencies shared across all resolvers
 * - Middleware applied at resolver level
 */

import { PrismaClient } from "@/server/db/generated/prisma/client";
import { GraphQLContext } from "../context";
import { createLoaders, LoaderRegistry } from "../lib/loaders";
import { ResolverDependencies } from "@/server/graphql/lib/ResolverDependencies";

// Import repositories
import { UserRepository } from "@/server/services/user/userRepository";
import { CarrierRepository } from "@/server/services/parties/carrier/repository";
import { BrokerRepository } from "@/server/services/parties/broker/repository";
import { WarehouseRepository } from "@/server/services/parties/warehouse/repository";
// import { DriverRepository } from "@/server/services/parties/driver/repository";
// import { FreightRepository } from "@/server/services/objects/freight/repository";
// import { ShipmentRepository } from "@/server/services/objects/shipment/repository";
// import { VehicleRepository } from "@/server/services/objects/vehicle/repository";
// import { BiddingRepository } from "@/server/services/supporting/bidding/repository";
// import { PenaltyRepository } from "@/server/services/supporting/penalties/repository";
// import { AuditRepository } from "@/server/services/supporting/audit/repository";
// import { ReviewRepository } from "@/server/services/supporting/reviews/repository";

// Import services
import { UserService } from "@/server/services/user/userService";
import { CarrierService } from "@/server/services/parties/carrier/service";
import { BrokerService } from "@/server/services/parties/broker/service";
import { WarehouseService } from "@/server/services/parties/warehouse/service";
import { DriverService } from "@/server/services/parties/driver/service";
import { FreightOwnerService } from "@/server/services/parties/freight-owner/service";
import { FreightService } from "@/server/services/objects/freight/service";
import { ShipmentService } from "@/server/services/objects/shipment/service";
import { VehicleService } from "@/server/services/objects/vehicle/service";
import { BiddingService } from "@/server/services/supporting/bidding/service";
import { PenaltiesService } from "@/server/services/supporting/penalties/service";
import { AuditService } from "@/server/services/supporting/audit/service";
import { ReviewsService } from "@/server/services/supporting/reviews/service";
import { ComplianceService } from "@/server/services/supporting/compliance/service";
import { ContractsService } from "@/server/services/supporting/contracts/service";
import { JunctionsService } from "@/server/services/supporting/junctions/service";
import { MaintenanceService } from "@/server/services/supporting/maintenance/service";

// Import missing repositories
import { DriverRepository } from "@/server/services/parties/driver/repository";
import { FreightOwnerRepository } from "@/server/services/parties/freight-owner/repository";
import { FreightRepository } from "@/server/services/objects/freight/repository";
import { ShipmentRepository } from "@/server/services/objects/shipment/repository";
import { VehicleRepository } from "@/server/services/objects/vehicle/repository";
import { BiddingRepository } from "@/server/services/supporting/bidding/repository";
import { PenaltiesRepository } from "@/server/services/supporting/penalties/repository";
import { AuditRepository } from "@/server/services/supporting/audit/repository";
import { ReviewsRepository } from "@/server/services/supporting/reviews/repository";
import { ComplianceRepository } from "@/server/services/supporting/compliance/repository";
import {
  BrokerCarrierContractRepository,
  BrokerRateRepository,
  CarrierRateRepository,
  CarrierAccessorialRepository,
} from "@/server/services/supporting/contracts/repository";
import {
  ShipmentFreightRepository,
  ShipmentStopRepository,
  ShipmentLogRepository,
  ShipmentEventRepository,
  ShipmentDocumentRepository,
} from "@/server/services/supporting/junctions/repository";
import { MaintenanceRepository } from "@/server/services/supporting/maintenance/repository";

export interface RepositoriesRegistry {
  userRepository: UserRepository;
  carrierRepository: CarrierRepository;
  brokerRepository: BrokerRepository;
  warehouseRepository: WarehouseRepository;
  driverRepository: DriverRepository;
  freightOwnerRepository: FreightOwnerRepository;
  freightRepository: FreightRepository;
  shipmentRepository: ShipmentRepository;
  vehicleRepository: VehicleRepository;
  biddingRepository: BiddingRepository;
  penaltiesRepository: PenaltiesRepository;
  auditRepository: AuditRepository;
  reviewsRepository: ReviewsRepository;
  complianceRepository: ComplianceRepository;
  brokerCarrierContractRepository: BrokerCarrierContractRepository;
  brokerRateRepository: BrokerRateRepository;
  carrierRateRepository: CarrierRateRepository;
  carrierAccessorialRepository: CarrierAccessorialRepository;
  shipmentFreightRepository: ShipmentFreightRepository;
  shipmentStopRepository: ShipmentStopRepository;
  shipmentLogRepository: ShipmentLogRepository;
  shipmentEventRepository: ShipmentEventRepository;
  shipmentDocumentRepository: ShipmentDocumentRepository;
  maintenanceRepository: MaintenanceRepository;
}

export interface ServicesRegistry {
  userService: UserService;
  carrierService: CarrierService;
  brokerService: BrokerService;
  warehouseService: WarehouseService;
  driverService: DriverService;
  freightOwnerService: FreightOwnerService;
  freightService: FreightService;
  shipmentService: ShipmentService;
  vehicleService: VehicleService;
  biddingService: BiddingService;
  penaltiesService: PenaltiesService;
  auditService: AuditService;
  reviewsService: ReviewsService;
  complianceService: ComplianceService;
  contractsService: ContractsService;
  junctionsService: JunctionsService;
  maintenanceService: MaintenanceService;
}

export class ContextBuilder {
  private static repositories: RepositoriesRegistry | null = null;
  private static services: ServicesRegistry | null = null;
  private static resolverDependencies: ResolverDependencies | null = null;

  /**
   * Initialize all services (called once at app startup)
   */
  static initializeServices(prisma: PrismaClient) {
    // Create repositories
    const userRepository = new UserRepository(prisma);
    const carrierRepository = new CarrierRepository(prisma);
    const brokerRepository = new BrokerRepository(prisma);
    const warehouseRepository = new WarehouseRepository(prisma);
    const driverRepository = new DriverRepository(prisma);
    const freightOwnerRepository = new FreightOwnerRepository(prisma);
    const freightRepository = new FreightRepository(prisma);
    const shipmentRepository = new ShipmentRepository(prisma);
    const vehicleRepository = new VehicleRepository(prisma);
    const biddingRepository = new BiddingRepository(prisma);
    const penaltiesRepository = new PenaltiesRepository(prisma);
    const auditRepository = new AuditRepository(prisma);
    const reviewsRepository = new ReviewsRepository(prisma);
    const complianceRepository = new ComplianceRepository(prisma);
    const brokerCarrierContractRepository = new BrokerCarrierContractRepository(
      prisma,
    );
    const brokerRateRepository = new BrokerRateRepository(prisma);
    const carrierRateRepository = new CarrierRateRepository(prisma);
    const carrierAccessorialRepository = new CarrierAccessorialRepository(
      prisma,
    );
    const shipmentFreightRepository = new ShipmentFreightRepository(prisma);
    const shipmentStopRepository = new ShipmentStopRepository(prisma);
    const shipmentLogRepository = new ShipmentLogRepository(prisma);
    const shipmentEventRepository = new ShipmentEventRepository(prisma);
    const shipmentDocumentRepository = new ShipmentDocumentRepository(prisma);
    const maintenanceRepository = new MaintenanceRepository(prisma);

    // Store repositories for later re-injection
    this.repositories = {
      userRepository,
      carrierRepository,
      brokerRepository,
      warehouseRepository,
      driverRepository,
      freightOwnerRepository,
      freightRepository,
      shipmentRepository,
      vehicleRepository,
      biddingRepository,
      penaltiesRepository,
      auditRepository,
      reviewsRepository,
      complianceRepository,
      brokerCarrierContractRepository,
      brokerRateRepository,
      carrierRateRepository,
      carrierAccessorialRepository,
      shipmentFreightRepository,
      shipmentStopRepository,
      shipmentLogRepository,
      shipmentEventRepository,
      shipmentDocumentRepository,
      maintenanceRepository,
    };

    // Create fresh DataLoaders for app initialization
    const initLoaders = createLoaders(prisma);

    // Create services with initial loaders
    const userService = new UserService(userRepository, initLoaders);
    const carrierService = new CarrierService(carrierRepository, initLoaders);
    const brokerService = new BrokerService(brokerRepository, initLoaders);
    const warehouseService = new WarehouseService(
      warehouseRepository,
      initLoaders,
    );
    const driverService = new DriverService(driverRepository, initLoaders);
    const freightOwnerService = new FreightOwnerService(
      freightOwnerRepository,
      initLoaders,
    );
    const freightService = new FreightService(freightRepository, initLoaders);
    const shipmentService = new ShipmentService(
      shipmentRepository,
      initLoaders,
    );
    const vehicleService = new VehicleService(vehicleRepository, initLoaders);
    const biddingService = new BiddingService(biddingRepository, initLoaders);
    const penaltiesService = new PenaltiesService(
      penaltiesRepository,
      initLoaders,
    );
    const auditService = new AuditService(auditRepository, initLoaders);
    const reviewsService = new ReviewsService(reviewsRepository, initLoaders);
    const complianceService = new ComplianceService(
      complianceRepository,
      initLoaders,
    );
    const contractsService = new ContractsService(
      brokerCarrierContractRepository,
      brokerRateRepository,
      carrierRateRepository,
      carrierAccessorialRepository,
      initLoaders,
    );
    const junctionsService = new JunctionsService(
      shipmentFreightRepository,
      shipmentStopRepository,
      shipmentLogRepository,
      shipmentEventRepository,
      shipmentDocumentRepository,
      initLoaders,
    );
    const maintenanceService = new MaintenanceService(
      maintenanceRepository,
      initLoaders,
    );

    this.services = {
      userService,
      carrierService,
      brokerService,
      warehouseService,
      driverService,
      freightOwnerService,
      freightService,
      shipmentService,
      vehicleService,
      biddingService,
      penaltiesService,
      auditService,
      reviewsService,
      complianceService,
      contractsService,
      junctionsService,
      maintenanceService,
    };

    // Create shared ResolverDependencies (instantiated once, reused by all resolvers)
    this.resolverDependencies = new ResolverDependencies(this.services);
  }

  /**
   * Get shared ResolverDependencies (needed for resolver instantiation)
   */
  static getResolverDependencies(): ResolverDependencies {
    if (!this.resolverDependencies) {
      throw new Error(
        "ResolverDependencies not initialized. Call initializeServices first.",
      );
    }
    return this.resolverDependencies;
  }

  /**
   * Create enriched context for each GraphQL request
   * - Fresh loaders per request
   * - Services re-injected with fresh LoaderRegistry
   * - Shared ResolverDependencies
   */
  static enrichContext(
    baseContext: GraphQLContext & { prisma: PrismaClient },
  ): GraphQLContext & {
    loaders: LoaderRegistry;
    services: ServicesRegistry;
  } {
    if (!this.repositories || !this.services) {
      throw new Error(
        "Services not initialized. Call initializeServices first.",
      );
    }

    // Create fresh DataLoaders for this request
    const loaders = createLoaders(baseContext.prisma);

    // Re-inject services with fresh LoaderRegistry for this request using stored repositories
    const userService = new UserService(
      this.repositories.userRepository,
      loaders,
    );
    const carrierService = new CarrierService(
      this.repositories.carrierRepository,
      loaders,
    );
    const brokerService = new BrokerService(
      this.repositories.brokerRepository,
      loaders,
    );
    const warehouseService = new WarehouseService(
      this.repositories.warehouseRepository,
      loaders,
    );
    const driverService = new DriverService(
      this.repositories.driverRepository,
      loaders,
    );
    const freightOwnerService = new FreightOwnerService(
      this.repositories.freightOwnerRepository,
      loaders,
    );
    const freightService = new FreightService(
      this.repositories.freightRepository,
      loaders,
    );
    const shipmentService = new ShipmentService(
      this.repositories.shipmentRepository,
      loaders,
    );
    const vehicleService = new VehicleService(
      this.repositories.vehicleRepository,
      loaders,
    );
    const biddingService = new BiddingService(
      this.repositories.biddingRepository,
      loaders,
    );
    const penaltiesService = new PenaltiesService(
      this.repositories.penaltiesRepository,
      loaders,
    );
    const auditService = new AuditService(
      this.repositories.auditRepository,
      loaders,
    );
    const reviewsService = new ReviewsService(
      this.repositories.reviewsRepository,
      loaders,
    );
    const complianceService = new ComplianceService(
      this.repositories.complianceRepository,
      loaders,
    );
    const contractsService = new ContractsService(
      this.repositories.brokerCarrierContractRepository,
      this.repositories.brokerRateRepository,
      this.repositories.carrierRateRepository,
      this.repositories.carrierAccessorialRepository,
      loaders,
    );
    const junctionsService = new JunctionsService(
      this.repositories.shipmentFreightRepository,
      this.repositories.shipmentStopRepository,
      this.repositories.shipmentLogRepository,
      this.repositories.shipmentEventRepository,
      this.repositories.shipmentDocumentRepository,
      loaders,
    );
    const maintenanceService = new MaintenanceService(
      this.repositories.maintenanceRepository,
      loaders,
    );

    // Return enriched context with fresh loaders and services
    return {
      ...baseContext,
      loaders,
      services: {
        userService,
        carrierService,
        brokerService,
        warehouseService,
        driverService,
        freightOwnerService,
        freightService,
        shipmentService,
        vehicleService,
        biddingService,
        penaltiesService,
        auditService,
        reviewsService,
        complianceService,
        contractsService,
        junctionsService,
        maintenanceService,
      },
    };
  }
}
