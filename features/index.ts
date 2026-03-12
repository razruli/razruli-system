// Features - User actions and workflows organized by domain

/**
 * Feature-Sliced Design: Features layer
 *
 * Features coordinate entity data with client state to deliver user workflows.
 * Organized by database domains to mirror backend structure.
 *
 * Domains:
 * - core/     - Employee, Department, Grade management
 * - operations/ - Process, Task management and assignment
 * - analytics/  - Workload analysis, Gap analysis, Hiring metrics
 * - common/   - System features not tied to specific entities
 */

// Core domain features
export * as core from "./core";

// Operations domain features
export * as operations from "./operations";

// Analytics domain features
export * as analytics from "./analytics";

// Common/system features
export * as common from "./common";
