import { LocaleLayout } from "@/shared/i18n";
import { ApolloClientProvider } from "@/shared/lib";
import { ThemeProvider } from "@/shared/theme";
import { TooltipProvider } from "@/shared/ui";

export function RootProviders({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  return (
    <ApolloClientProvider>
      <LocaleLayout params={params}>
        <ThemeProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
      </LocaleLayout>
    </ApolloClientProvider>
  );
}
