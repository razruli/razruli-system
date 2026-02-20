import {
  BaseService,
  LoaderRegistry,
} from "@/server/services/common/BaseService";
import {
  BrokerCarrierContractRepository,
  BrokerRateRepository,
  CarrierRateRepository,
  CarrierAccessorialRepository,
} from "./repository";
import {
  BrokerCarrierContractResponse,
  CreateBrokerCarrierContractInput,
  UpdateBrokerCarrierContractInput,
  BrokerCarrierContractFilters,
  BrokerRateResponse,
  CreateBrokerRateInput,
  UpdateBrokerRateInput,
  BrokerRateFilters,
  CarrierRateResponse,
  CreateCarrierRateInput,
  UpdateCarrierRateInput,
  CarrierRateFilters,
  CarrierAccessorialResponse,
  CreateCarrierAccessorialInput,
  UpdateCarrierAccessorialInput,
  CarrierAccessorialFilters,
} from "./types";

export class ContractsService extends BaseService {
  private brokerContractRepository: BrokerCarrierContractRepository;
  private brokerRateRepository: BrokerRateRepository;
  private carrierRateRepository: CarrierRateRepository;
  private accessorialRepository: CarrierAccessorialRepository;

  constructor(
    brokerContractRepo: BrokerCarrierContractRepository,
    brokerRateRepo: BrokerRateRepository,
    carrierRateRepo: CarrierRateRepository,
    accessorialRepo: CarrierAccessorialRepository,
    loaders: LoaderRegistry,
  ) {
    super("ContractsService", loaders);
    this.brokerContractRepository = brokerContractRepo;
    this.brokerRateRepository = brokerRateRepo;
    this.carrierRateRepository = carrierRateRepo;
    this.accessorialRepository = accessorialRepo;
  }

  // ========================================================================
  // BROKER-CARRIER CONTRACTS
  // ========================================================================

  async getBrokerCarrierContract(
    id: string,
    _useBatching = true,
  ): Promise<BrokerCarrierContractResponse> {
    return this.executeQuery("getBrokerCarrierContract", async () => {
      const contract = await this.brokerContractRepository.findById(id);
      if (!contract) throw new Error(`BrokerCarrierContract not found: ${id}`);
      return contract;
    });
  }

  async getBrokerCarrierContractByNumber(
    contractNumber: string,
  ): Promise<BrokerCarrierContractResponse> {
    return this.executeQuery("getBrokerCarrierContractByNumber", async () => {
      const contract =
        await this.brokerContractRepository.findByContractNumber(
          contractNumber,
        );
      if (!contract)
        throw new Error(`BrokerCarrierContract not found: ${contractNumber}`);
      return contract;
    });
  }

  async getBrokerCarrierContractByBrokerAndCarrier(
    brokerId: string,
    carrierId: string,
  ): Promise<BrokerCarrierContractResponse | null> {
    return this.executeQuery(
      "getBrokerCarrierContractByBrokerAndCarrier",
      async () => {
        return this.brokerContractRepository.findByBrokerAndCarrier(
          brokerId,
          carrierId,
        );
      },
    );
  }

  async searchBrokerCarrierContracts(
    filters: BrokerCarrierContractFilters,
    skip = 0,
    take = 10,
  ): Promise<BrokerCarrierContractResponse[]> {
    return this.executeQuery("searchBrokerCarrierContracts", async () => {
      return this.brokerContractRepository.search(filters, skip, take);
    });
  }

  async listBrokerCarrierContracts(
    skip = 0,
    take = 10,
  ): Promise<BrokerCarrierContractResponse[]> {
    return this.executeQuery("listBrokerCarrierContracts", async () => {
      return this.brokerContractRepository.list(skip, take);
    });
  }

  async createBrokerCarrierContract(
    input: CreateBrokerCarrierContractInput,
  ): Promise<BrokerCarrierContractResponse> {
    return this.executeMutation(
      "createBrokerCarrierContract",
      input,
      async () => {
        return this.brokerContractRepository.create(input);
      },
    );
  }

  async updateBrokerCarrierContract(
    id: string,
    input: UpdateBrokerCarrierContractInput,
  ): Promise<BrokerCarrierContractResponse> {
    return this.executeMutation(
      "updateBrokerCarrierContract",
      input,
      async () => {
        return this.brokerContractRepository.update(id, input);
      },
    );
  }

  async deleteBrokerCarrierContract(id: string): Promise<void> {
    return this.executeMutation(
      "deleteBrokerCarrierContract",
      { id },
      async () => {
        await this.brokerContractRepository.delete(id);
      },
    );
  }

  // ========================================================================
  // BROKER RATES
  // ========================================================================

  async getBrokerRate(id: string): Promise<BrokerRateResponse> {
    return this.executeQuery("getBrokerRate", async () => {
      const rate = await this.brokerRateRepository.findById(id);
      if (!rate) throw new Error(`BrokerRate not found: ${id}`);
      return rate;
    });
  }

  async searchBrokerRates(
    filters: BrokerRateFilters,
    skip = 0,
    take = 10,
  ): Promise<BrokerRateResponse[]> {
    return this.executeQuery("searchBrokerRates", async () => {
      return this.brokerRateRepository.search(filters, skip, take);
    });
  }

  async listBrokerRatesByContract(
    contractId: string,
    skip = 0,
    take = 10,
  ): Promise<BrokerRateResponse[]> {
    return this.executeQuery("listBrokerRatesByContract", async () => {
      return this.brokerRateRepository.listByContract(contractId, skip, take);
    });
  }

  async listBrokerRates(skip = 0, take = 10): Promise<BrokerRateResponse[]> {
    return this.executeQuery("listBrokerRates", async () => {
      return this.brokerRateRepository.list(skip, take);
    });
  }

  async createBrokerRate(
    input: CreateBrokerRateInput,
  ): Promise<BrokerRateResponse> {
    return this.executeMutation("createBrokerRate", input, async () => {
      return this.brokerRateRepository.create(input);
    });
  }

  async updateBrokerRate(
    id: string,
    input: UpdateBrokerRateInput,
  ): Promise<BrokerRateResponse> {
    return this.executeMutation("updateBrokerRate", input, async () => {
      return this.brokerRateRepository.update(id, input);
    });
  }

  async deleteBrokerRate(id: string): Promise<void> {
    return this.executeMutation("deleteBrokerRate", { id }, async () => {
      await this.brokerRateRepository.delete(id);
    });
  }

  // ========================================================================
  // CARRIER RATES
  // ========================================================================

  async getCarrierRate(id: string): Promise<CarrierRateResponse> {
    return this.executeQuery("getCarrierRate", async () => {
      const rate = await this.carrierRateRepository.findById(id);
      if (!rate) throw new Error(`CarrierRate not found: ${id}`);
      return rate;
    });
  }

  async getCarrierRateByCarrierRateId(
    carrierRateId: string,
  ): Promise<CarrierRateResponse> {
    return this.executeQuery("getCarrierRateByCarrierRateId", async () => {
      const rate =
        await this.carrierRateRepository.findByCarrierRateId(carrierRateId);
      if (!rate) throw new Error(`CarrierRate not found: ${carrierRateId}`);
      return rate;
    });
  }

  async searchCarrierRates(
    filters: CarrierRateFilters,
    skip = 0,
    take = 10,
  ): Promise<CarrierRateResponse[]> {
    return this.executeQuery("searchCarrierRates", async () => {
      return this.carrierRateRepository.search(filters, skip, take);
    });
  }

  async listCarrierRatesByCarrier(
    carrierId: string,
    skip = 0,
    take = 10,
  ): Promise<CarrierRateResponse[]> {
    return this.executeQuery("listCarrierRatesByCarrier", async () => {
      return this.carrierRateRepository.listByCarrier(carrierId, skip, take);
    });
  }

  async listCarrierRates(skip = 0, take = 10): Promise<CarrierRateResponse[]> {
    return this.executeQuery("listCarrierRates", async () => {
      return this.carrierRateRepository.list(skip, take);
    });
  }

  async createCarrierRate(
    input: CreateCarrierRateInput,
  ): Promise<CarrierRateResponse> {
    return this.executeMutation("createCarrierRate", input, async () => {
      return this.carrierRateRepository.create(input);
    });
  }

  async updateCarrierRate(
    id: string,
    input: UpdateCarrierRateInput,
  ): Promise<CarrierRateResponse> {
    return this.executeMutation("updateCarrierRate", input, async () => {
      return this.carrierRateRepository.update(id, input);
    });
  }

  async deleteCarrierRate(id: string): Promise<void> {
    return this.executeMutation("deleteCarrierRate", { id }, async () => {
      await this.carrierRateRepository.delete(id);
    });
  }

  // ========================================================================
  // CARRIER ACCESSORIALS
  // ========================================================================

  async getCarrierAccessorial(id: string): Promise<CarrierAccessorialResponse> {
    return this.executeQuery("getCarrierAccessorial", async () => {
      const accessorial = await this.accessorialRepository.findById(id);
      if (!accessorial) throw new Error(`CarrierAccessorial not found: ${id}`);
      return accessorial;
    });
  }

  async getCarrierAccessorialByCarrierAndCode(
    carrierId: string,
    serviceCode: string,
  ): Promise<CarrierAccessorialResponse | null> {
    return this.executeQuery(
      "getCarrierAccessorialByCarrierAndCode",
      async () => {
        return this.accessorialRepository.findByCarrierAndServiceCode(
          carrierId,
          serviceCode,
        );
      },
    );
  }

  async searchCarrierAccessorials(
    filters: CarrierAccessorialFilters,
    skip = 0,
    take = 10,
  ): Promise<CarrierAccessorialResponse[]> {
    return this.executeQuery("searchCarrierAccessorials", async () => {
      return this.accessorialRepository.search(filters, skip, take);
    });
  }

  async listCarrierAccessorialsByCarrier(
    carrierId: string,
    skip = 0,
    take = 10,
  ): Promise<CarrierAccessorialResponse[]> {
    return this.executeQuery("listCarrierAccessorialsByCarrier", async () => {
      return this.accessorialRepository.listByCarrier(carrierId, skip, take);
    });
  }

  async listCarrierAccessorials(
    skip = 0,
    take = 10,
  ): Promise<CarrierAccessorialResponse[]> {
    return this.executeQuery("listCarrierAccessorials", async () => {
      return this.accessorialRepository.list(skip, take);
    });
  }

  async createCarrierAccessorial(
    input: CreateCarrierAccessorialInput,
  ): Promise<CarrierAccessorialResponse> {
    return this.executeMutation("createCarrierAccessorial", input, async () => {
      return this.accessorialRepository.create(input);
    });
  }

  async updateCarrierAccessorial(
    id: string,
    input: UpdateCarrierAccessorialInput,
  ): Promise<CarrierAccessorialResponse> {
    return this.executeMutation("updateCarrierAccessorial", input, async () => {
      return this.accessorialRepository.update(id, input);
    });
  }

  async deleteCarrierAccessorial(id: string): Promise<void> {
    return this.executeMutation(
      "deleteCarrierAccessorial",
      { id },
      async () => {
        await this.accessorialRepository.delete(id);
      },
    );
  }
}
