// Import field resolvers individually to avoid conflicts

import * as PageFields from "./supporting/page/fields";
import { usersResultFieldResolvers } from "./user";

export const typeResolvers = {
  // Auth type resolvers
  UsersResult: usersResultFieldResolvers,

  // Objects type field resolvers

  // Parties type field resolvers

  // Supporting type field resolvers
  ...PageFields,
};
