import { GetCompanyBySlugDocument } from "@/entities/core/company";
import { GetEmployeesDocument } from "@/entities/core/employee";
import { query } from "@/shared/lib/apollo-client/apolloClient";
import { ScrollArea } from "@/shared/ui/shadcn/scroll-area";

/**
 * Employees list component
 */
function EmployeesList({ employees }: { employees: any[] }) {
  if (!employees || employees.length === 0) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        No employees found.
      </div>
    );
  }

  return (
    <div className="space-y-2 p-6">
      <h3 className="text-lg font-semibold mb-4">
        Employees ({employees.length})
      </h3>
      <div className="space-y-2">
        {employees.map((employee) => (
          <div
            key={employee.id}
            className="p-3 border rounded-lg bg-card hover:bg-muted transition-colors"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">
                  {employee.firstName} {employee.lastName}
                </p>
                <p className="text-sm text-muted-foreground">
                  {employee.grade?.name} • {employee.department?.name}
                </p>
              </div>
              <p className="text-xs bg-primary/10 px-2 py-1 rounded">
                {employee.status}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Employees Page - Server Component
 * Uses preloaded data from layout
 */
export default async function EmployeesPage({
  params,
}: {
  params: Promise<{ tenantSlug: string }>;
}) {
  const { tenantSlug } = await params;

  // Get company from cache (preloaded in layout)
  const { data: companyData } = await query({
    query: GetCompanyBySlugDocument,
    variables: { slug: tenantSlug },
  });

  const companyId = companyData?.companyBySlug?.id;

  // if (!companyId) {
  //   console.error(
  //     "[EmployeesPage] Company not found. Slug:",
  //     tenantSlug,
  //     "Response:",
  //     companyData,
  //   );
  //   return (
  //     <ScrollArea className="flex-1">
  //       <div className="p-6 text-center text-destructive">
  //         Company not found. Slug: {tenantSlug}
  //       </div>
  //     </ScrollArea>
  //   );
  // }

  // Get employees from cache (preloaded in layout)
  const { data: employeesData } = await query({
    query: GetEmployeesDocument,
    variables: { filter: { companyId } },
  });

  const employees = employeesData?.employees?.nodes || [];

  return (
    <ScrollArea className="flex-1">
      <EmployeesList employees={employees} />
    </ScrollArea>
  );
}
