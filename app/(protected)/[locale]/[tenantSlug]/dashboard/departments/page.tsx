import { GetCompanyBySlugDocument } from "@/entities/core/company";
import { GetDepartmentsDocument } from "@/entities/core/department";
import { query } from "@/shared/lib/apollo-client/apolloClient";
import { ScrollArea } from "@/shared/ui/shadcn/scroll-area";

/**
 * Departments list component
 */
function DepartmentsList({ departments }: { departments: any[] }) {
  if (!departments || departments.length === 0) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        No departments found.
      </div>
    );
  }

  return (
    <div className="space-y-2 p-6">
      <h3 className="text-lg font-semibold mb-4">
        Departments ({departments.length})
      </h3>
      <div className="space-y-2">
        {departments.map((department) => (
          <div
            key={department.id}
            className="p-3 border rounded-lg bg-card hover:bg-muted transition-colors"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{department.name}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Departments Page - Server Component
 * Uses preloaded data from layout
 */
export default async function DepartmentsPage({
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

  if (!companyId) {
    console.error(
      "[DepartmentsPage] Company not found. Slug:",
      tenantSlug,
      "Response:",
      companyData,
    );
    return (
      <ScrollArea className="flex-1">
        <div className="p-6 text-center text-destructive">
          Company not found. Slug: {tenantSlug}
        </div>
      </ScrollArea>
    );
  }

  // Get departments from cache (preloaded in layout)
  const { data: departmentsData } = await query({
    query: GetDepartmentsDocument,
    variables: { filter: { companyId } },
  });

  const departments = departmentsData?.departments?.nodes || [];

  return (
    <ScrollArea className="flex-1">
      <DepartmentsList departments={departments} />
    </ScrollArea>
  );
}
