import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";

import { loaders } from "../messages";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  let messages;

  try {
    const loader = loaders[locale as keyof typeof loaders];
    if (!loader) notFound();

    messages = (await loader()).default;
  } catch (_e) {
    notFound();
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
