"use client";

import { useTranslations } from "next-intl";

export function TestClientComponent() {
  const t = useTranslations();

  return <div>{t("greeting")}</div>;
}
