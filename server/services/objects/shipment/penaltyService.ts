import {
  BaseService,
  LoaderRegistry,
} from "@/server/services/common/BaseService";
import { logger } from "@/server/utils/logger/logger";
import { NotFoundError, ValidationError } from "@/server/utils/errors/errors";
import prisma from "@/server/db/prisma/lib/prisma";

/**
 * PenaltyService - Handles cancellation fee calculation and distribution
 * Rules:
 * - 5% fee if cancelled at BIDDING_OPEN status
 * - 10% fee if cancelled at BID_SELECTED status
 * - $0 fee if cancelled before BIDDING_OPEN
 * - Fees split equally among all bidders (selected bidder gets 2x share)
 */
export class PenaltyService extends BaseService {
  constructor(loaders: LoaderRegistry) {
    super("PenaltyService", loaders);
  }

  /**
   * Calculate cancellation fee based on shipment status and owner budget
   * Returns CancellationFee object with total amount and percentage
   */
  async calculateCancellationFee(shipmentId: string) {
    return this.executeQuery("calculateCancellationFee", async () => {
      const shipment = await prisma.shipment.findUnique({
        where: { id: shipmentId },
      });

      if (!shipment) {
        throw new NotFoundError(`Shipment not found: ${shipmentId}`);
      }

      let feePercentage = 0;

      // Fee based on shipment status
      // Using enum comparison (Prisma enums are lowercase_with_underscores)
      const status = shipment.status as string;
      if (status === "bidding_open") {
        feePercentage = 0.05; // 5%
      } else if (status === "bid_selected") {
        feePercentage = 0.1; // 10%
      } else if (status === "posted") {
        feePercentage = 0; // No fee before bidding
      }

      const totalFeeAmount = Math.round(
        Number(shipment.ownerBudget) * feePercentage,
      );

      return {
        shipmentId,
        totalFeeAmount,
        feePercentage,
        distributedAt: null,
        paidBidderIds: [],
      };
    });
  }

  /**
   * Distribute cancellation fee equally among all bidders
   * Selected bidder receives 2x share if bid was selected
   */
  async distributeFeeToBidders(shipmentId: string) {
    return this.executeMutation(
      "distributeFeeToBidders",
      { shipmentId },
      async () => {
        // First calculate the fee
        const feeInfo = await this.calculateCancellationFee(shipmentId);
        const totalFeeAmount = feeInfo.totalFeeAmount;

        // Get all bids for shipment (using correct model name: shipmentBid)
        const bids = await prisma.shipmentBid.findMany({
          where: { shipmentId },
        });

        if (bids.length === 0) {
          logger.warn(`No bids found for shipment ${shipmentId}`);
          return { distributedCount: 0 };
        }

        const bidCount = bids.length;
        const baseShare = Math.floor(totalFeeAmount / bidCount);
        const selectedBidId = (
          await prisma.shipment.findUnique({
            where: { id: shipmentId },
            select: { acceptedBidId: true },
          })
        )?.acceptedBidId;

        // Distribute to each bidder
        const distributions = bids.map((bid: any) => {
          const isSelected = bid.id === selectedBidId;
          const share = isSelected ? baseShare * 2 : baseShare;
          return {
            bidderId: bid.carrierId,
            bidId: bid.id,
            amount: share,
          };
        });

        logger.info(`Distributed ${totalFeeAmount} to ${bidCount} bidders`, {
          shipmentId,
          distributions,
        });

        return {
          distributedCount: bidCount,
          distributions,
        };
      },
    );
  }

  /**
   * Log penalty audit trail for compliance and accountability
   */
  async logPenaltyAudit(
    shipmentId: string,
    fee: { totalFeeAmount: number; feePercentage: number },
  ) {
    return this.executeQuery("logPenaltyAudit", async () => {
      logger.info(`[AUDIT] Cancellation fee calculated`, {
        shipmentId,
        totalFeeAmount: fee.totalFeeAmount,
        feePercentage: fee.feePercentage,
        timestamp: new Date().toISOString(),
      });

      return { logged: true };
    });
  }
}
