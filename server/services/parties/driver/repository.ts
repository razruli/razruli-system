import { PrismaClient, Driver } from "@/server/db/generated/prisma/client";
import { DriverResponse } from "./types";

export class DriverRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<DriverResponse | null> {
    const driver = await this.prisma.driver.findUnique({ where: { id } });
    return driver ? this.mapToResponse(driver) : null;
  }

  async listByCarrier(carrierId: string): Promise<DriverResponse[]> {
    const drivers = await this.prisma.driver.findMany({
      where: { carrierId },
    });
    return drivers.map((d) => this.mapToResponse(d));
  }

  async list(skip = 0, take = 10): Promise<DriverResponse[]> {
    const drivers = await this.prisma.driver.findMany({ skip, take });
    return drivers.map((d) => this.mapToResponse(d));
  }

  async create(data: any): Promise<DriverResponse> {
    const driver = await this.prisma.driver.create({ data });
    return this.mapToResponse(driver);
  }

  async update(id: string, data: any): Promise<DriverResponse> {
    const driver = await this.prisma.driver.update({ where: { id }, data });
    return this.mapToResponse(driver);
  }

  private mapToResponse(driver: Driver): DriverResponse {
    return {
      id: driver.id,
      carrierId: driver.carrierId,
      name: driver.firstName + " " + driver.lastName,
      email: driver.email,
      licenseNumber: driver.driversLicenseNumber,
      status: driver.employmentStatus,
      createdAt: driver.createdAt,
      updatedAt: driver.updatedAt,
    };
  }
}
