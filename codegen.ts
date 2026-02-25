// codegen.ts
import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: [
    "server/graphql/schema/scalars.graphql",
    "server/graphql/schema/index.graphql",
    "server/graphql/schema/**/*.graphql",
    "server/graphql/resolvers/**/*.graphql",
  ],
  documents: "shared/graphql/client/**/*.graphql",

  generates: {
    // =========================
    // Server types (resolvers)
    // =========================
    "server/graphql/types/generated.ts": {
      plugins: ["typescript", "typescript-resolvers"],
      config: {
        contextType: "../context#ServiceContext",
        avoidOptionals: true,
        resolverValidationOptions: {
          requireResolversForResolveType: false,
          requireResolversForAllFields: false,
        },
        mappers: {
          // Auth (better-auth)
          User: "@/server/db/generated/prisma#User",
          Session: "@/server/db/generated/prisma#Session",
          Account: "@/server/db/generated/prisma#Account",
          Verification: "@/server/db/generated/prisma#Verification",

          // Core Domain
          Company: "@/server/db/generated/prisma#Company",
          Department: "@/server/db/generated/prisma#Department",
          Employee: "@/server/db/generated/prisma#Employee",
          Grade: "@/server/db/generated/prisma#Grade",

          // Operations Domain
          Process: "@/server/db/generated/prisma#Process",
          TaskAssignment: "@/server/db/generated/prisma#TaskAssignment",

          // Analytics Domain
          LoadSnapshot: "@/server/db/generated/prisma#LoadSnapshot",
          GapAnalysisResult: "@/server/db/generated/prisma#GapAnalysisResult",
          HiringRequest: "@/server/db/generated/prisma#HiringRequest",

          // Audit Domain
          EmployeeHistory: "@/server/db/generated/prisma#EmployeeHistory",
          AuditLog: "@/server/db/generated/prisma#AuditLog",
        },
        scalars: {
          DateTime: "Date",
          JSON: "Record<string, any>",
          BigInt: "bigint",
        },
        strictScalars: false,
      },
    },

    // =========================
    // Client types (preset: client)
    // =========================
    "shared/graphql/generated/": {
      preset: "client",
      presetConfig: {
        fragmentMasking: false, // ✅ explicitly disabled
      },
      config: {
        scalars: {
          DateTime: "Date", // Prisma Date
          JSON: "Record<string, any>",
          BigInt: "bigint",
        },
      },
    },
  },

  hooks: {
    // afterAllFileWrite: ["prettier --write"],
  },
};

export default config;
