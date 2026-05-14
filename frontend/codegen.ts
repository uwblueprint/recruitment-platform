import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "../backend/typescript/graphql/schema.graphql",
  documents: [
    "./graphql/operations/**/*.graphql",
    "./pages/**/*.tsx",
    "./components/**/*.tsx",
  ],
  generates: {
    "./graphql/__generated__/": {
      preset: "client",
      presetConfig: {
        gqlTagName: "gql",
      },
    },
    "./graphql/__generated__/types.ts": {
      plugins: ["typescript"],
    },
    "./graphql/__generated__/operation-types.ts": {
      plugins: ["typescript-operations"],
      config: {
        importSchemaTypesFrom: "./graphql/__generated__/types",
        namespacedImportName: "Types",
      },
    },
  },
};

export default config;
