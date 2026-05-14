# GraphQL Type Generation

This repo uses the backend GraphQL schema as the API contract for frontend type
generation. GraphQL Code Generator runs only in the frontend; the backend does
not generate types or schema artifacts.

## One Command

From the repo root, regenerate all GraphQL artifacts:

```bash
yarn codegen
```

Root scripts:

```json
{
  "codegen": "yarn --cwd frontend generate",
  "generate": "yarn codegen"
}
```

The root command delegates directly to frontend generation.

## Backend Flow

Backend source of truth:

```text
backend/typescript/graphql/index.ts
backend/typescript/graphql/types/*.ts
```

The backend owns the API contract at runtime. Developers define GraphQL types in
TypeScript `gql` modules and compose them in `graphql/index.ts` for Apollo
Server. Backend service types and DTOs stay handwritten so service code is not
coupled to GraphQL API contracts.

There is no backend GraphQL generation step. Do not add generated backend
resolver types or a printed schema artifact unless the architecture changes.

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
../backend/typescript/graphql/index.ts
../backend/typescript/graphql/types/**/*.ts
./graphql/operations/**/*.graphql
./pages/**/*.tsx
./components/**/*.tsx
```

Why this flow is different:

The frontend does not own the full schema. It owns the specific operations it
wants to run against the backend schema. Developers manually write queries,
mutations, and fragments because only the frontend knows which fields a page or
API client needs. Codegen plucks backend `gql` schema definitions without
requiring backend modules, then combines those schema definitions with frontend
operations to generate operation result and variable types.

Do not manually edit frontend generated files. Change frontend operations or the
backend schema, then rerun codegen.

## Type Utils

Frontend code should import clean generated aliases from:

```text
frontend/graphql/typeUtils.ts
```

The frontend must not import backend `typeUtils`, backend resolver types,
backend models, or backend services. Frontend Codegen may read backend GraphQL
SDL source files, but application code should treat generated frontend types as
the only shared contract surface:

```text
frontend/graphql/__generated__/*
frontend/graphql/typeUtils.ts
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

Generated frontend files are committed, but they are not hand-edited. If
generated output is wrong, fix the backend GraphQL SDL or frontend operation
source file and regenerate.
