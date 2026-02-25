// ============================================================================
// BaseRepository - Abstract base class for all repositories
// ============================================================================
// Provides common CRUD operations, caching hints, and FSM support
// All domain-specific repositories should extend this class
// ============================================================================

import type { PrismaClient } from "@/server/db/generated/prisma/client";

import { FiniteStateMachine } from "./fsm/FiniteStateMachine";

export abstract class BaseRepository<T extends { id: string }> {
  protected abstract readonly modelName: keyof PrismaClient;
  protected fsm: FiniteStateMachine | null = null;

  constructor(protected prisma: PrismaClient) {}

  // ==================== CONFIGURATION ====================

  /**
   * Override in subclass to define FSM transitions
   * Example: this.fsm = new FiniteStateMachine()
   *          .defineTransition('pending', ['in_progress'])
   *          .defineTransition('in_progress', ['completed', 'pending'])
   */
  protected initializeFSM(): void {
    // Override in subclass if FSM is needed
  }

  // ==================== READ OPERATIONS ====================

  async findById(id: string): Promise<T | null> {
    const model = this.prisma[this.modelName] as any;
    return model.findUnique({ where: { id } });
  }

  async findMany(ids: readonly string[]): Promise<(T | null)[]> {
    const model = this.prisma[this.modelName] as any;
    const items = await model.findMany({
      where: { id: { in: ids as string[] } },
    });
    return (ids as string[]).map(
      (id) => items.find((item: any) => item.id === id) || null,
    );
  }

  async findAll(orderBy?: Record<string, "asc" | "desc">): Promise<T[]> {
    const model = this.prisma[this.modelName] as any;
    return model.findMany({
      orderBy: orderBy || { createdAt: "desc" },
    });
  }

  // ==================== WRITE OPERATIONS ====================

  async create(data: any): Promise<T> {
    const model = this.prisma[this.modelName] as any;
    return model.create({ data });
  }

  async update(id: string, data: any): Promise<T> {
    const model = this.prisma[this.modelName] as any;
    return model.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<T> {
    const model = this.prisma[this.modelName] as any;
    return model.delete({ where: { id } });
  }

  async upsert(id: string, data: any, updateData?: any): Promise<T> {
    const model = this.prisma[this.modelName] as any;
    return model.upsert({
      where: { id },
      create: { ...data, id },
      update: updateData || data,
    });
  }

  // ==================== FSM OPERATIONS ====================

  /**
   * Set up FSM rules (call in subclass constructor after super())
   */
  protected setupFSM(): FiniteStateMachine | null {
    this.initializeFSM();
    return this.fsm;
  }

  /**
   * Check if state transition is allowed by FSM
   */
  canTransition(currentState: string, nextState: string): boolean {
    if (!this.fsm) return true; // No FSM = any transition allowed
    return this.fsm.canTransition(currentState, nextState);
  }

  /**
   * Validate and perform state transition
   * Throws if transition is not allowed
   */
  async transitionState(
    id: string,
    newState: string,
    stateField: string = "status",
  ): Promise<T> {
    const item = await this.findById(id);
    if (!item) throw new Error(`${String(this.modelName)} not found`);

    const currentState = (item as any)[stateField];
    if (!this.canTransition(currentState, newState)) {
      throw new Error(`Cannot transition from ${currentState} to ${newState}`);
    }

    return this.update(id, { [stateField]: newState });
  }

  /**
   * Get current state for entity
   */
  async getState(
    id: string,
    stateField: string = "status",
  ): Promise<string | null> {
    const item = await this.findById(id);
    return item ? (item as any)[stateField] || null : null;
  }

  /**
   * Get all valid next states for current state
   */
  getValidNextStates(currentState: string): string[] {
    if (!this.fsm) return [];
    return this.fsm.getValidTransitions(currentState);
  }

  // ==================== BATCH OPERATIONS ====================

  async createMany(dataArray: any[]): Promise<T[]> {
    const model = this.prisma[this.modelName] as any;
    const results: T[] = [];
    for (const data of dataArray) {
      results.push(await model.create({ data }));
    }
    return results;
  }

  async updateMany(updates: Array<{ id: string; data: any }>): Promise<T[]> {
    const model = this.prisma[this.modelName] as any;
    const results: T[] = [];
    for (const { id, data } of updates) {
      results.push(await model.update({ where: { id }, data }));
    }
    return results;
  }

  async deleteMany(ids: readonly string[]): Promise<number> {
    const model = this.prisma[this.modelName] as any;
    const result = await model.deleteMany({
      where: { id: { in: ids as string[] } },
    });
    return result.count;
  }

  // ==================== COUNT OPERATIONS ====================

  async count(where?: any): Promise<number> {
    const model = this.prisma[this.modelName] as any;
    return model.count({ where });
  }

  async exists(id: string): Promise<boolean> {
    const model = this.prisma[this.modelName] as any;
    const result = await model.findUnique({ where: { id } });
    return !!result;
  }
}
