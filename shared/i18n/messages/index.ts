export const loaders = {
  en: () => import("./en.json"),
  ru: () => import("./ru.json"),
} as const;
