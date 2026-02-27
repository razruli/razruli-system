// Import field resolvers individually to avoid conflicts

import * as PageFields from "./page/fields";
import { usersResultFieldResolvers } from "./user";

export const typeResolvers = {
  // Auth type resolvers
  UsersResult: usersResultFieldResolvers,

  ...PageFields,
};
