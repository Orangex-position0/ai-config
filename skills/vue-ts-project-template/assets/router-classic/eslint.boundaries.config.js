export const architectureBoundaries = [
  {
    files: ["src/app/**/*.{ts,vue}"],
    rules: {
      "no-restricted-imports": ["error", { patterns: ["@/features/*/*"] }],
    },
  },
  {
    files: ["src/shared/**/*.{ts,vue}"],
    rules: {
      "no-restricted-imports": ["error", { patterns: ["@/app/*", "@/features/*"] }],
    },
  },
  {
    files: ["src/features/**/*.{ts,vue}"],
    rules: {
      "no-restricted-imports": ["error", { patterns: ["@/app/*", "@/features/*/*"] }],
    },
  },
];
