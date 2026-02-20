/**
 * Generic State Machine for validating status transitions
 * Enforces defined FSM rules (e.g., DRAFT -> POSTED -> BIDDING_OPEN, etc.)
 */
export class StateMachine<T extends string> {
  private transitions: Map<T, T[]> = new Map();

  constructor(transitionRules: Record<T, T[]>) {
    Object.entries(transitionRules).forEach(([from, to]) => {
      this.transitions.set(from as T, to as unknown as T[]);
    });
  }

  validate(current: T, next: T): void {
    const allowedTransitions = this.transitions.get(current);
    if (!allowedTransitions || !allowedTransitions.includes(next)) {
      throw new Error(
        `Invalid state transition: ${current} -> ${next}. Allowed transitions: ${allowedTransitions?.join(", ") || "none"}`,
      );
    }
  }

  allowedTransitions(current: T): T[] {
    return this.transitions.get(current) || [];
  }
}
