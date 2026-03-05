/**
 * ============================================================================
 * User Service - Exports
 * ============================================================================
 * User domain service layer
 * Handles user management, authentication, and authorization
 */

export { UserService } from "./user.service";
export { UserRepository } from "./user.repository";
export type {
  UserResult,
  ListUsersInput,
  UsersListResult,
  CreateUserInput,
  UpdateUserInput,
} from "./types";
