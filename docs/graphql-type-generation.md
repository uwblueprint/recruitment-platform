# GraphQL Type Generation

This repo uses GraphQL Code Generator in both the backend and frontend, but the
two flows are different because they generate types for different jobs.

## One Command

From the repo root, regenerate all GraphQL artifacts:

```bash
yarn codegen
```

Root scripts:

```json
{
  "codegen": "yarn --cwd backend/typescript codegen && yarn --cwd frontend generate",
  "generate": "yarn codegen"
}
```

Backend generation runs first because frontend generation reads the backend
schema artifact.

## Backend Flow

Backend source of truth:

```text
backend/typescript/graphql/types/*.ts
backend/typescript/graphql/typeDefs.ts
backend/typescript/graphql/schema.ts
```

Backend generated files:

```text
backend/typescript/graphql/schema.graphql
backend/typescript/graphql/__generated__/resolvers-types.ts
```

Backend scripts:

```json
{
  "schema:print": "ts-node scripts/printSchema.ts > graphql/schema.graphql",
  "codegen": "yarn schema:print && graphql-codegen --config codegen.ts"
}
```

Run backend generation only:

```bash
cd backend/typescript
yarn codegen
```

Why this flow is different:

The backend owns the API contract. Developers define GraphQL types in TypeScript
`gql` modules, then generate `schema.graphql` from those modules. Codegen then
uses that schema to produce resolver types, so resolver signatures stay aligned
with the backend schema.

Do not manually edit backend generated files. Change the TypeScript schema
modules and rerun codegen.

## Frontend Flow

Frontend source of truth:

```text
frontend/graphql/operations/*.graphql
frontend/pages/**/*.tsx
frontend/components/**/*.tsx
```

Frontend generated files:

```text
frontend/graphql/__generated__/*
```

Frontend wrapper:

```text
frontend/graphql/typeUtils.ts
```

Frontend script:

```json
{
  "generate": "graphql-codegen"
}
```

Run frontend generation only:

```bash
cd frontend
yarn generate
```

Frontend codegen reads:

```text
../backend/typescript/graphql/schema.graphql
./graphql/operations/**/*.graphql
./pages/**/*.tsx
./components/**/*.tsx
```

Why this flow is different:

The frontend does not own the full schema. It owns the specific operations it
wants to run against the backend schema. Developers manually write queries,
mutations, and fragments because only the frontend knows which fields a page or
API client needs. Codegen combines those frontend operations with the backend
schema artifact to generate operation result and variable types.

Do not manually edit frontend generated files. Change frontend operations or the
backend schema, then rerun codegen.

## Type Utils

Backend code should import clean generated aliases from:

```text
backend/typescript/graphql/typeUtils.ts
```

Frontend code should import clean generated aliases from:

```text
frontend/graphql/typeUtils.ts
```

The frontend must not import backend `typeUtils`, backend resolver types,
backend models, or backend services. The shared contract between frontend and
backend is only:

```text
backend/typescript/graphql/schema.graphql
```

## Common Workflows

After changing backend GraphQL types:

```bash
yarn codegen
```

After changing frontend operations:

```bash
cd frontend
yarn generate
```

Before opening a PR:

```bash
yarn codegen

cd backend/typescript
yarn test

cd ../../frontend
yarn tsc --noEmit
```

## Editing Rule

Generated files are committed, but they are not hand-edited. If generated output
is wrong, fix the source file and regenerate.
