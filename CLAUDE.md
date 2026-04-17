# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev              # Vite dev server
npm run build            # Type-check + build (parallel)
npm run lint             # ESLint with auto-fix
npm run format           # Prettier on src/
npm run codegen          # GraphQL code generation (types from schema)
npm run test:unit        # Vitest with jsdom
npm run test:e2e         # Cypress interactive (needs preview server)
npm run test:e2e:ci      # Cypress headless CI
npm run type-check       # vue-tsc type checking only
```

## Tech Stack

- **Vue 3** (Composition API, `<script setup>`) + **TypeScript 4.7** + **Vite 3**
- **Apollo Client 3** for GraphQL, **Axios** for REST auth endpoints
- **Pinia** for state management (stores in `src/stores/`)
- **Bootstrap 4.6** + Bootstrap Icons + FontAwesome for styling
- **Vuelidate** for form validation
- **GraphQL Code Generator** produces typed operations in `src/gql/graphql.ts`

## Architecture

### Dual API Layer
- **GraphQL** (Apollo Client): All business logic - bookings, profiles, shop, etc.
- **REST** (Axios): Authentication only (`login_check`, `token/refresh`) via `src/services/authService.ts`
- Two Apollo clients exist: authenticated (with JWT token injection + auto-refresh) and anonymous
- Apollo client setup with error link that catches `jwt.expired_access_token` and auto-refreshes: `src/services/graphqlClient.ts`

### Module System (`src/modules/`)
Feature-based modules each owning their own components, composables, services, GraphQL queries, and routes:
- **shop** - E-commerce: products, cart, checkout, payments (Apple Pay, Payfort)
- **auth** - Login/register forms
- **buy_packages** - SMS verification and package purchases
- **shared** - Cross-module composables (`useModal`) and enums (`SiteEnum`)
- **login-redirect** - OAuth/SSO redirect handling

### Key Patterns
- **Composables as singletons**: `useShoppingCart()`, `useModal()` use module-level reactive state (not per-instance)
- **Factory pattern**: `src/modules/shop/factories/` transforms API responses into domain models (`ProductModel`, `ShoppingCartModel`)
- **ServiceResult type**: Shop services return `ServiceResult<T, ErrorType>` for typed error handling
- **Product model hierarchy**: Abstract `ProductModel` base class extended by `ClassPackage` and `GiftCardProduct`

### Routing
- Vue Router with `MenuLayout` wrapper for authenticated pages
- Route guard in `src/router/index.ts` checks auth; public pages whitelisted
- Shop module has its own router: `src/modules/shop/router/index.ts`

### Multi-Site Support
Three sites: Dubai, Abu Dhabi, TownSquare (`SiteEnum` in `src/modules/shared/interfaces/site.enum`). Site stored in localStorage, passed to API calls.

### App Entry
- `src/main.ts`: `startApp()` reads view/site from `#app-parameters` data attributes on the host page
- `src/index.ts`: Library export for embedding in Squarespace
- Webview token auth via `authenticateWithToken()` for mobile app integration

### GraphQL Workflow
1. Write `.graphql` files in `src/modules/*/graphql/`
2. Run `npm run codegen` to regenerate `src/gql/graphql.ts` and `src/gql/fragment-types.json`
3. Use generated typed document nodes in services/composables

## Code Style

- No semicolons, single quotes, 2-space indent, 100 char line width, trailing commas: none
- Path alias: `@/` maps to `src/`

## Environment Variables

```
VITE_CRANK_REST_SERVER_URL       # REST API base URL
VITE_CRANK_GRAPHQL_SERVER_URL    # GraphQL endpoint
VITE_CRANK_PAYMENTS_URL          # Payments API URL
```
