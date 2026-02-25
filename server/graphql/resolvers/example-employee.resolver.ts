// ============================================================================
// EXAMPLE RESOLVER (PHASE 6 - Thin Resolvers)
// ============================================================================
// Shows how resolvers integrate services, middleware, and error handling
// This goes in: server/graphql/resolvers/employee.ts
// ============================================================================

import type { GraphQLResolveInfo } from "graphql";

import {
  ServiceFactory,
  ValidationError,
  NotFoundError,
} from "@/server/services";
import type { ServiceContext } from "@/server/types/context";

/**
 * Employee Query Field Resolvers
 *
 * Thin resolvers: delegate business logic to services
 * Handle: error formatting, null checks, GraphQL-specific formatting
 */

// ==================== QUERY RESOLVERS ====================

/**
 * Query.employee(id: String!): Employee
 * Get single employee by ID
 */
export async function employee(
  parent: any,
  args: { id: string },
  context: ServiceContext,
  //   info: GraphQLResolveInfo,
) {
  // Create factory (each request gets fresh factory)
  const factory = new ServiceFactory(context);
  const employeeService = factory.getEmployeeService();

  try {
    // Delegate to service (might throw NotFoundError)
    const result = await employeeService.getByIdOrThrow(args.id);
    return result;
  } catch (error) {
    // Handle service errors
    if (error instanceof NotFoundError) {
      // Return null or throw GraphQL error - up to you
      return null;
      // OR:
      // throw new ApolloError('Employee not found', 'EMPLOYEE_NOT_FOUND');
    }

    // Let other errors propagate to error handler
    throw error;
  }
}

/**
 * Query.employees(departmentId: String, status: String): [Employee!]!
 * Get employees with optional filtering
 */
export async function employees(
  parent: any,
  args: { departmentId?: string; status?: string },
  context: ServiceContext,
  //   info: GraphQLResolveInfo,
) {
  const factory = new ServiceFactory(context);
  const employeeService = factory.getEmployeeService();

  // If department specified, use optimized query
  if (args.departmentId) {
    const employees = await employeeService.getByDepartment(args.departmentId);

    // Client-side filtering if needed (usually done in database query)
    if (args.status) {
      return employees.filter((e) => e.status === args.status);
    }

    return employees;
  }

  // Otherwise use search with all filters
  return employeeService.search({
    status: args.status,
  });
}

/**
 * Query.employeeCapacity(id: String!): EmployeeCapacity!
 * Calculate employee's monthly capacity
 */
export async function employeeCapacity(
  parent: any,
  args: { id: string },
  context: ServiceContext,
  //   info: GraphQLResolveInfo,
) {
  const factory = new ServiceFactory(context);
  const employeeService = factory.getEmployeeService();

  try {
    const capacity = await employeeService.calculateCapacity(args.id);

    return {
      employeeId: args.id,
      capacityUnits: capacity,
      unit: "capacity_units",
    };
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw new Error(`Employee ${args.id} not found`);
    }
    throw error;
  }
}

/**
 * Query.departmentLoad(departmentId: String!): DepartmentLoad!
 * Cross-domain: get department total load and capacity
 */
export async function departmentLoad(
  parent: any,
  args: { departmentId: string },
  context: ServiceContext,
  //   info: GraphQLResolveInfo,
) {
  const factory = new ServiceFactory(context);
  const gapService = factory.getGapAnalysisService();

  const coverage = await gapService.analyzeDepartmentCapacityCoverage(
    args.departmentId,
  );

  return {
    departmentId: args.departmentId,
    totalCapacity: coverage.totalCapacity,
    totalRequired: coverage.totalRequired,
    coveragePercentage: coverage.coveragePercentage,
    isOverloaded: coverage.isOverloaded,
    recommendation: coverage.recommendation,
  };
}

// ==================== MUTATION RESOLVERS ====================

/**
 * Mutation.createEmployee(input: CreateEmployeeInput!): Employee!
 * Create new employee with validation
 */
export async function createEmployee(
  parent: any,
  args: { input: CreateEmployeeInput },
  context: ServiceContext,
  //   info: GraphQLResolveInfo,
) {
  // Require authentication (middleware should set context.userId)
  if (!context.isAuthenticated) {
    throw new Error("Authentication required");
  }

  // Require specific role (should be in middleware)
  // if (context.user?.role !== 'HR_ADMIN') {
  //   throw new Error('Insufficient permissions');
  // }

  const factory = new ServiceFactory(context);
  const employeeService = factory.getEmployeeService();
  const historyService = factory.getEmployeeHistoryService();

  try {
    // Service handles validation
    const employee = await employeeService.create({
      companyId: args.input.companyId,
      departmentId: args.input.departmentId,
      fio: args.input.fio,
      gradeId: args.input.gradeId,
      gender: args.input.gender,
      hireDate: new Date(args.input.hireDate),
      employmentType: args.input.employmentType,
    });

    // Audit: record hire event in immutable history
    await historyService.recordHire(
      employee.id,
      employee.departmentId,
      employee.gradeId,
      employee.hireDate,
    );

    // Optional: log in audit log
    // await auditService.logCreate({
    //   entityType: 'Employee',
    //   entityId: employee.id,
    //   values: employee,
    //   notes: `Hired: ${employee.fio}`
    // });

    return employee;
  } catch (error) {
    // Handle service errors
    if (error instanceof ValidationError) {
      throw new Error(`Validation error: ${error.message}`);
    }

    throw error;
  }
}

/**
 * Mutation.updateEmployee(id: String!, input: UpdateEmployeeInput!): Employee!
 * Update employee with change tracking
 */
export async function updateEmployee(
  parent: any,
  args: { id: string; input: UpdateEmployeeInput },
  context: ServiceContext,
  //   info: GraphQLResolveInfo,
) {
  if (!context.isAuthenticated) {
    throw new Error("Authentication required");
  }

  const factory = new ServiceFactory(context);
  const employeeService = factory.getEmployeeService();
  const historyService = factory.getEmployeeHistoryService();

  try {
    // Get old version for before/after logging
    const before = await employeeService.getByIdOrThrow(args.id);

    // Update
    const after = await employeeService.update(args.id, {
      fio: args.input.fio,
      departmentId: args.input.departmentId,
      gradeId: args.input.gradeId,
      status: args.input.status,
      kEfficiency: args.input.kEfficiency,
    });

    // Track grade change in history
    if (args.input.gradeId && args.input.gradeId !== before.gradeId) {
      await historyService.recordGradeChange(
        args.id,
        before.gradeId,
        args.input.gradeId,
      );
    }

    // Track department transfer in history
    if (
      args.input.departmentId &&
      args.input.departmentId !== before.departmentId
    ) {
      await historyService.recordTransfer(
        args.id,
        before.departmentId,
        args.input.departmentId,
      );
    }

    // Optional: audit log
    // await auditService.logUpdate({
    //   entityType: 'Employee',
    //   entityId: args.id,
    //   before,
    //   after,
    //   notes: `Updated by ${context.user?.name}`
    // });

    return after;
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw new Error(`Employee not found: ${args.id}`);
    }

    throw error;
  }
}

/**
 * Mutation.dismissEmployee(id: String!, reason: String): Employee!
 * Soft delete employee (mark as dismissed)
 */
export async function dismissEmployee(
  parent: any,
  args: { id: string; reason?: string },
  context: ServiceContext,
  //   info: GraphQLResolveInfo,
) {
  if (!context.isAuthenticated) {
    throw new Error("Authentication required");
  }

  const factory = new ServiceFactory(context);
  const employeeService = factory.getEmployeeService();
  const historyService = factory.getEmployeeHistoryService();

  try {
    const dismissed = await employeeService.dismiss(args.id);

    // Record in history
    await historyService.recordDismissal(args.id, new Date(), args.reason);

    return dismissed;
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw new Error(`Employee not found`);
    }

    throw error;
  }
}

/**
 * Mutation.assignProcessToEmployee(
 *   processId: String!,
 *   employeeId: String!
 * ): TaskAssignmentResult!
 *
 * Complex mutation: cross-domain coordination
 */
export async function assignProcessToEmployee(
  parent: any,
  args: { processId: string; employeeId: string },
  context: ServiceContext,
  //   info: GraphQLResolveInfo,
) {
  if (!context.isAuthenticated) {
    throw new Error("Authentication required");
  }

  const factory = new ServiceFactory(context);
  const processService = factory.getProcessService();

  try {
    // ProcessService handles cross-domain coordination with EmployeeService
    const result = await processService.assignWithCapacityCheck(
      args.processId,
      args.employeeId,
    );

    return {
      success: true,
      taskId: result.taskId,
      load: result.load,
      warning: result.isOverloaded
        ? "Employee is overloaded with this assignment"
        : null,
    };
  } catch (error) {
    if (error instanceof NotFoundError) {
      return {
        success: false,
        taskId: null,
        load: null,
        warning: error.message,
      };
    }

    throw error;
  }
}

// ==================== FIELD RESOLVERS ====================

/**
 * Employee.capacity: Float!
 * Field resolver: calculate capacity for queried employee
 *
 * Usage in GraphQL:
 * query {
 *   employee(id: "123") {
 *     id
 *     fio
 *     capacity  <-- Calls this resolver
 *   }
 * }
 */
export async function employeeCapacityField(
  parent: Employee, // The employee object from parent resolver
  args: any,
  context: ServiceContext,
  //   info: GraphQLResolveInfo,
) {
  const factory = new ServiceFactory(context);
  const employeeService = factory.getEmployeeService();

  return employeeService.calculateCapacity(parent.id);
}

/**
 * Employee.grade: Grade!
 * Field resolver: use DataLoader for efficient loading
 */
export async function employeeGradeField(
  parent: Employee,
  args: any,
  context: ServiceContext,
  info: GraphQLResolveInfo,
) {
  // Service can handle this via DataLoader batching
  return context.dataloaders.grade.load(parent.gradeId);
}

/**
 * Employee.department: Department!
 * Field resolver: DataLoader batching
 */
export async function employeeDepartmentField(
  parent: Employee,
  args: any,
  context: ServiceContext,
  info: GraphQLResolveInfo,
) {
  return context.dataloaders.department.load(parent.departmentId);
}

/**
 * Employee.history: [EmployeeHistory!]!
 * Field resolver: query employee's career history
 */
export async function employeeHistoryField(
  parent: Employee,
  args: any,
  context: ServiceContext,
  info: GraphQLResolveInfo,
) {
  const factory = new ServiceFactory(context);
  const historyService = factory.getEmployeeHistoryService();

  return historyService.getEmployeeHistory(parent.id);
}

// ==================== TYPE DEFINITIONS ====================

interface CreateEmployeeInput {
  companyId: string;
  departmentId: string;
  fio: string;
  gradeId: number;
  gender: string;
  hireDate: string; // ISO date string
  employmentType?: string;
}

interface UpdateEmployeeInput {
  fio?: string;
  gradeId?: number;
  departmentId?: string;
  status?: string;
  kEfficiency?: number;
}

interface Employee {
  id: string;
  companyId: string;
  departmentId: string;
  fio: string;
  gradeId: number;
  gender: string;
  hireDate: Date;
  status: string;
  kEfficiency: number;
}

// ==================== ERROR HANDLING PATTERNS ====================

/**
 * This is a base pattern. In production, you'd want:
 *
 * 1. Centralized error handler:
 *    - Map service errors to GraphQL errors
 *    - Format error messages consistently
 *    - Log errors with request context
 *
 * 2. Middleware for common checks:
 *    - Auth validation (before resolver)
 *    - Permission checks (before resolver)
 *    - Input validation (before resolver)
 *    - Rate limiting (before resolver)
 *
 * 3. Error types from Apollo Server:
 *    - ApolloError
 *    - AuthenticationError
 *    - AuthorizationError
 *    - ValidationError
 *    - UserInputError
 *
 * See docs/SERVICE_ARCHITECTURE.md Phase 5 for middleware details
 */
