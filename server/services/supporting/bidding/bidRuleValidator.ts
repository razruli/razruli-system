import { BaseService } from "@/server/services/common/BaseService";
import { logger } from "@/server/utils/logger/logger";
import prisma from "@/server/db/prisma/lib/prisma";

/**
 * BidRuleValidator - Validates carrier/warehouse bids against broker-defined rules
 * Auto-validates bids for compliance before visibility to broker
 * Rules: INSURANCE_AMOUNT, HOS_CERTIFIED, VEHICLE_AGE, HAZMAT_CERTIFIED, etc.
 */
export class BidRuleValidator extends BaseService {
  constructor() {
    super("BidRuleValidator");
  }

  /**
   * Validate carrier against all bid rules for a shipment
   * Returns validation results per rule
   */
  async validateCarrierAgainstRules(carrierId: string, shipmentId: string) {
    return this.executeQuery("validateCarrierAgainstRules", async () => {
      const rules = await prisma.bidRule.findMany({
        where: { shipmentId },
      });

      if (rules.length === 0) {
        return { compliant: true, requirements: [] };
      }

      const carrier = await prisma.carrier.findUnique({
        where: { id: carrierId },
      });

      if (!carrier) {
        return { compliant: false, requirements: [] };
      }

      const requirements = rules.map((rule) => {
        const passed = this.validateAgainstRule(carrier, rule);
        return {
          ruleId: rule.id,
          ruleType: rule.ruleType,
          passed,
          enforced: rule.enforced,
          status: passed ? "COMPLIANT" : "NON_COMPLIANT",
        };
      });

      // Overall compliance: all enforced rules must pass
      const compliant = requirements
        .filter((r) => r.enforced)
        .every((r) => r.passed);

      logger.info(`Bid validation for carrier ${carrierId}`, {
        shipmentId,
        compliant,
        requirements,
      });

      return { compliant, requirements };
    });
  }

  /**
   * Validate carrier against specific rule
   */
  private validateAgainstRule(carrier: any, rule: any): boolean {
    switch (rule.ruleType) {
      case "INSURANCE_AMOUNT":
        return this.validateInsurance(carrier, rule);
      case "HOS_CERTIFIED":
        return this.validateHOS(carrier, rule);
      case "VEHICLE_AGE":
        return this.validateVehicleAge(carrier, rule);
      case "HAZMAT_CERTIFIED":
        return this.validateHazmat(carrier, rule);
      case "TEMPERATURE_CONTROL":
        return this.validateTemperatureControl(carrier, rule);
      default:
        logger.warn(`Unknown rule type: ${rule.ruleType}`);
        return false;
    }
  }

  /**
   * Validate carrier has minimum insurance amount
   */
  private validateInsurance(carrier: any, rule: any): boolean {
    const required = Number(rule.requirementValue);
    const carrierInsurance = carrier.insuranceAmount || 0;
    return carrierInsurance >= required;
  }

  /**
   * Validate carrier has HOS certification
   */
  private validateHOS(carrier: any, rule: any): boolean {
    return carrier.hosCertified === true;
  }

  /**
   * Validate carrier vehicle age within acceptable range
   */
  private validateVehicleAge(carrier: any, rule: any): boolean {
    const maxAge = Number(rule.requirementValue);
    const currentYear = new Date().getFullYear();
    const vehicleYear = carrier.vehicleYear || 0;
    const age = currentYear - vehicleYear;
    return age <= maxAge;
  }

  /**
   * Validate carrier is HAZMAT certified
   */
  private validateHazmat(carrier: any, rule: any): boolean {
    return carrier.hazmatCertified === true;
  }

  /**
   * Validate carrier has temperature control capability
   */
  private validateTemperatureControl(carrier: any, rule: any): boolean {
    return carrier.temperatureControlCapable === true;
  }
}
