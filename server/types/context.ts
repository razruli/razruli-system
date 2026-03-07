// ============================================================================
// GraphQL Context Types
// ============================================================================
// Defines the service context contract - services depend on this interface
// ============================================================================

import DataLoader from "dataloader";

import { User } from "../db/generated/prisma/browser";
import type {
  Actor,
  Company,
  Department,
  Employee,
  Grade,
  Process,
  TaskAssignment,
  LoadSnapshot,
  GapAnalysisResult,
  EmployeeHistory,
  AuditLog,
  PrismaClient,
  Role,
  Permission,
} from "../db/generated/prisma/client";

/**
 * DataLoaders for preventing N+1 queries
 * Per-request lifecycle - batches queries automatically
 */
export interface DataLoaders {
  // Single entity loaders
  user: DataLoader<string, User | null>;
  actor: DataLoader<string, Actor | null>;
  company: DataLoader<string, Company | null>;
  department: DataLoader<string, Department | null>;
  employee: DataLoader<string, Employee | null>;
  grade: DataLoader<number, Grade | null>;
  process: DataLoader<string, Process | null>;
  taskAssignment: DataLoader<string, TaskAssignment | null>;
  loadSnapshot: DataLoader<string, LoadSnapshot | null>;
  gapAnalysis: DataLoader<string, GapAnalysisResult | null>;
  employeeHistory: DataLoader<string, EmployeeHistory | null>;
  auditLog: DataLoader<string, AuditLog | null>;
  role: DataLoader<string, Role | null>;
  permission: DataLoader<string, Permission | null>;

  // Batch collection loaders
  employeesByDepartment: DataLoader<string, Employee[]>;
  tasksByEmployee: DataLoader<string, TaskAssignment[]>;
  snapshotsByEmployee: DataLoader<string, LoadSnapshot[]>;
  actorsByCompany: DataLoader<string, Actor[]>;
  actorsByDepartment: DataLoader<string, Actor[]>;
}

/**
 * Cache management interface for services
 * Services invalidate caches after mutations
 */
export interface CacheManager {
  invalidate(keys: string[]): void;
  getCacheKey(domain: string, id: string): string;
  set(key: string, value: any, ttlMs?: number): void;
  get(key: string): any;
  clear(): void;
}

/**
 * Main GraphQL Request Context
 *
 * This is the contract that all services depend on.
 * Services should NOT depend on GraphQL framework,
 * only on what's in this context.
 *
 * @see ServiceFactory - creates services with this context
 * @see BaseService - all services extend this and use context
 */
export interface ServiceContext {
  // ==================== Authentication ====================
  /** User ID from JWT or session - null if unauthenticated */
  userId: string | null;

  /** Authenticated user object (auth only) - undefined if unauthenticated */
  user?: User;

  /** Business actor object - undefined if not authenticated as business user */
  actor?: Actor;

  /** Request is from authenticated user */
  isAuthenticated: boolean;

  // ==================== Database ====================
  /** Prisma ORM Client - use for complex queries */
  prisma: PrismaClient;

  // ==================== DataLoaders (N+1 Prevention) ====================
  /** Per-request DataLoaders for automatic batching */
  dataloaders: DataLoaders;

  // ==================== Cache Management ====================
  /** Cache management interface */
  cache: CacheManager;

  // ==================== Request Metadata ====================
  /** Unique request ID for tracing */
  requestId: string;

  /** Request timestamp */
  timestamp: Date;

  /** Request path (for context) */
  path?: string;

  /** Request user agent (for audit) */
  userAgent?: string;

  // ==================== Error Handling ====================
  /** Errors accumulated during request execution */
  errors: GraphQLError[];
}

/**
 * Errors possible in GraphQL context
 */
export interface GraphQLError {
  code: string;
  message: string;
  extensions?: Record<string, any>;
}

/**
 * Context builder options
 */
export interface ContextBuilderOptions {
  userId?: string;
  user?: User;
  requestId?: string;
  path?: string;
  userAgent?: string;
}

/**
 * For Express/Apollo middleware - context function signature
 */
export type GraphQLContextFn = (
  options: ContextBuilderOptions,
) => Promise<ServiceContext>;
