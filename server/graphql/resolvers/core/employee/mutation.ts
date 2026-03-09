/**
 * ============================================================================
 * Employee Domain - Mutation Resolvers
 * ============================================================================
 * Independent resolver functions with proper TypeScript types
 * Each resolver is defined as a standalone function then wrapped with middleware
 */

import { composeMiddleware, withMiddleware } from "@/server/graphql/middleware";
import { MutationResolvers } from "@/server/graphql/types/generated";

// ==================== MIDDLEWARE CONFIGURATIONS ====================
// Reusable middleware for employee mutations

/** Require authentication + employee:create permission */
const employeeCreateMiddleware = composeMiddleware(
  { requireAuth: true },
  { requiredPermissions: ["employee:create"] },
);

/** Require authentication + employee:update permission */
const employeeUpdateMiddleware = composeMiddleware(
  { requireAuth: true },
  { requiredPermissions: ["employee:update"] },
);

/** Require authentication + employee:delete permission */
const employeeDeleteMiddleware = composeMiddleware(
  { requireAuth: true },
  { requiredPermissions: ["employee:delete"] },
);

// ==================== RESOLVER FUNCTIONS ====================
// Independent functions with explicit type signatures

/**
 * Create a new employee
 * Requires manager permissions and company management
 */
const createEmployeeResolver: MutationResolvers["createEmployee"] = async (
  _parent,
  { input },
  context,
) => {
  try {
    // Validate input
    if (!input.departmentId || !input.fio || !input.gradeId) {
      throw new Error("Missing required fields: departmentId, fio, gradeId");
    }

    // Use company from auth context if not provided
    const companyId = input.companyId || context.actor?.companyId;
    if (!companyId) {
      throw new Error("Company ID is required");
    }

    // Create employee with input data
    const employee = await context.services.employee.create({
      companyId,
      departmentId: input.departmentId,
      fio: input.fio,
      gradeId: input.gradeId,
      gender: input.gender,
      birthDate: input.birthDate,
      hireDate: input.hireDate,
      employmentType: input.employmentType || "ТД",
      workingHoursPerDay: input.workingHoursPerDay || 8,
      kEfficiency: input.kEfficiency || 1.0,
    });

    // Emit event for subscriptions
    // TODO: Implement event emitter (RabbitMQ/Redis)
    // context.eventEmitter.emit(
    //   `EMPLOYEE_CREATED_COMPANY_${companyId}`,
    //   employee
    // );

    // if (input.departmentId) {
    //   context.eventEmitter.emit(
    //     `EMPLOYEE_CREATED_DEPT_${input.departmentId}`,
    //     employee
    //   );
    // }

    return employee;
  } catch (error) {
    throw new Error(`Failed to create employee: ${error}`);
  }
};

/**
 * Update an existing employee
 * Supports partial updates with audit trail and event emission
 */
const updateEmployeeResolver: MutationResolvers["updateEmployee"] = async (
  _parent,
  { id, input },
  context,
) => {
  try {
    // Get old values for audit trail
    const oldEmployee = await context.services.employee.getByIdOrThrow(id);

    // Build update data from provided fields
    const updateData: Record<string, unknown> = {};

    if (input.fio !== undefined && input.fio !== oldEmployee.fio) {
      updateData.fio = input.fio;
    }

    if (input.gradeId !== undefined && input.gradeId !== oldEmployee.gradeId) {
      updateData.gradeId = input.gradeId;
    }

    if (
      input.departmentId !== undefined &&
      input.departmentId !== oldEmployee.departmentId
    ) {
      updateData.departmentId = input.departmentId;
    }

    if (input.gender !== undefined && input.gender !== oldEmployee.gender) {
      updateData.gender = input.gender;
    }

    if (input.status !== undefined && input.status !== oldEmployee.status) {
      updateData.status = input.status;
    }

    if (
      input.kEfficiency !== undefined &&
      input.kEfficiency !== oldEmployee.kEfficiency
    ) {
      updateData.kEfficiency = input.kEfficiency;
    }

    if (
      input.workingHoursPerDay !== undefined &&
      input.workingHoursPerDay !== oldEmployee.workingHoursPerDay
    ) {
      updateData.workingHoursPerDay = input.workingHoursPerDay;
    }

    // If no changes, return old employee
    if (Object.keys(updateData).length === 0) {
      return oldEmployee;
    }

    // Update employee
    const updatedEmployee = await context.services.employee.update(
      id,
      updateData as Parameters<typeof context.services.employee.update>[1],
    );

    // Emit update event
    // TODO: Implement event emitter (RabbitMQ/Redis)
    // context.eventEmitter.emit(
    //   `EMPLOYEE_UPDATED_${id}`,
    //   updatedEmployee
    // );

    // if (
    //   updateData.departmentId &&
    //   updateData.departmentId !== oldEmployee.departmentId
    // ) {
    //   context.eventEmitter.emit(
    //     `EMPLOYEE_MOVED_DEPT_${oldEmployee.departmentId}`,
    //     updatedEmployee
    //   );
    //   context.eventEmitter.emit(
    //     `EMPLOYEE_JOINED_DEPT_${updateData.departmentId}`,
    //     updatedEmployee
    //   );
    // }

    return updatedEmployee;
  } catch (error) {
    throw new Error(`Failed to update employee: ${error}`);
  }
};

/**
 * Dismiss an employee
 * Marks employee as terminated and triggers cleanup
 */
const dismissEmployeeResolver: MutationResolvers["dismissEmployee"] = async (
  _parent,
  { id, reason },
  context,
) => {
  try {
    const oldEmployee = await context.services.employee.getByIdOrThrow(id);

    // Dismiss employee (soft delete - sets fireDate and status)
    const dismissedEmployee = await context.services.employee.update(id, {
      fireDate: new Date(),
      status: "dismissed",
    });

    // Cancel all active task assignments
    await context.services.taskAssignment.cancelByEmployee(id);

    // Record in employee history
    await context.services.employeeHistory.recordFire(
      id,
      oldEmployee.departmentId,
      oldEmployee.gradeId,
      new Date(),
      reason || "No reason provided",
      context.user?.id || "system",
    );

    // Emit dismissal event
    // TODO: Implement event emitter (RabbitMQ/Redis)
    // context.eventEmitter.emit(
    //   `EMPLOYEE_DISMISSED_COMPANY_${oldEmployee.companyId}`,
    //   dismissedEmployee
    // );

    // context.eventEmitter.emit(
    //   `EMPLOYEE_DISMISSED_DEPT_${oldEmployee.departmentId}`,
    //   dismissedEmployee
    // );

    return dismissedEmployee;
  } catch (error) {
    throw new Error(`Failed to dismiss employee: ${error}`);
  }
};

/**
 * Update employee efficiency factor
 * Used for performance adjustments and capacity recalculation
 */
const updateEmployeeEfficiencyResolver: MutationResolvers["updateEmployeeEfficiency"] =
  async (_parent, { id, kEfficiency }, context) => {
    try {
      // Validate efficiency between 0.1 and 2.0
      if (kEfficiency < 0.1 || kEfficiency > 2.0) {
        throw new Error("Efficiency must be between 0.1 and 2.0");
      }

      const oldEmployee = await context.services.employee.getByIdOrThrow(id);

      // Check if efficiency actually changed
      if (oldEmployee.kEfficiency === kEfficiency) {
        return oldEmployee;
      }

      // Update efficiency
      const updatedEmployee = await context.services.employee.update(id, {
        kEfficiency,
      });

      // Record in employee history
      await context.services.employeeHistory.recordEfficiencyUpdate(
        id,
        oldEmployee.kEfficiency,
        kEfficiency,
        context.user?.id || "system",
      );

      // Emit efficiency change event
      // TODO: Implement event emitter (RabbitMQ/Redis)
      // context.eventEmitter.emit(
      //   `EMPLOYEE_CAPACITY_CHANGED_${id}`,
      //   updatedEmployee
      // );

      return updatedEmployee;
    } catch (error) {
      throw new Error(`Failed to update employee efficiency: ${error}`);
    }
  };

// ==================== WRAPPED RESOLVERS ====================

const wrappedCreateEmployee = withMiddleware(
  createEmployeeResolver,
  employeeCreateMiddleware,
);

const wrappedUpdateEmployee = withMiddleware(
  updateEmployeeResolver,
  employeeUpdateMiddleware,
);

const wrappedDismissEmployee = withMiddleware(
  dismissEmployeeResolver,
  employeeDeleteMiddleware,
);

const wrappedUpdateEmployeeEfficiency = withMiddleware(
  updateEmployeeEfficiencyResolver,
  employeeUpdateMiddleware,
);

// ==================== EXPORTED RESOLVER MAP ====================

export const employeeMutations: Pick<
  MutationResolvers,
  | "createEmployee"
  | "updateEmployee"
  | "dismissEmployee"
  | "updateEmployeeEfficiency"
> = {
  createEmployee: wrappedCreateEmployee,
  updateEmployee: wrappedUpdateEmployee,
  dismissEmployee: wrappedDismissEmployee,
  updateEmployeeEfficiency: wrappedUpdateEmployeeEfficiency,
};

export default employeeMutations;
