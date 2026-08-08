export const architectureBoundaries = [
  {
    files: ["src/{app,pages,routes}/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: ["@/features/*/*"],
        },
      ],
    },
  },
  {
    files: ["src/{components,hooks,lib,config,types,utils}/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: ["@/features/*", "@/pages/*", "@/routes/*", "@/app/*"],
        },
      ],
    },
  },
  {
    files: ["src/features/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: ["@/pages/*", "@/routes/*", "@/app/*", "@/features/*/*"],
        },
      ],
    },
  },
];
