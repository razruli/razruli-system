import { gql } from "@apollo/client";

// Query for current user preload
export const PRELOAD_USER_QUERY = gql`
  query PreloadUser {
    me {
      id
      name
      email
    }
  }
`;

// ============================================
// OVERVIEW PAGE QUERIES
// ============================================

export const DASHBOARD_OVERVIEW_QUERY = gql`
  query DashboardOverview {
    stats {
      totalEmployees
      totalDepartments
      activeProcesses
      averageWorkload
    }
    departments {
      id
      name
      capacity
      headcount
      status
    }
    recentActivity {
      id
      type
      description
      timestamp
      user {
        name
      }
    }
  }
`;

// ============================================
// EMPLOYEES PAGE QUERIES
// ============================================

export const EMPLOYEES_PAGE_QUERY = gql`
  query EmployeesPage($first: Int, $offset: Int, $filter: EmployeeFilter) {
    employees(first: $first, offset: $offset, filter: $filter) {
      edges {
        id
        name
        initials
        email
        department {
          id
          name
        }
        role
        workload
        processes {
          id
        }
        status
        hireDate
      }
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
    }
    departments {
      id
      name
    }
  }
`;

// ============================================
// DEPARTMENTS PAGE QUERIES
// ============================================

export const DEPARTMENTS_PAGE_QUERY = gql`
  query DepartmentsPage($first: Int, $offset: Int) {
    departments(first: $first, offset: $offset) {
      edges {
        id
        name
        description
        headcount
        budget
        capacity
        status
        manager {
          id
          name
        }
      }
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

// ============================================
// PROCESSES PAGE QUERIES
// ============================================

export const PROCESSES_PAGE_QUERY = gql`
  query ProcessesPage($first: Int, $offset: Int, $filter: ProcessFilter) {
    processes(first: $first, offset: $offset, filter: $filter) {
      edges {
        id
        name
        description
        owner {
          id
          name
        }
        department {
          id
          name
        }
        status
        taskCount
        assignedTo {
          id
          name
        }
      }
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
    }
    departments {
      id
      name
    }
  }
`;

// ============================================
// WORKLOAD PAGE QUERIES
// ============================================

export const WORKLOAD_PAGE_QUERY = gql`
  query WorkloadPage {
    workloadTrend(days: 90) {
      date
      average
      min
      max
    }
    departmentWorkload {
      id
      name
      capacity
      headcount
      status
    }
    employeeWorkload {
      id
      name
      workload
      status
      department {
        name
      }
    }
    capacityForecast(months: 6) {
      month
      projectedCapacity
      hires
      departures
    }
  }
`;

// ============================================
// HIRING PAGE QUERIES
// ============================================

export const HIRING_PAGE_QUERY = gql`
  query HiringPage {
    hiringStats {
      openPositions
      filledPositions
      hiringRate
      averageTimeToHire
    }
    positions(filter: { status: OPEN }) {
      id
      title
      department {
        id
        name
      }
      status
      postedDate
      targetHireDate
      candidates {
        id
      }
    }
    hiringTrend(months: 6) {
      month
      hires
      departures
      openPositions
    }
    departmentHiringPlans {
      id
      department {
        name
      }
      targetHires
      currentHires
      progress
    }
  }
`;
