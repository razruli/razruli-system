import LocaleLayout from "@/shared/i18n/layout/LocaleLayout";
import { ThemeProvider } from "@/shared/theme/ThemeProvider";

export function RootProviders({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  return (
    <LocaleLayout params={params}>
      <ThemeProvider>{children}</ThemeProvider>
    </LocaleLayout>
  );
}
