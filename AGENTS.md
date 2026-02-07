# Agent Guidelines for Watchdog Project

## Build Commands

### Core Commands
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build production bundle
npm run build

# Preview production build locally
npm run preview

# Lint code
npm run lint
```

## Testing Setup

### Test Dependencies
First, install the required test dependencies:
```bash
npm install --save-dev @testing-library/react @testing-library/react-hooks @testing-library/jest-dom jsdom @types/jest
```

### Test Framework
- Current tests exist in `testCache.ts` using Jest and React Testing Library
- Includes tests for caching functionality with mocked Convex API calls
- Uses `@testing-library/react-hooks` for testing custom hooks

### Running Tests
```bash
# Run all tests
npx jest

# Run specific test file
npx jest testCache.ts

# Run tests in watch mode
npx jest --watch

# Run tests with coverage
npx jest --coverage
```

### Single Test Execution
- For individual test files: `npx jest testCache.ts`
- To run tests with watch mode: `npx jest --watch`

## Project Structure

### Directory Overview
- `convex/` - Server-side Convex functions and database schemas
- `src/core/` - Shared business logic and core components
- `src/subdogs/` - Feature-specific implementations (news, weather, etc.)
- `src/hooks/` - Custom React hooks
- `src/pages/` - Top-level route components

### Key Subdirectories in src/core/
- `components/` - Reusable UI components
- `hooks/` - Core React hooks
- `layouts/` - Page layout wrappers
- `pages/` - Core page components
- `store/` - Global state management
- `types/` - Type definitions
- `utils/` - Utility functions

## Code Style Guidelines

### Imports
- Import React and ReactDOM from 'react' and 'react-dom/client' respectively
- Group imports in logical sections: React built-ins, external libraries, internal modules, relative imports
- Use absolute imports for core components: `import { Component } from './core/components/Component'`
- Use lazy imports for code splitting when appropriate

### Formatting
- Use Prettier for consistent formatting (configuration in `postcss.config.js`)
- Follow 2-space indentation
- Use semicolons consistently
- Use single quotes for strings where possible
- Arrow functions preferred for functional components
- Use explicit export default for React components

### TypeScript Usage
- Strict TypeScript mode is enabled (`strict: true` in tsconfig)
- Use TypeScript interfaces for props and state definitions
- Enable strict null checks and type checking
- Use type guards and proper error handling
- Prefer type over interface for object shapes (unless extending)
- Use utility types like Partial, Pick, Omit when applicable

### Naming Conventions
- PascalCase for React components (e.g., `NewsComponent`)
- camelCase for functions and variables (e.g., `handleClick`)
- SCREAMING_SNAKE_CASE for constants (e.g., `API_TIMEOUT`)
- Use descriptive names that clearly indicate purpose
- Prefix boolean values with `is`, `has`, `can` (e.g., `isLoading`, `hasData`)
- Use `use` prefix for custom hooks (e.g., `useCachedNews`)

### Component Structure
- Use functional components with TypeScript interfaces
- Separate concerns with smaller, reusable components
- Place components in appropriate directories (e.g., `src/core/components/`)
- Use ErrorBoundary for error handling at app level
- Implement Suspense for lazy loaded components
- Follow layout -> page -> component hierarchy

### Convex Integration
- Use `ConvexProvider` and `ConvexReactClient` in main entry point
- Leverage Convex hooks: `useQuery`, `useMutation`, `useAction`
- Define API routes in `convex/` directory
- Use generated API types from `convex/_generated/api`
- Follow Convex best practices for database schema design

### State Management
- Use React hooks for component state
- Use Zustand for global state management
- Use React Query (`@tanstack/react-query`) for server state
- Implement proper cache strategies with stale-while-revalidate patterns
- Handle loading and error states appropriately

### Error Handling
- Implement ErrorBoundary components for graceful error recovery
- Use try/catch blocks for async operations
- Provide user-friendly error messages
- Log errors appropriately for debugging
- Handle network failures with retry mechanisms

### Performance Optimization
- Implement code splitting with React.lazy
- Use React.memo for components with stable props
- Implement proper React Query caching strategies
- Use Suspense boundaries for loading states
- Optimize renders with useCallback and useMemo

### Routing
- Use React Router v7 for navigation
- Organize routes hierarchically: `/news/*`, `/weather/*`, etc.
- Use Layout components for shared UI elements
- Implement proper route parameters and navigation guards

### Styling
- Use Tailwind CSS for styling
- Follow utility-first approach
- Use CSS Modules for component-scoped styles when needed
- Maintain consistent design system in `src/core` components

### Folder Structure Adherence
- Place shared business logic in `src/core/`
- Use `src/subdogs/` for feature-specific implementations
- Store custom hooks in `src/hooks/`
- Keep asset files in `src/assets/`
- Organize pages in `src/pages/`

### Code Quality
- Use ESLint with configured rules (React Hooks, Refresh, etc.)
- Run `npm run lint` before committing
- Fix all TypeScript compilation errors before pushing
- Write unit tests for critical business logic
- Use JSDoc for public functions and APIs

### Security Best Practices
- Sanitize inputs before processing
- Use environment variables for sensitive data (VITE_CONVEX_URL)
- Validate data from external sources
- Don't expose sensitive information directly in client-side code
- Use secure methods for authentication if implemented

## Environment Variables
- VITE_CONVEX_URL: Convex backend URL
- Use `.env.local` for local environment variables

## Git Workflow
- Commit frequently with clear, descriptive messages
- Use conventional commits where possible (feat:, fix:, chore:, etc.)
- Make sure all linting passes before committing
- Ensure tests pass before pushing