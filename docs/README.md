# Watchdog Documentation

Comprehensive documentation for the Watchdog project.

## Overview

Watchdog is a modular dashboard application that provides news and weather information through a plugin-based architecture called "subdogs". Each subdog is a self-contained feature module with its own routes, hooks, components, and services.

## Tech Stack

- **Frontend**: React 19, React Router v7, TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand (client state), React Query (server state)
- **Backend**: Convex (serverless database and functions)
- **Build Tool**: Vite
- **Testing**: Jest, React Testing Library

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Lint code
npm run lint
```

## Features

- **News Feed**: Real-time news from NewsData.io with category filtering
- **Weather Widget**: Current conditions and forecasts from Open-Meteo
- **Location Search**: Geocoding for finding locations worldwide
- **Caching System**: Multi-layer caching for performance and offline support
- **User Preferences**: Customizable dashboard with widget visibility controls
- **Bookmarking**: Save articles and locations for later

## Documentation Sections

| File | Description |
|------|-------------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System design, component hierarchy, data flow |
| [API.md](./API.md) | External API integrations (NewsData.io, Open-Meteo) |
| [SUBDOGS.md](./SUBDOGS.md) | Plugin system and feature modules |
| [CACHING.md](./CACHING.md) | Cache layers, TTL, invalidation strategies |
| [DATABASE.md](./DATABASE.md) | Convex schema and data models |
| [COMPONENTS.md](./COMPONENTS.md) | Component library and patterns |
| [ROUTING.md](./ROUTING.md) | Navigation and route structure |
| [STATE.md](./STATE.md) | State management guide |
| [ENVIRONMENT.md](./ENVIRONMENT.md) | Environment variables and configuration |

## Project Structure

```
watchdog/
├── convex/              # Server-side Convex functions and schemas
│   ├── schema.ts        # Database schema (10 tables)
│   ├── cache.ts         # News cache functions
│   └── cacheWeather.ts  # Weather cache functions
├── src/
│   ├── core/            # Shared business logic
│   │   ├── components/ # Reusable UI components
│   │   ├── hooks/      # Core React hooks
│   │   ├── layouts/    # Page layout wrappers
│   │   ├── pages/      # Core page components
│   │   ├── store/      # Zustand stores
│   │   ├── types/      # Type definitions
│   │   └── utils/      # Utility functions
│   ├── subdogs/        # Feature modules (plugins)
│   │   ├── news/       # News subdog
│   │   └── weather/    # Weather subdog
│   ├── hooks/          # Custom React hooks
│   ├── pages/          # Top-level route components
│   └── App.tsx         # Main app with routing
├── docs/               # This documentation
├── AGENTS.md           # Developer guidelines and code style
└── .env.example        # Environment variables template
```

## Available Subdogs

1. **News** (`/news/*`) - NewsData.io integration with categories, search, and archiving
2. **Weather** (`/weather/*`) - Open-Meteo integration with forecasts and location search

## Adding New Subdogs

See [SUBDOGS.md](./SUBDOGS.md) for instructions on creating new subdog plugins.

## Development Guidelines

See [AGENTS.md](../AGENTS.md) for code style, naming conventions, and development best practices.
