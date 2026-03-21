/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "query GetCompanyBySlug($slug: String!) {\n  companyBySlug(slug: $slug) {\n    id\n    name\n    slug\n    timezone\n    workingHoursDay\n    workingDaysPerMonth\n  }\n}": typeof types.GetCompanyBySlugDocument,
    "mutation AssignDepartmentHead($departmentId: String!, $employeeId: String!) {\n  assignDepartmentHead(departmentId: $departmentId, employeeId: $employeeId) {\n    id\n    name\n    headId\n    head {\n      id\n      firstName\n      lastName\n      gradeId\n    }\n    updatedAt\n  }\n}": typeof types.AssignDepartmentHeadDocument,
    "mutation CreateDepartment($input: CreateDepartmentInput!) {\n  createDepartment(input: $input) {\n    id\n    companyId\n    name\n    headId\n    createdAt\n    updatedAt\n  }\n}": typeof types.CreateDepartmentDocument,
    "mutation DeleteDepartment($id: String!) {\n  deleteDepartment(id: $id)\n}": typeof types.DeleteDepartmentDocument,
    "mutation UpdateDepartment($id: String!, $input: UpdateDepartmentInput!) {\n  updateDepartment(id: $id, input: $input) {\n    id\n    companyId\n    name\n    headId\n    head {\n      id\n      firstName\n      lastName\n    }\n    updatedAt\n  }\n}": typeof types.UpdateDepartmentDocument,
    "query GetDepartment($id: String!) {\n  department(id: $id) {\n    id\n    companyId\n    name\n    headId\n    head {\n      id\n      firstName\n      lastName\n      gradeId\n    }\n    createdAt\n    updatedAt\n  }\n}": typeof types.GetDepartmentDocument,
    "query GetDepartmentWithMetrics($id: String!, $periodStart: DateTime, $periodEnd: DateTime) {\n  departmentWithMetrics(id: $id, periodStart: $periodStart, periodEnd: $periodEnd) {\n    department {\n      id\n      companyId\n      name\n      headId\n      head {\n        id\n        firstName\n        lastName\n      }\n    }\n    totalEmployees\n    activeEmployees\n    overloadedCount\n    totalCapacity\n    totalLoad\n    loadIndex\n  }\n}": typeof types.GetDepartmentWithMetricsDocument,
    "query GetDepartments($filter: DepartmentFilterInput!) {\n  departments(filter: $filter) {\n    nodes {\n      id\n      companyId\n      name\n      headId\n      head {\n        id\n        firstName\n        lastName\n        gradeId\n      }\n      createdAt\n      updatedAt\n    }\n    totalCount\n    pageInfo {\n      hasMore\n      offset\n      limit\n      total\n    }\n  }\n}": typeof types.GetDepartmentsDocument,
    "mutation CreateEmployee($input: CreateEmployeeInput!) {\n  createEmployee(input: $input) {\n    id\n    companyId\n    departmentId\n    firstName\n    lastName\n    gradeId\n    status\n    createdAt\n    updatedAt\n  }\n}": typeof types.CreateEmployeeDocument,
    "mutation DismissEmployee($id: String!, $reason: String) {\n  dismissEmployee(id: $id, reason: $reason) {\n    id\n    status\n    fireDate\n    updatedAt\n  }\n}": typeof types.DismissEmployeeDocument,
    "mutation UpdateEmployee($id: String!, $input: UpdateEmployeeInput!) {\n  updateEmployee(id: $id, input: $input) {\n    id\n    companyId\n    departmentId\n    firstName\n    lastName\n    gradeId\n    gender\n    status\n    kEfficiency\n    workingHoursPerDay\n    updatedAt\n  }\n}": typeof types.UpdateEmployeeDocument,
    "mutation UpdateEmployeeEfficiency($id: String!, $kEfficiency: Float!) {\n  updateEmployeeEfficiency(id: $id, kEfficiency: $kEfficiency) {\n    id\n    kEfficiency\n    updatedAt\n  }\n}": typeof types.UpdateEmployeeEfficiencyDocument,
    "query GetDepartmentEmployees($departmentId: String!) {\n  departmentEmployees(departmentId: $departmentId) {\n    id\n    companyId\n    departmentId\n    firstName\n    lastName\n    gradeId\n    grade {\n      id\n      name\n      kGrade\n    }\n    gender\n    hireDate\n    fireDate\n    kEfficiency\n    employmentType\n    status\n    workingHoursPerDay\n    createdAt\n    updatedAt\n  }\n}": typeof types.GetDepartmentEmployeesDocument,
    "query GetEmployee($id: String!) {\n  employee(id: $id) {\n    id\n    companyId\n    departmentId\n    department {\n      id\n      name\n    }\n    firstName\n    lastName\n    gradeId\n    grade {\n      id\n      name\n      kGrade\n    }\n    gender\n    birthDate\n    hireDate\n    fireDate\n    kEfficiency\n    employmentType\n    status\n    workingHoursPerDay\n    createdAt\n    updatedAt\n  }\n}": typeof types.GetEmployeeDocument,
    "query GetEmployeeCapacity($id: String!) {\n  employeeCapacity(id: $id)\n}": typeof types.GetEmployeeCapacityDocument,
    "query GetEmployeeLoadIndex($id: String!, $periodStart: DateTime!, $periodEnd: DateTime!) {\n  employeeLoadIndex(id: $id, periodStart: $periodStart, periodEnd: $periodEnd)\n}": typeof types.GetEmployeeLoadIndexDocument,
    "query GetEmployees($filter: EmployeeFilterInput, $pagination: EmployeePaginationInput) {\n  employees(filter: $filter, pagination: $pagination) {\n    nodes {\n      id\n      companyId\n      departmentId\n      department {\n        id\n        name\n      }\n      firstName\n      lastName\n      gradeId\n      grade {\n        id\n        name\n        kGrade\n      }\n      gender\n      birthDate\n      hireDate\n      fireDate\n      kEfficiency\n      employmentType\n      status\n      workingHoursPerDay\n      createdAt\n      updatedAt\n    }\n    totalCount\n    pageInfo {\n      hasMore\n      offset\n      limit\n      total\n    }\n  }\n}": typeof types.GetEmployeesDocument,
    "query GetProcesses($filter: ProcessFilterInput, $pagination: ProcessPaginationInput) {\n  processes(filter: $filter, pagination: $pagination) {\n    nodes {\n      id\n      companyId\n      departmentId\n      name\n      description\n      processType\n      capacityUnits\n      kMultiplier\n      estimatedDurationDays\n      status\n      priority\n      createdAt\n      updatedAt\n      startedAt\n      completedAt\n      company {\n        id\n        name\n      }\n      department {\n        id\n        name\n      }\n    }\n    totalCount\n    pageInfo {\n      hasMore\n      offset\n      limit\n      total\n    }\n  }\n}": typeof types.GetProcessesDocument,
};
const documents: Documents = {
    "query GetCompanyBySlug($slug: String!) {\n  companyBySlug(slug: $slug) {\n    id\n    name\n    slug\n    timezone\n    workingHoursDay\n    workingDaysPerMonth\n  }\n}": types.GetCompanyBySlugDocument,
    "mutation AssignDepartmentHead($departmentId: String!, $employeeId: String!) {\n  assignDepartmentHead(departmentId: $departmentId, employeeId: $employeeId) {\n    id\n    name\n    headId\n    head {\n      id\n      firstName\n      lastName\n      gradeId\n    }\n    updatedAt\n  }\n}": types.AssignDepartmentHeadDocument,
    "mutation CreateDepartment($input: CreateDepartmentInput!) {\n  createDepartment(input: $input) {\n    id\n    companyId\n    name\n    headId\n    createdAt\n    updatedAt\n  }\n}": types.CreateDepartmentDocument,
    "mutation DeleteDepartment($id: String!) {\n  deleteDepartment(id: $id)\n}": types.DeleteDepartmentDocument,
    "mutation UpdateDepartment($id: String!, $input: UpdateDepartmentInput!) {\n  updateDepartment(id: $id, input: $input) {\n    id\n    companyId\n    name\n    headId\n    head {\n      id\n      firstName\n      lastName\n    }\n    updatedAt\n  }\n}": types.UpdateDepartmentDocument,
    "query GetDepartment($id: String!) {\n  department(id: $id) {\n    id\n    companyId\n    name\n    headId\n    head {\n      id\n      firstName\n      lastName\n      gradeId\n    }\n    createdAt\n    updatedAt\n  }\n}": types.GetDepartmentDocument,
    "query GetDepartmentWithMetrics($id: String!, $periodStart: DateTime, $periodEnd: DateTime) {\n  departmentWithMetrics(id: $id, periodStart: $periodStart, periodEnd: $periodEnd) {\n    department {\n      id\n      companyId\n      name\n      headId\n      head {\n        id\n        firstName\n        lastName\n      }\n    }\n    totalEmployees\n    activeEmployees\n    overloadedCount\n    totalCapacity\n    totalLoad\n    loadIndex\n  }\n}": types.GetDepartmentWithMetricsDocument,
    "query GetDepartments($filter: DepartmentFilterInput!) {\n  departments(filter: $filter) {\n    nodes {\n      id\n      companyId\n      name\n      headId\n      head {\n        id\n        firstName\n        lastName\n        gradeId\n      }\n      createdAt\n      updatedAt\n    }\n    totalCount\n    pageInfo {\n      hasMore\n      offset\n      limit\n      total\n    }\n  }\n}": types.GetDepartmentsDocument,
    "mutation CreateEmployee($input: CreateEmployeeInput!) {\n  createEmployee(input: $input) {\n    id\n    companyId\n    departmentId\n    firstName\n    lastName\n    gradeId\n    status\n    createdAt\n    updatedAt\n  }\n}": types.CreateEmployeeDocument,
    "mutation DismissEmployee($id: String!, $reason: String) {\n  dismissEmployee(id: $id, reason: $reason) {\n    id\n    status\n    fireDate\n    updatedAt\n  }\n}": types.DismissEmployeeDocument,
    "mutation UpdateEmployee($id: String!, $input: UpdateEmployeeInput!) {\n  updateEmployee(id: $id, input: $input) {\n    id\n    companyId\n    departmentId\n    firstName\n    lastName\n    gradeId\n    gender\n    status\n    kEfficiency\n    workingHoursPerDay\n    updatedAt\n  }\n}": types.UpdateEmployeeDocument,
    "mutation UpdateEmployeeEfficiency($id: String!, $kEfficiency: Float!) {\n  updateEmployeeEfficiency(id: $id, kEfficiency: $kEfficiency) {\n    id\n    kEfficiency\n    updatedAt\n  }\n}": types.UpdateEmployeeEfficiencyDocument,
    "query GetDepartmentEmployees($departmentId: String!) {\n  departmentEmployees(departmentId: $departmentId) {\n    id\n    companyId\n    departmentId\n    firstName\n    lastName\n    gradeId\n    grade {\n      id\n      name\n      kGrade\n    }\n    gender\n    hireDate\n    fireDate\n    kEfficiency\n    employmentType\n    status\n    workingHoursPerDay\n    createdAt\n    updatedAt\n  }\n}": types.GetDepartmentEmployeesDocument,
    "query GetEmployee($id: String!) {\n  employee(id: $id) {\n    id\n    companyId\n    departmentId\n    department {\n      id\n      name\n    }\n    firstName\n    lastName\n    gradeId\n    grade {\n      id\n      name\n      kGrade\n    }\n    gender\n    birthDate\n    hireDate\n    fireDate\n    kEfficiency\n    employmentType\n    status\n    workingHoursPerDay\n    createdAt\n    updatedAt\n  }\n}": types.GetEmployeeDocument,
    "query GetEmployeeCapacity($id: String!) {\n  employeeCapacity(id: $id)\n}": types.GetEmployeeCapacityDocument,
    "query GetEmployeeLoadIndex($id: String!, $periodStart: DateTime!, $periodEnd: DateTime!) {\n  employeeLoadIndex(id: $id, periodStart: $periodStart, periodEnd: $periodEnd)\n}": types.GetEmployeeLoadIndexDocument,
    "query GetEmployees($filter: EmployeeFilterInput, $pagination: EmployeePaginationInput) {\n  employees(filter: $filter, pagination: $pagination) {\n    nodes {\n      id\n      companyId\n      departmentId\n      department {\n        id\n        name\n      }\n      firstName\n      lastName\n      gradeId\n      grade {\n        id\n        name\n        kGrade\n      }\n      gender\n      birthDate\n      hireDate\n      fireDate\n      kEfficiency\n      employmentType\n      status\n      workingHoursPerDay\n      createdAt\n      updatedAt\n    }\n    totalCount\n    pageInfo {\n      hasMore\n      offset\n      limit\n      total\n    }\n  }\n}": types.GetEmployeesDocument,
    "query GetProcesses($filter: ProcessFilterInput, $pagination: ProcessPaginationInput) {\n  processes(filter: $filter, pagination: $pagination) {\n    nodes {\n      id\n      companyId\n      departmentId\n      name\n      description\n      processType\n      capacityUnits\n      kMultiplier\n      estimatedDurationDays\n      status\n      priority\n      createdAt\n      updatedAt\n      startedAt\n      completedAt\n      company {\n        id\n        name\n      }\n      department {\n        id\n        name\n      }\n    }\n    totalCount\n    pageInfo {\n      hasMore\n      offset\n      limit\n      total\n    }\n  }\n}": types.GetProcessesDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetCompanyBySlug($slug: String!) {\n  companyBySlug(slug: $slug) {\n    id\n    name\n    slug\n    timezone\n    workingHoursDay\n    workingDaysPerMonth\n  }\n}"): (typeof documents)["query GetCompanyBySlug($slug: String!) {\n  companyBySlug(slug: $slug) {\n    id\n    name\n    slug\n    timezone\n    workingHoursDay\n    workingDaysPerMonth\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation AssignDepartmentHead($departmentId: String!, $employeeId: String!) {\n  assignDepartmentHead(departmentId: $departmentId, employeeId: $employeeId) {\n    id\n    name\n    headId\n    head {\n      id\n      firstName\n      lastName\n      gradeId\n    }\n    updatedAt\n  }\n}"): (typeof documents)["mutation AssignDepartmentHead($departmentId: String!, $employeeId: String!) {\n  assignDepartmentHead(departmentId: $departmentId, employeeId: $employeeId) {\n    id\n    name\n    headId\n    head {\n      id\n      firstName\n      lastName\n      gradeId\n    }\n    updatedAt\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CreateDepartment($input: CreateDepartmentInput!) {\n  createDepartment(input: $input) {\n    id\n    companyId\n    name\n    headId\n    createdAt\n    updatedAt\n  }\n}"): (typeof documents)["mutation CreateDepartment($input: CreateDepartmentInput!) {\n  createDepartment(input: $input) {\n    id\n    companyId\n    name\n    headId\n    createdAt\n    updatedAt\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation DeleteDepartment($id: String!) {\n  deleteDepartment(id: $id)\n}"): (typeof documents)["mutation DeleteDepartment($id: String!) {\n  deleteDepartment(id: $id)\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation UpdateDepartment($id: String!, $input: UpdateDepartmentInput!) {\n  updateDepartment(id: $id, input: $input) {\n    id\n    companyId\n    name\n    headId\n    head {\n      id\n      firstName\n      lastName\n    }\n    updatedAt\n  }\n}"): (typeof documents)["mutation UpdateDepartment($id: String!, $input: UpdateDepartmentInput!) {\n  updateDepartment(id: $id, input: $input) {\n    id\n    companyId\n    name\n    headId\n    head {\n      id\n      firstName\n      lastName\n    }\n    updatedAt\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetDepartment($id: String!) {\n  department(id: $id) {\n    id\n    companyId\n    name\n    headId\n    head {\n      id\n      firstName\n      lastName\n      gradeId\n    }\n    createdAt\n    updatedAt\n  }\n}"): (typeof documents)["query GetDepartment($id: String!) {\n  department(id: $id) {\n    id\n    companyId\n    name\n    headId\n    head {\n      id\n      firstName\n      lastName\n      gradeId\n    }\n    createdAt\n    updatedAt\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetDepartmentWithMetrics($id: String!, $periodStart: DateTime, $periodEnd: DateTime) {\n  departmentWithMetrics(id: $id, periodStart: $periodStart, periodEnd: $periodEnd) {\n    department {\n      id\n      companyId\n      name\n      headId\n      head {\n        id\n        firstName\n        lastName\n      }\n    }\n    totalEmployees\n    activeEmployees\n    overloadedCount\n    totalCapacity\n    totalLoad\n    loadIndex\n  }\n}"): (typeof documents)["query GetDepartmentWithMetrics($id: String!, $periodStart: DateTime, $periodEnd: DateTime) {\n  departmentWithMetrics(id: $id, periodStart: $periodStart, periodEnd: $periodEnd) {\n    department {\n      id\n      companyId\n      name\n      headId\n      head {\n        id\n        firstName\n        lastName\n      }\n    }\n    totalEmployees\n    activeEmployees\n    overloadedCount\n    totalCapacity\n    totalLoad\n    loadIndex\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetDepartments($filter: DepartmentFilterInput!) {\n  departments(filter: $filter) {\n    nodes {\n      id\n      companyId\n      name\n      headId\n      head {\n        id\n        firstName\n        lastName\n        gradeId\n      }\n      createdAt\n      updatedAt\n    }\n    totalCount\n    pageInfo {\n      hasMore\n      offset\n      limit\n      total\n    }\n  }\n}"): (typeof documents)["query GetDepartments($filter: DepartmentFilterInput!) {\n  departments(filter: $filter) {\n    nodes {\n      id\n      companyId\n      name\n      headId\n      head {\n        id\n        firstName\n        lastName\n        gradeId\n      }\n      createdAt\n      updatedAt\n    }\n    totalCount\n    pageInfo {\n      hasMore\n      offset\n      limit\n      total\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CreateEmployee($input: CreateEmployeeInput!) {\n  createEmployee(input: $input) {\n    id\n    companyId\n    departmentId\n    firstName\n    lastName\n    gradeId\n    status\n    createdAt\n    updatedAt\n  }\n}"): (typeof documents)["mutation CreateEmployee($input: CreateEmployeeInput!) {\n  createEmployee(input: $input) {\n    id\n    companyId\n    departmentId\n    firstName\n    lastName\n    gradeId\n    status\n    createdAt\n    updatedAt\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation DismissEmployee($id: String!, $reason: String) {\n  dismissEmployee(id: $id, reason: $reason) {\n    id\n    status\n    fireDate\n    updatedAt\n  }\n}"): (typeof documents)["mutation DismissEmployee($id: String!, $reason: String) {\n  dismissEmployee(id: $id, reason: $reason) {\n    id\n    status\n    fireDate\n    updatedAt\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation UpdateEmployee($id: String!, $input: UpdateEmployeeInput!) {\n  updateEmployee(id: $id, input: $input) {\n    id\n    companyId\n    departmentId\n    firstName\n    lastName\n    gradeId\n    gender\n    status\n    kEfficiency\n    workingHoursPerDay\n    updatedAt\n  }\n}"): (typeof documents)["mutation UpdateEmployee($id: String!, $input: UpdateEmployeeInput!) {\n  updateEmployee(id: $id, input: $input) {\n    id\n    companyId\n    departmentId\n    firstName\n    lastName\n    gradeId\n    gender\n    status\n    kEfficiency\n    workingHoursPerDay\n    updatedAt\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation UpdateEmployeeEfficiency($id: String!, $kEfficiency: Float!) {\n  updateEmployeeEfficiency(id: $id, kEfficiency: $kEfficiency) {\n    id\n    kEfficiency\n    updatedAt\n  }\n}"): (typeof documents)["mutation UpdateEmployeeEfficiency($id: String!, $kEfficiency: Float!) {\n  updateEmployeeEfficiency(id: $id, kEfficiency: $kEfficiency) {\n    id\n    kEfficiency\n    updatedAt\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetDepartmentEmployees($departmentId: String!) {\n  departmentEmployees(departmentId: $departmentId) {\n    id\n    companyId\n    departmentId\n    firstName\n    lastName\n    gradeId\n    grade {\n      id\n      name\n      kGrade\n    }\n    gender\n    hireDate\n    fireDate\n    kEfficiency\n    employmentType\n    status\n    workingHoursPerDay\n    createdAt\n    updatedAt\n  }\n}"): (typeof documents)["query GetDepartmentEmployees($departmentId: String!) {\n  departmentEmployees(departmentId: $departmentId) {\n    id\n    companyId\n    departmentId\n    firstName\n    lastName\n    gradeId\n    grade {\n      id\n      name\n      kGrade\n    }\n    gender\n    hireDate\n    fireDate\n    kEfficiency\n    employmentType\n    status\n    workingHoursPerDay\n    createdAt\n    updatedAt\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetEmployee($id: String!) {\n  employee(id: $id) {\n    id\n    companyId\n    departmentId\n    department {\n      id\n      name\n    }\n    firstName\n    lastName\n    gradeId\n    grade {\n      id\n      name\n      kGrade\n    }\n    gender\n    birthDate\n    hireDate\n    fireDate\n    kEfficiency\n    employmentType\n    status\n    workingHoursPerDay\n    createdAt\n    updatedAt\n  }\n}"): (typeof documents)["query GetEmployee($id: String!) {\n  employee(id: $id) {\n    id\n    companyId\n    departmentId\n    department {\n      id\n      name\n    }\n    firstName\n    lastName\n    gradeId\n    grade {\n      id\n      name\n      kGrade\n    }\n    gender\n    birthDate\n    hireDate\n    fireDate\n    kEfficiency\n    employmentType\n    status\n    workingHoursPerDay\n    createdAt\n    updatedAt\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetEmployeeCapacity($id: String!) {\n  employeeCapacity(id: $id)\n}"): (typeof documents)["query GetEmployeeCapacity($id: String!) {\n  employeeCapacity(id: $id)\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetEmployeeLoadIndex($id: String!, $periodStart: DateTime!, $periodEnd: DateTime!) {\n  employeeLoadIndex(id: $id, periodStart: $periodStart, periodEnd: $periodEnd)\n}"): (typeof documents)["query GetEmployeeLoadIndex($id: String!, $periodStart: DateTime!, $periodEnd: DateTime!) {\n  employeeLoadIndex(id: $id, periodStart: $periodStart, periodEnd: $periodEnd)\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetEmployees($filter: EmployeeFilterInput, $pagination: EmployeePaginationInput) {\n  employees(filter: $filter, pagination: $pagination) {\n    nodes {\n      id\n      companyId\n      departmentId\n      department {\n        id\n        name\n      }\n      firstName\n      lastName\n      gradeId\n      grade {\n        id\n        name\n        kGrade\n      }\n      gender\n      birthDate\n      hireDate\n      fireDate\n      kEfficiency\n      employmentType\n      status\n      workingHoursPerDay\n      createdAt\n      updatedAt\n    }\n    totalCount\n    pageInfo {\n      hasMore\n      offset\n      limit\n      total\n    }\n  }\n}"): (typeof documents)["query GetEmployees($filter: EmployeeFilterInput, $pagination: EmployeePaginationInput) {\n  employees(filter: $filter, pagination: $pagination) {\n    nodes {\n      id\n      companyId\n      departmentId\n      department {\n        id\n        name\n      }\n      firstName\n      lastName\n      gradeId\n      grade {\n        id\n        name\n        kGrade\n      }\n      gender\n      birthDate\n      hireDate\n      fireDate\n      kEfficiency\n      employmentType\n      status\n      workingHoursPerDay\n      createdAt\n      updatedAt\n    }\n    totalCount\n    pageInfo {\n      hasMore\n      offset\n      limit\n      total\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetProcesses($filter: ProcessFilterInput, $pagination: ProcessPaginationInput) {\n  processes(filter: $filter, pagination: $pagination) {\n    nodes {\n      id\n      companyId\n      departmentId\n      name\n      description\n      processType\n      capacityUnits\n      kMultiplier\n      estimatedDurationDays\n      status\n      priority\n      createdAt\n      updatedAt\n      startedAt\n      completedAt\n      company {\n        id\n        name\n      }\n      department {\n        id\n        name\n      }\n    }\n    totalCount\n    pageInfo {\n      hasMore\n      offset\n      limit\n      total\n    }\n  }\n}"): (typeof documents)["query GetProcesses($filter: ProcessFilterInput, $pagination: ProcessPaginationInput) {\n  processes(filter: $filter, pagination: $pagination) {\n    nodes {\n      id\n      companyId\n      departmentId\n      name\n      description\n      processType\n      capacityUnits\n      kMultiplier\n      estimatedDurationDays\n      status\n      priority\n      createdAt\n      updatedAt\n      startedAt\n      completedAt\n      company {\n        id\n        name\n      }\n      department {\n        id\n        name\n      }\n    }\n    totalCount\n    pageInfo {\n      hasMore\n      offset\n      limit\n      total\n    }\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;