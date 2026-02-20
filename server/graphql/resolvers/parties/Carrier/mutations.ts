// // ═══════════════════════════════════════════════════════════════════════════════
// // CARRIER MUTATIONS
// // ═══════════════════════════════════════════════════════════════════════════════

// import { GraphQLContext } from "@/server/graphql/context";

// export async function createCarrier(
//   _: any,
//   { input }: any,
//   context: GraphQLContext,
// ) {
//   // TODO: Implement
//   // - Validate credentials (MC number, DOT, Insurance)
//   // - Create carrier via CarrierService
//   // - Status: PENDING_VERIFICATION
//   return null;
// }

// export async function updateCarrier(
//   _: any,
//   { id, input }: any,
//   context: GraphQLContext,
// ) {
//   // TODO: Implement
//   return null;
// }

// export async function updateCarrierRating(
//   _: any,
//   { id, rating }: any,
//   context: GraphQLContext,
// ) {
//   // TODO: Update rating based on reviews
//   return null;
// }

// /**
//  * Phase 4-5: Carrier submits bid on shipment
//  * Rule #4: Bid Rules Auto-Validation
//  */
// export async function submitBid(
//   _: any,
//   { shipmentId, rate, input }: any,
//   context: GraphQLContext,
// ) {
//   // TODO: Implement
//   // - Validate carrier qualifications against bid rules
//   // - Auto-check: insurance, HOS, vehicle age, hazmat cert, temperature control
//   // - Status: RULE_COMPLIANT or RULE_NON_COMPLIANT
//   // - Create ShipmentBid
//   // - Notify broker
//   return null;
// }
