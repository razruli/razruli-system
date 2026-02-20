import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";

import { loaders } from "./messages";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  // Typically corresponds to the `[locale]` segment
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const loader = loaders[locale as keyof typeof loaders];
  const messages = (await loader()).default;

  return {
    locale,
    messages,
  };
});
