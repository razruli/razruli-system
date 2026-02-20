import { LocaleLayout } from "@/shared/i18n";
import { ApolloClientProvider } from "@/shared/lib";
import { ThemeProvider } from "@/shared/theme";

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
        <ThemeProvider>{children}</ThemeProvider>
      </LocaleLayout>
    </ApolloClientProvider>
  );
}
