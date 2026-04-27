# HireDue Monorepo

HireDue is organized as a small monorepo with a frontend-only marketing web app.

## Workspace Layout

```text
apps/
  web/
packages/
  config/
  shared/
```

## Commands

```sh
npm install
npm run dev
npm run build
npm run lint
```

## Apps

- `@hiredue/web`: React + Vite marketing frontend

## Packages

- `@hiredue/config`: shared site configuration
- `@hiredue/shared`: shared form schemas and validation helpers
