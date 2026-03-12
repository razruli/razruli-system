import { LocaleLayout } from "@/shared/i18n";

export default function PublicLocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  return <LocaleLayout params={params}>{children};</LocaleLayout>;
}
