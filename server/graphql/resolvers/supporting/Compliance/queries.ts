// ═══════════════════════════════════════════════════════════════════════════════
// COMPLIANCE QUERIES
// ═══════════════════════════════════════════════════════════════════════════════

import { GraphQLContext } from "@/server/graphql/context";

export async function getComplianceStatus(
  _: any,
  { carrierId }: any,
  context: GraphQLContext,
) {
  // TODO: Load compliance status for carrier (HOS, vehicle age, etc)
  return null;
}

export async function listComplianceIssues(
  _: any,
  { input }: any,
  context: GraphQLContext,
) {
  // TODO: Query all compliance violations/warnings
  return {
    items: [],
    pageInfo: { total: 0, hasMore: false, offset: 0, limit: input.limit },
  };
}
