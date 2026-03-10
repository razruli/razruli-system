/**
 * Cron job: Process bidding deadlines
 * TODO: Implement when Shipment domain is added
 * Currently disabled - Shipment and ShipmentBid models not in schema
 */

import { logger } from "@/server/utils/logger/logger";

export async function processBiddingDeadlines() {
  logger.info(
    "[CRON] Bidding deadline processor - Shipment domain not implemented yet"
  );
  // TODO: Implement when Shipment domain is available
  return;
}
