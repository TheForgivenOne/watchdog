# Watchdog

A feature-rich personal dashboard application that aggregates news, weather, and other useful information in a customizable interface.

## Overview

Watchdog is a React-based dashboard application that serves as a central hub for staying informed with personalized content. The application features modular "subdogs" (feature modules) including news and weather services, each with caching capabilities and cloud-synced preferences.

With a focus on performance and user experience, Watchdog combines modern web technologies to deliver timely updates while maintaining fast load times through intelligent caching and data synchronization.

## Features

- **Modular Architecture**: Clean separation of features through "subdogs" system
- **News Aggregation**: Browse and search latest news articles with category filtering
- **Weather Dashboard**: Real-time weather data with location-based services
- **Customizable Interface**: Personalize your dashboard experience in settings
- **Offline Caching**: Data persistence for access without internet connectivity
- **Cloud Sync**: Preferences and data synchronized across devices using Convex
- **Performance Optimized**: Lazy loading and efficient data fetching strategies

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS
- **State Management**: React Query, Zustand
- **Backend**: Convex (serverless database and functions)
- **Routing**: React Router v7
- **Icons**: Lucide React
- **Date Utilities**: date-fns

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/TheForgivenOne/watchdog.git
   cd watchdog
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with your Convex URL:
   ```env
   VITE_CONVEX_URL=your_convex_deployment_url
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser to http://localhost:5173 to view the application.

## Development Scripts

- `npm run dev` - Start the development server with hot reloading
- `npm run build` - Create a production build
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check code quality
- `npm run test-cache` - Test caching functionality (if available)

## Project Structure

```
watchdog/
├── convex/                 # Server-side Convex functions and database schemas
├── src/
│   ├── core/              # Shared business logic and core components
│   │   ├── components/    # Reusable UI components
│   │   ├── hooks/         # Core React hooks
│   │   ├── layouts/       # Page layout wrappers
│   │   ├── pages/         # Core page components
│   │   ├── store/         # Global state management
│   │   ├── types/         # Type definitions
│   │   └── utils/         # Utility functions
│   ├── subdogs/           # Feature-specific implementations (news, weather, etc.)
│   ├── hooks/             # Custom React hooks
│   ├── pages/             # Top-level route components
│   ├── App.tsx            # Main application routing
│   └── main.tsx           # Application entry point
├── package.json
└── README.md
```

## Architecture

Watchdog follows a modular architecture with the following key principles:

- **Subdogs System**: Feature modules (news, weather) are organized separately for maintainability
- **Convex Integration**: Backend services use Convex for real-time data synchronization
- **Caching Strategy**: Both client-side caching and Convex-based persistence for optimal performance
- **Component Abstraction**: Shared components in `src/core/` promote consistency across features

## Contributing

We welcome contributions to improve the Watchdog application! To get started:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Ensure your code passes linting (`npm run lint`)
5. Submit a pull request

Please follow the coding standards outlined in `AGENTS.md` for consistency.

## License

This project is licensed under the MIT License - see the LICENSE file for details.