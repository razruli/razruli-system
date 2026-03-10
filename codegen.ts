// codegen.ts
import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: [
    "server/graphql/schema/scalars.graphql",
    "server/graphql/schema/types.graphql",
    "server/graphql/schema/index.graphql",
    "server/graphql/schema/core/company.graphql",
    "server/graphql/schema/core/department.graphql",
    "server/graphql/schema/core/grade.graphql",
    "server/graphql/schema/core/employee.graphql",
    "server/graphql/schema/operations/process.graphql",
    "server/graphql/schema/operations/taskAssignment.graphql",
    "server/graphql/schema/analytics/loadSnapshot.graphql",
    "server/graphql/schema/analytics/gapAnalysis.graphql",
    "server/graphql/schema/audit/employeeHistory.graphql",
    "server/graphql/schema/audit/auditLog.graphql",
    "server/graphql/schema/user/types.graphql",
    "server/graphql/schema/user/queries.graphql",
    "server/graphql/schema/user/actor.graphql",
    "server/graphql/schema/user/role.graphql",
  ],
  documents: "shared/graphql/client/**/*.graphql",

  generates: {
    // =========================
    // Server types (resolvers)
    // =========================
    "server/graphql/types/generated.ts": {
      plugins: ["typescript", "typescript-resolvers"],
      config: {
        contextType: "../context/context#GraphQLContext",
        avoidOptionals: false,
        resolverValidationOptions: {
          requireResolversForResolveType: false,
          requireResolversForAllFields: false,
        },
        mappers: {
          // Auth (better-auth)
          User: "@/server/db/generated/prisma/models#UserModel",
          Session: "@/server/db/generated/prisma/models#SessionModel",
          Account: "@/server/db/generated/prisma/models#AccountModel",
          Verification: "@/server/db/generated/prisma/models#VerificationModel",

          // Actor & Authorization
          Actor: "@/server/db/generated/prisma/models#ActorModel",
          Role: "@/server/db/generated/prisma/models#RoleModel",
          Permission: "@/server/db/generated/prisma/models#PermissionModel",
          ActorRole: "@/server/db/generated/prisma/models#ActorRoleModel",
          RolePermission:
            "@/server/db/generated/prisma/models#RolePermissionModel",
          ActorPermission:
            "@/server/db/generated/prisma/models#ActorPermissionModel",

          // Core Domain
          Company: "@/server/db/generated/prisma/models#CompanyModel",
          Department: "@/server/db/generated/prisma/models#DepartmentModel",
          Employee: "@/server/db/generated/prisma/models#EmployeeModel",
          Grade: "@/server/db/generated/prisma/models#GradeModel",

          // Operations Domain
          Process: "@/server/db/generated/prisma/models#ProcessModel",
          TaskAssignment:
            "@/server/db/generated/prisma/models#TaskAssignmentModel",

          // Analytics Domain
          LoadSnapshot: "@/server/db/generated/prisma/models#LoadSnapshotModel",
          GapAnalysis:
            "@/server/db/generated/prisma/models#GapAnalysisResultModel",
          HiringRequest:
            "@/server/db/generated/prisma/models#HiringRequestModel",

          // Audit Domain
          EmployeeHistory:
            "@/server/db/generated/prisma/models#EmployeeHistoryModel",
          AuditLog: "@/server/db/generated/prisma/models#AuditLogModel",
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

  // Allow partial outputs when document validation fails
  allowPartialOutputs: true,

  hooks: {
    // afterAllFileWrite: ["prettier --write"],
  },
};

export default config;
