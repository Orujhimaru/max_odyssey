# MAX SAT - Practice & Learning Platform

A modern, production-grade React application for SAT practice and learning.

## Tech Stack

- **Frontend:** React 19, TypeScript
- **State Management:** Redux Toolkit + React Query (TanStack Query)
- **Styling:** Tailwind CSS
- **Build Tool:** Vite
- **Testing:** Vitest + React Testing Library
- **API Layer:** Axios with interceptors
- **Authentication:** Supabase
- **Code Quality:** ESLint, TypeScript strict mode

## Architecture

This project follows enterprise-level architectural patterns:

- **Feature-based folder structure** - Organized by domain (practice, tests, courses, etc.)
- **Separation of concerns** - Business logic in custom hooks, UI in presentational components
- **Type-safe** - Full TypeScript coverage with strict mode
- **Optimized data fetching** - React Query for server state, Redux for client state
- **Code splitting** - Lazy-loaded routes for better performance
- **Error boundaries** - Graceful error handling at component and app level

## Project Structure

```
src/
├── components/        # Shared components
│   ├── ui/           # Reusable UI components (Button, Modal, etc.)
│   ├── layout/       # Layout components (Navbar, etc.)
│   └── ErrorBoundary.tsx
├── features/         # Feature-based modules
│   ├── practice/     # Practice feature
│   ├── tests/        # Tests feature
│   ├── dashboard/    # Dashboard feature
│   └── courses/      # Courses feature
├── hooks/            # Shared hooks
│   └── api/         # React Query hooks
├── store/            # Redux store
│   └── slices/      # Redux slices
├── services/         # API services
│   ├── api/         # Organized by domain
│   ├── axios.ts     # Axios instance with interceptors
│   └── supabase.ts  # Supabase client
├── types/            # TypeScript type definitions
├── utils/            # Utility functions
├── lib/              # Third-party configurations
└── test/             # Test utilities

```

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Run tests with UI
npm run test:ui

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables

Create a `.env.development` file:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:8080
VITE_ENV=development
```

## Key Features

### State Management Strategy

- **Redux Toolkit** - UI state (theme, modals), app settings, session info
- **React Query** - Server data (questions, exams, user profile)
- **Local State** - Component-specific temporary state

### API Layer

- Axios instance with request/response interceptors
- Automatic auth token attachment
- Global error handling
- Organized by domain (questions, exams, users, courses)

### Performance Optimizations

- Route-based code splitting with React.lazy
- React Query caching and background refetching
- Memoized components and callbacks where needed
- Optimized bundle size

### Testing

- Unit tests with Vitest
- Component tests with React Testing Library
- Custom render function with all providers
- Mock utilities for API and state

## Development Guidelines

### File Naming

- Components: `PascalCase.tsx`
- Hooks: `useCamelCase.ts`
- Utils: `camelCase.ts`
- Types: `types.ts` or `*.types.ts`
- Tests: `*.test.tsx`

### Import Order

1. External libraries
2. Internal absolute imports (@/...)
3. Relative imports
4. Styles

### Type Safety

- All new code must be TypeScript
- Use strict mode
- Define interfaces for all data structures
- Avoid `any` type

## Migration Notes

This project was recently migrated from JavaScript to TypeScript with modern architecture patterns. The migration followed an incremental approach:

1. Set up TypeScript, Redux Toolkit, and React Query infrastructure
2. Created comprehensive type definitions
3. Refactored API layer with Axios
4. Extracted business logic into custom hooks
5. Split large components into smaller, focused ones
6. Added error boundaries and testing infrastructure

## Contributing

1. Follow the established architectural patterns
2. Write tests for new features
3. Ensure TypeScript types are properly defined
4. Keep components under 200 lines when possible
5. Extract business logic into custom hooks

## License

Private - All rights reserved
