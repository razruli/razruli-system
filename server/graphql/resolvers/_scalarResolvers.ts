import {
  DateTimeResolver,
  BigIntResolver,
  JSONResolver,
} from "graphql-scalars";

import { Resolvers } from "../types/generated";

export const scalarResolvers: Partial<Resolvers> = {
  DateTime: DateTimeResolver,
  BigInt: BigIntResolver,
  // DeweyDecimal: GraphQLDeweyDecimalResolver,
  JSON: JSONResolver,
};
