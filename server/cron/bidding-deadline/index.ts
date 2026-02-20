/**
 * Cron job: Process bidding deadlines
 * Every 1 hour, check for shipments where bidding deadline has passed
 * Auto-accept best compliant bid if no broker decision made
 */

import prisma from "@/server/db/prisma/lib/prisma";
import { logger } from "@/server/utils/logger/logger";

export async function processBiddingDeadlines() {
  try {
    const now = new Date();

    // Find shipments with expired bidding deadlines that haven't been decided
    const expired = await prisma.shipment.findMany({
      where: {
        status: "bids_received", // Status matches Prisma enum
        biddingOpenUntil: {
          lt: now, // deadline has passed
        },
        acceptedBidId: null, // no bid accepted yet
      },
    });

    logger.info(
      `[CRON] Processing ${expired.length} shipments with expired bidding deadlines`,
    );

    for (const shipment of expired) {
      try {
        // Get the best (lowest rate) bid for this shipment
        const bestBid = await prisma.shipmentBid.findFirst({
          where: {
            shipmentId: shipment.id,
          },
          orderBy: {
            rate: "asc", // Lowest rate is best for owner
          },
        });

        if (!bestBid) {
          logger.warn(
            `[CRON] Shipment ${shipment.id} has no bids, cannot auto-accept`,
          );
          continue;
        }

        // Update shipment to accept best bid
        await prisma.shipment.update({
          where: { id: shipment.id },
          data: {
            acceptedBidId: bestBid.id,
            status: "bid_selected",
          },
        });

        logger.info(
          `[CRON] Auto-accepted lowest bid for shipment ${shipment.id}`,
          {
            bidId: bestBid.id,
            rate: bestBid.rate,
          },
        );

        // Log audit trail
        logger.info(`[AUDIT] Auto-accept bid at deadline`, {
          shipmentId: shipment.id,
          bidId: bestBid.id,
          action: "AUTO_ACCEPT_DEADLINE",
          timestamp: now.toISOString(),
        });
      } catch (error) {
        logger.error(
          `[CRON] Error processing shipment ${shipment.id}`,
          error as Error,
        );
      }
    }
  } catch (error) {
    logger.error("[CRON] Error in processBiddingDeadlines", error as Error);
  }
}
