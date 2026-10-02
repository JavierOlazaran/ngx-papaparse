# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

`ngx-papaparse` is an Angular wrapper library for [Papa Parse](https://github.com/mholt/PapaParse), providing type-safe CSV parsing and generation with Angular's dependency injection. Published to npm as `ngx-papaparse`.

## Commands

```bash
# Build the library (outputs to dist/)
npm run build

# Run unit tests (headless via PhantomJS)
npm test

# Lint
npm run lint

# Run the examples/demo app locally
npm start
```

To run a single test file, use the Angular CLI directly:
```bash
npx ng test ngx-papaparse --include src/lib/papa.spec.ts --browsers PhantomJS --watch=false
```

## Architecture

This is an Angular CLI monorepo with two projects defined in `angular.json`:

- **`ngx-papaparse`** (library) — root at `src/`, built with `ng-packagr`. This is the published package.
- **`examples`** (application) — root at `examples/`, a demo app for manual testing and documentation.

### Library structure (`src/lib/`)

The library exposes a single injectable service:

- **`papa.ts`** — The `Papa` service (`providedIn: 'root'`). Wraps `papaparse/papaparse.min.js` via a `_papa` property. All Papa Parse constants and methods are proxied through this class.
- **`interfaces/`** — TypeScript interfaces mirroring the full Papa Parse API surface: `ParseConfig`, `ParseResult`, `ParseMeta`, `ParseError`, `PapaParseParser`, `UnparseConfig`, `UnparseData`.

The public API is defined in `src/public_api.ts` and re-exports everything from the service and all interfaces. When adding new Papa Parse features, add the corresponding interface in `interfaces/` and expose it through `public_api.ts`.

### Build output

`ng-packagr` compiles the library to `dist/ngx-papaparse/` in FESM2022 + ESM formats with full type declarations. The entry point is configured in `ng-package.json`.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default in Angular v20+.
- Do NOT set `changeDetection: ChangeDetectionStrategy.OnPush` explicitly. `OnPush` is the default in Angular v22+.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
    - `NgOptimizedImage` does not work for inline base64 images.

## Accessibility Requirements

- It MUST pass all AXE checks.
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes.

### Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `model()` for two-way bound properties with `[(prop)]` syntax instead of pairing `input()` with `output()`
- Use `computed()` for derived state
- Use `linkedSignal()` for state derived from multiple reactive sources that must stay synchronized
- Prefer Signal Forms (`@angular/forms/signals`) for new forms. They are stable in Angular v22+ and provide signal-based state, type-safe field access, and schema-based validation
- When not using Signal Forms, prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead
- Do NOT import `CommonModule`, import only the directives and pipes the template uses, such as `AsyncPipe` or `DatePipe`
- When using external templates/styles, use paths relative to the component TS file.

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not assume globals like (`new Date()`) are available.

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Prefer the `@Service` decorator over `@Injectable({providedIn: 'root'})` for new singleton services (Angular v22+)
- Use the `inject()` function instead of constructor injection
