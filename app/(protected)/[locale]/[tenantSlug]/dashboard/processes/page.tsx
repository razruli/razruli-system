import { GetCompanyBySlugDocument } from "@/entities/core/company";
import { GetProcessesDocument } from "@/entities/operations/process";
import { query } from "@/shared/lib/apollo-client/apolloClient";
import { ScrollArea } from "@/shared/ui/shadcn/scroll-area";

/**
 * Processes list component
 */
function ProcessesList({ processes }: { processes: any[] }) {
  if (!processes || processes.length === 0) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        No processes found.
      </div>
    );
  }

  return (
    <div className="space-y-2 p-6">
      <h3 className="text-lg font-semibold mb-4">
        Processes ({processes.length})
      </h3>
      <div className="space-y-2">
        {processes.map((process) => (
          <div
            key={process.id}
            className="p-3 border rounded-lg bg-card hover:bg-muted transition-colors"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{process.name}</p>
                <p className="text-sm text-muted-foreground">
                  {process.description}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs bg-primary/10 px-2 py-1 rounded mb-1">
                  {process.status}
                </p>
                <p className="text-xs text-muted-foreground">
                  {process.department?.name}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Processes Page - Server Component
 * Uses preloaded data from layout
 */
export default async function ProcessesPage({
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
      "[ProcessesPage] Company not found. Slug:",
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

  // Get processes from cache (preloaded in layout)
  const { data: processesData } = await query({
    query: GetProcessesDocument,
    variables: { filter: { companyId } },
  });

  const processes = processesData?.processes?.nodes || [];

  return (
    <ScrollArea className="flex-1">
      <ProcessesList processes={processes} />
    </ScrollArea>
  );
}
