// Import field resolvers individually to avoid conflicts

import { scalarResolvers } from "./_scalarResolvers";
import { analyticsResolvers } from "./analytics";
import { auditResolvers } from "./audit";
import { coreResolvers } from "./core";
import { operationsResolvers } from "./operations";
import * as PageFields from "./page/fields";
import { usersResultFieldResolvers } from "./user";

export const typeResolvers = {
  // ========== TYPE FIELD RESOLVERS ==========
  // Core domain type resolvers
  ...coreResolvers,

  // Operations domain type resolvers
  ...operationsResolvers,

  // Analytics domain type resolvers
  ...analyticsResolvers,

  // Audit domain type resolvers
  ...auditResolvers,

  // Scalar resolvers
  ...scalarResolvers,

  // Custom type field resolvers
  UsersResult: usersResultFieldResolvers,
  PageInfo: PageFields.pageInfoResolver,
};

export default typeResolvers;
