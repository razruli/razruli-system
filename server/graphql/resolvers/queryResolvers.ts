// import { userQueryResolvers } from "./user";
// import * as partiesResolvers from "./parties";
// import * as objectsResolvers from "./objects";
// import * as supportingResolvers from "./supporting";

// import { Resolvers } from "../types/generated";
// /**
//  * Unified resolver composition
//  * Merges Query, Mutation, Subscription, and type field resolvers
//  */
// export const queryResolvers: Resolvers["Query"] = {
//   _empty: async () => {
//     return "true";
//   },
//   // Merge all feature query resolvers
//   ...userQueryResolvers,
//   ...partiesResolvers,
//   ...objectsResolvers,
//   ...supportingResolvers,
// };
