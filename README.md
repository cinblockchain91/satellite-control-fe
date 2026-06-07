# Satellite Control — Frontend

![Banner](.github/banner.PNG)

A modern web-based control interface for managing and monitoring satellite operations in real time. Built for mission control teams who need reliable, fast, and intuitive tools to oversee satellite fleets, track telemetry data, and execute remote commands.

---

## Overview

Satellite Control FE is the frontend layer of the Satellite Control Platform — a mission-critical system designed for aerospace engineers and operators. The interface provides:

- Real-time satellite status monitoring and telemetry dashboards
- Orbit tracking and digital twin visualization
- Remote command execution and scheduling
- User access management with role-based permissions
- Alert and anomaly detection feeds

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| UI | React 19, Tailwind CSS v4, Radix UI |
| State management | Zustand |
| Server state | TanStack Query v5 |
| Language | TypeScript 5 |
| Monorepo | pnpm Workspaces + Turborepo |
| Linting | ESLint 9 (flat config) |
| Git hooks | Husky + Commitlint |
| CI/CD | GitHub Actions + Vercel |

---

## Architecture

This project follows **Feature-Sliced Design (FSD)** combined with **Hexagonal Architecture** to ensure clean separation of concerns and scalability.

```
satellite-control-fe/
├── apps/
│   └── web/                        # Next.js application
├── packages/
│   ├── entities/account/           # Account domain model
│   ├── features/account-auth/      # Authentication feature
│   └── shared/                     # Shared utilities, types, config
├── infra/                          # Infrastructure adapters (HTTP, mock, cache)
└── tooling/
    └── eslint-config/              # Shared ESLint configuration
```

### Adapter Pattern

The codebase uses an **adapter pattern** to swap between real HTTP calls and mock implementations without changing business logic. This allows the frontend to be developed and previewed independently while the backend is in progress.

```ts
export const authAdapter = env.useMock ? authMockAdapter : authHttpAdapter;
```

---

## Getting Started

### Prerequisites

- Node.js >= 20
- pnpm >= 9

### Installation

```bash
git clone https://github.com/cinblockchain91/satellite-control-fe.git
cd satellite-control-fe
pnpm install
```

### Environment Setup

Create a local environment file at `apps/web/.env.local`:

```bash
NEXT_PUBLIC_USE_MOCK=true
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_WS_URL=ws://localhost:4000
NEXT_PUBLIC_FEATURE_DIGITAL_TWIN=false
```

### Run Development Server

```bash
pnpm dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

---

## Mock Mode

Since the backend is under active development, the frontend ships with a built-in mock layer. When `NEXT_PUBLIC_USE_MOCK` is not explicitly set to `"false"`, all API calls are intercepted and served by mock adapters — no backend required.

**Default mock credentials:**
```
Username: admin
Password: admin123
```

---

## Available Scripts

```bash
pnpm dev          # Start all apps in development mode
pnpm build        # Build all apps for production
pnpm lint         # Run ESLint across all packages
pnpm type-check   # Run TypeScript type checking
pnpm test         # Run test suites
```

---

## Git Workflow

This project enforces a structured Git workflow:

### Branch Naming

```
SC-{ticket-number}_{short-description}

# Examples
SC-4_setup-husky
SC-12_satellite-dashboard
```

### Commit Convention

Follows [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add satellite telemetry dashboard
fix: resolve orbit calculation offset
chore: update dependencies
docs: update API integration guide
refactor: extract telemetry adapter
```

Commits are validated automatically via Husky + Commitlint on every `git commit`.

### Pull Request Flow

```
feature branch → develop → main
```

- All PRs must target `develop`
- `main` is protected — requires PR approval before merging
- Preview deployments are generated automatically for every PR

---

## CI/CD

GitHub Actions handles the full CI/CD pipeline:

| Job | Trigger | Steps |
|-----|---------|-------|
| `ci` | Push / PR | Type check → Lint |
| `deploy-preview` | PR opened/updated | Build → Deploy to Vercel Preview |
| `deploy-production` | Merge to `main` | Build → Deploy to Vercel Production |

Preview URLs are posted automatically as PR comments.

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_USE_MOCK` | Enable mock API adapters | `true` |
| `NEXT_PUBLIC_APP_ENV` | Application environment | `development` |
| `NEXT_PUBLIC_API_URL` | Backend REST API base URL | `http://localhost:4000` |
| `NEXT_PUBLIC_WS_URL` | WebSocket server URL | `ws://localhost:4000` |
| `NEXT_PUBLIC_FEATURE_DIGITAL_TWIN` | Enable digital twin feature | `false` |

---

## License

Private — All rights reserved © Satellite Control Team