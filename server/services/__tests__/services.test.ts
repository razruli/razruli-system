// // ============================================================================
// // TESTING SERVICES
// // ============================================================================
// // Examples of how to test services with mocked context
// // Services are framework-independent so testing is straightforward
// // ============================================================================

// import { ServiceFactory } from "@/server/services";
// import { ServiceContext } from "@/server/types/context";

// import { EmployeeService } from "../core";

// /**
//  * Mock ServiceContext for testing
//  * No GraphQL dependency - pure TypeScript
//  */
// export function createMockContext(
//   overrides?: Partial<ServiceContext>,
// ): ServiceContext {
//   return {
//     userId: "test-user-123",
//     user: undefined,
//     isAuthenticated: true,
//     prisma: mockPrisma(),
//     dataloaders: mockDataLoaders(),
//     cache: mockCache(),
//     requestId: "req-" + Math.random().toString(),
//     timestamp: new Date(),
//     errors: [],
//     ...overrides,
//   };
// }

// // ==================== SERVICE TESTS ====================

// describe("EmployeeService", () => {
//   let service: EmployeeService;
//   let mockContext: ServiceContext;

//   beforeEach(() => {
//     mockContext = createMockContext();
//     service = new EmployeeService(mockContext);
//   });

//   /**
//    * Test: getById uses DataLoader
//    */
//   test("getById should use DataLoader for batching", async () => {
//     // Mock DataLoader to track calls
//     const loadSpy = jest.spyOn(mockContext.dataloaders.employee, "load");

//     const emp = { id: "123", fio: "John Doe", gradeId: 3 };
//     mockContext.dataloaders.employee.load = jest.fn().mockResolvedValue(emp);

//     const result = await service.getById("123");

//     expect(loadSpy).toHaveBeenCalledWith("123");
//     expect(result).toEqual(emp);
//   });

//   /**
//    * Test: getByDepartment uses cache
//    */
//   test("getByDepartment should cache results", async () => {
//     const employees = [
//       { id: "1", fio: "Alice", departmentId: "eng", gradeId: 4 },
//       { id: "2", fio: "Bob", departmentId: "eng", gradeId: 3 },
//     ];

//     jest
//       .spyOn(mockContext.prisma.employee, "findMany")
//       .mockResolvedValue(employees as any);

//     const cacheSpy = jest.spyOn(mockContext.cache, "get");

//     // First call - hits database
//     const result1 = await service.getByDepartment("eng");
//     expect(mockContext.prisma.employee.findMany).toHaveBeenCalledTimes(1);

//     // Second call - uses cache
//     const result2 = await service.getByDepartment("eng");
//     expect(mockContext.prisma.employee.findMany).toHaveBeenCalledTimes(1); // Still 1

//     expect(result1).toEqual(employees);
//     expect(result2).toEqual(employees);
//   });

//   /**
//    * Test: create validates input
//    */
//   test("create should throw ValidationError on duplicate name", async () => {
//     jest.spyOn(mockContext.prisma.employee, "findUnique").mockResolvedValue({
//       id: "existing",
//     } as any);

//     await expect(
//       service.create({
//         companyId: "acme",
//         departmentId: "eng",
//         fio: "John Doe",
//         gradeId: 3,
//         gender: "M",
//         hireDate: new Date(),
//       }),
//     ).rejects.toThrow("already exists");
//   });

//   /**
//    * Test: update invalidates caches
//    */
//   test("update should invalidate caches", async () => {
//     const before = {
//       id: "123",
//       fio: "John Doe",
//       departmentId: "eng",
//       gradeId: 3,
//     };
//     const after = { ...before, gradeId: 4 };

//     jest
//       .spyOn(mockContext.prisma.employee, "findUnique")
//       .mockResolvedValue(before as any);
//     jest
//       .spyOn(mockContext.prisma.employee, "update")
//       .mockResolvedValue(after as any);

//     const invalidateSpy = jest.spyOn(mockContext.cache, "invalidate");

//     await service.update("123", { gradeId: 4 });

//     // Should invalidate employee cache and department list
//     expect(invalidateSpy).toHaveBeenCalled();
//   });

//   /**
//    * Test: calculateCapacity uses formula correctly
//    */
//   test("calculateCapacity should apply multipliers correctly", async () => {
//     const employee = {
//       id: "123",
//       gradeId: 3,
//       kEfficiency: 1.0,
//     };

//     const grade = {
//       level: 3,
//       kGrade: 1.5,
//     };

//     mockContext.dataloaders.employee.load = jest
//       .fn()
//       .mockResolvedValue(employee as any);
//     mockContext.dataloaders.grade.load = jest
//       .fn()
//       .mockResolvedValue(grade as any);

//     const capacity = await service.calculateCapacity("123");

//     // P_month = 1.0 * 1.5 * 1.0 * 21 = 31.5
//     expect(capacity).toBeCloseTo(31.5);
//   });
// });

// // ==================== FACTORY TESTS ====================

// describe("ServiceFactory", () => {
//   let factory: ServiceFactory;
//   let mockContext: ServiceContext;

//   beforeEach(() => {
//     mockContext = createMockContext();
//     factory = new ServiceFactory(mockContext);
//   });

//   /**
//    * Test: factory creates service instances
//    */
//   test("should create EmployeeService instance", () => {
//     const service = factory.getEmployeeService();

//     expect(service).toBeInstanceOf(EmployeeService);
//     expect(service["context"]).toBe(mockContext);
//   });

//   /**
//    * Test: factory memoizes instances
//    */
//   test("should memoize service instances", () => {
//     const service1 = factory.getEmployeeService();
//     const service2 = factory.getEmployeeService();

//     expect(service1).toBe(service2); // Same instance
//   });

//   /**
//    * Test: getServices returns all services
//    */
//   test("getServices should return all 8 services", () => {
//     const services = factory.getServices();

//     expect(services.company).toBeDefined();
//     expect(services.employee).toBeDefined();
//     expect(services.grade).toBeDefined();
//     expect(services.process).toBeDefined();
//     expect(services.taskAssignment).toBeDefined();
//     expect(services.loadSnapshot).toBeDefined();
//     expect(services.gapAnalysis).toBeDefined();
//     expect(services.employeeHistory).toBeDefined();
//     expect(services.auditLog).toBeDefined();
//   });

//   /**
//    * Test: clear resets instances
//    */
//   test("clear should reset memoized instances", () => {
//     const service1 = factory.getEmployeeService();
//     factory.clear();
//     const service2 = factory.getEmployeeService();

//     expect(service1).not.toBe(service2); // Different instances
//   });
// });

// // ==================== CROSS-DOMAIN TESTS ====================

// describe("ProcessService with EmployeeService coordination", () => {
//   let processService: any; // Would be ProcessService
//   let mockContext: ServiceContext;

//   beforeEach(() => {
//     mockContext = createMockContext();
//     const factory = new ServiceFactory(mockContext);
//     processService = factory.getProcessService();
//   });

//   /**
//    * Test: assignWithCapacityCheck prevents overload
//    */
//   test("should prevent assignment if employee would be overloaded", async () => {
//     // Mock employee at capacity
//     const emp = {
//       id: "emp-123",
//       gradeId: 2,
//       companyId: "acme",
//       departmentId: "eng",
//     };

//     const process = {
//       id: "proc-456",
//       targetGradeId: 2,
//       plannedHours: 40,
//       kBurn: 0.2,
//       kCrit: 0.1,
//       kNew: 0,
//     };

//     mockContext.dataloaders.employee.load = jest
//       .fn()
//       .mockResolvedValue(emp as any);
//     mockContext.prisma.process.findUnique = jest
//       .fn()
//       .mockResolvedValue(process as any);

//     // Mock: employee is already at capacity
//     mockContext.prisma.employee.findMany = jest.fn().mockResolvedValue([
//       {
//         id: "emp-other",
//         gradeId: 2,
//         calculatedLoad: 35000, // Already near maxQ
//       },
//     ] as any);

//     // The cross-domain call should detect overload
//     const result = await processService.assignWithCapacityCheck(
//       "proc-456",
//       "emp-123",
//     );

//     expect(result.isOverloaded).toBe(true);
//   });
// });

// // ==================== INTEGRATION TESTS ====================

// /**
//  * Test a complete workflow:
//  * 1. Create employee
//  * 2. Get employee with relations
//  * 3. Calculate capacity
//  * 4. Assign task
//  * 5. Check history
//  */
// describe("Complete Employee Workflow", () => {
//   test("should handle hire → assign → track workflow", async () => {
//     const mockContext = createMockContext();
//     const factory = new ServiceFactory(mockContext);
//     const { employee, process, history } = factory.getServices();

//     // 1. Create employee
//     jest.spyOn(mockContext.prisma.employee, "create").mockResolvedValue({
//       id: "emp-new",
//       fio: "Alice Smith",
//       gradeId: 3,
//       departmentId: "eng",
//     } as any);

//     const newEmp = await employee.create({
//       companyId: "acme",
//       departmentId: "eng",
//       fio: "Alice Smith",
//       gradeId: 3,
//       gender: "F",
//       hireDate: new Date(),
//     });

//     expect(newEmp.id).toBe("emp-new");

//     // 2. Record hire in history
//     jest.spyOn(mockContext.prisma.employeeHistory, "create").mockResolvedValue({
//       id: "hist-1",
//     } as any);

//     await history.recordHire("emp-new", "eng", 3);

//     // 3. Verify history
//     jest
//       .spyOn(mockContext.prisma.employeeHistory, "findMany")
//       .mockResolvedValue([
//         {
//           recordType: "hire",
//           effectiveDate: new Date(),
//         },
//       ] as any);

//     const historyRecords = await history.getEmployeeHistory("emp-new");

//     expect(historyRecords).toHaveLength(1);
//     expect(historyRecords[0].recordType).toBe("hire");
//   });
// });

// // ==================== MOCK IMPLEMENTATIONS ====================

// function mockPrisma() {
//   return {
//     employee: {
//       findUnique: jest.fn(),
//       findMany: jest.fn(),
//       create: jest.fn(),
//       update: jest.fn(),
//       delete: jest.fn(),
//     },
//     process: {
//       findUnique: jest.fn(),
//       findMany: jest.fn(),
//       create: jest.fn(),
//       update: jest.fn(),
//     },
//     grade: {
//       findUnique: jest.fn(),
//       findMany: jest.fn(),
//     },
//     department: {
//       findUnique: jest.fn(),
//       findMany: jest.fn(),
//     },
//     taskAssignment: {
//       findMany: jest.fn(),
//       create: jest.fn(),
//       update: jest.fn(),
//     },
//     employeeHistory: {
//       findMany: jest.fn(),
//       create: jest.fn(),
//     },
//     auditLog: {
//       findMany: jest.fn(),
//       create: jest.fn(),
//       createMany: jest.fn(),
//       deleteMany: jest.fn(),
//     },
//   };
// }

// function mockDataLoaders() {
//   return {
//     company: {
//       load: jest.fn(),
//     },
//     employee: {
//       load: jest.fn(),
//     },
//     grade: {
//       load: jest.fn(),
//     },
//     department: {
//       load: jest.fn(),
//     },
//     process: {
//       load: jest.fn(),
//     },
//     taskAssignment: {
//       load: jest.fn(),
//     },
//     loadSnapshot: {
//       load: jest.fn(),
//     },
//     employeeHistory: {
//       load: jest.fn(),
//     },
//   };
// }

// function mockCache() {
//   const cache = new Map<string, any>();

//   return {
//     get: jest.fn((key: string) => cache.get(key)),
//     set: jest.fn((key: string, value: any) => cache.set(key, value)),
//     invalidate: jest.fn((keys: string[]) => {
//       keys.forEach((k) => cache.delete(k));
//     }),
//     clear: jest.fn(() => cache.clear()),
//     getCacheKey: jest.fn(),
//   };
// }
