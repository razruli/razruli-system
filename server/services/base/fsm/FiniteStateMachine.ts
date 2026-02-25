// ============================================================================
// Finite State Machine - For state transition validation
// ============================================================================
// Defines and validates allowed state transitions in your domain
// Example: TaskAssignment can go pending -> in_progress -> completed
// ============================================================================

export class FiniteStateMachine {
  private transitions: Map<string, Set<string>> = new Map();

  /**
   * Define allowed transitions from one state to others
   * Example: fsm.defineTransition('pending', ['in_progress'])
   *          fsm.defineTransition('in_progress', ['completed', 'pending'])
   */
  defineTransition(fromState: string, toStates: string[]): this {
    this.transitions.set(fromState, new Set(toStates));
    return this; // For chaining
  }

  /**
   * Check if a transition from currentState to nextState is allowed
   */
  canTransition(currentState: string, nextState: string): boolean {
    const validStates = this.transitions.get(currentState);
    if (!validStates) return false;
    return validStates.has(nextState);
  }

  /**
   * Get all valid next states for a given current state
   */
  getValidTransitions(currentState: string): string[] {
    const validStates = this.transitions.get(currentState);
    return validStates ? Array.from(validStates) : [];
  }

  /**
   * Get all defined states
   */
  getAllStates(): string[] {
    return Array.from(this.transitions.keys());
  }

  /**
   * Check if state exists in FSM
   */
  hasState(state: string): boolean {
    return this.transitions.has(state);
  }
}
