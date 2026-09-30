// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([...nextVitals, ...nextTs, {
  rules: {
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }],
  },
}, // Override default ignores of eslint-config-next.
// NOTE: "**/*.js" (not "*.js") — flat-config minimatch does not cross
// directories, so legacy helper scripts under supabase/ must be covered.
globalIgnores([
  ".next/**",
  "out/**",
  "build/**",
  "next-env.d.ts",
  "src/types/database.ts",
  "**/*.js",
  "scripts/**",
]), ...storybook.configs["flat/recommended"]]);

export default eslintConfig;
