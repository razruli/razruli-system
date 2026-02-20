import fsd from "@conarti/eslint-plugin-feature-sliced";
import { defineConfig } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import importPlugin from "eslint-plugin-import";

const eslintConfig = defineConfig([
  {
    ignores: [
      "**/node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "**/*.d.ts",
      "next-env.d.ts",
      "postcss.config.mjs",
      "tailwind.config.mjs",
      "eslint.config.mjs",
    ],
  },
  ...nextVitals,
  ...nextTs,

  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
    plugins: {
      "feature-sliced": fsd,
      import: importPlugin,
    },
    settings: {
      "feature-sliced": {
        alias: "@",
      },
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "./tsconfig.json",
        },
      },
    },
    rules: {
      // --- FSD Rules ---
      "feature-sliced/layers-slices": [
        "error",
        { ignorePatterns: ["**/shared/i18n/**"] },
      ],
      "feature-sliced/public-api": "error",
      "feature-sliced/absolute-relative": "error",

      // --- Clean Imports & Sorting ---
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          pathGroups: [
            { pattern: "react", group: "external", position: "before" },
            { pattern: "@/**", group: "internal", position: "after" },
          ],
          pathGroupsExcludedImportTypes: ["react"],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "react/self-closing-comp": "error",
    },
  },

  {
    files: ["**/shared/**/*.{ts,tsx,js,jsx}"],
    rules: {
      "feature-sliced/absolute-relative": "off",
    },
  },
]);

export default eslintConfig;
