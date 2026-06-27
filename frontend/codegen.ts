import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: [
    {
      "../backend/typescript/graphql/index.ts": {
        noRequire: true,
      },
    },
    {
      "../backend/typescript/graphql/types/**/*.ts": {
        noRequire: true,
      },
    },
  ],
  documents: [
    "./graphql/operations/**/*.graphql",
    "./pages/**/*.tsx",
    "./components/**/*.tsx",
  ],
  // Map the graphql-upload `Upload` scalar to the browser `File` type so
  // generated operation variables (e.g. `UploadInterviewNotesMutationVariables.file`)
  // are typed as `File` instead of `unknown`. `apollo-upload-client` accepts
  // a `File` (or `Blob`) directly in variables and turns the request into a
  // GraphQL multipart upload.
  config: {
    scalars: {
      Upload: "File",
    },
  },
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
