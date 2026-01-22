# Migration Guide

This document outlines the migration from the old JavaScript-based architecture to the new TypeScript architecture with Redux Toolkit and React Query.

## What's Been Completed

### Phase 1: Foundation ✅
- TypeScript configuration with strict mode
- Environment setup (.env files)
- Path aliases configured in tsconfig and vite.config

### Phase 2: Type System ✅
- Comprehensive type definitions in `src/types/`
  - Question types
  - Exam types
  - User types
  - Course types
  - UI types
  
### Phase 3: State Management ✅
- Redux Toolkit store configured in `src/store/`
- Slices created:
  - `authSlice` - Authentication state
  - `uiSlice` - UI state (theme, modals, toasts, loading)
  - `practiceSlice` - Practice filters and state
  - `testSlice` - Test state
- Typed hooks (`useAppDispatch`, `useAppSelector`)

### Phase 4: Data Fetching ✅
- React Query setup in `src/lib/react-query.ts`
- Query key factory pattern
- Axios instance with interceptors in `src/services/axios.ts`
- API services organized by domain in `src/services/api/`:
  - `questions.api.ts`
  - `exams.api.ts`
  - `users.api.ts`
  - `courses.api.ts`

### Phase 5: React Query Hooks ✅
- Custom hooks in `src/hooks/api/`:
  - `useQuestions` - Query filtered questions
  - `useBookmarkQuestion` - Bookmark mutation
  - `useExams` - Query exams
  - `useGenerateExam` - Generate exam mutation
  - `useUpdateExam` - Update exam mutation
  - `useUserProfile` - User profile query
  - `useCourses` - Courses query
  - And more...

### Phase 6: Infrastructure ✅
- Testing setup (Vitest + React Testing Library)
- Test utilities with providers
- Error boundaries (global and feature-level ready)
- Code splitting with React.lazy in App.tsx
- UI component library (`Button`, `Modal`, `Spinner`)

### Phase 7: Feature Structure ✅
- Feature-based folder structure started
- Practice feature example:
  - Custom hooks (`usePracticeFilters`, `useQuestionNavigation`)
  - Components (`PracticeHeader`, `QuestionListHeader`, `Pagination`)
  - Types (`mathTopics`, `verbalTopics`)

## Migration Strategy

The migration follows an **incremental approach** - old and new code coexist:

1. ✅ New infrastructure is set up alongside existing code
2. 🔄 Gradually migrate one feature at a time
3. ✅ Old components still work with existing structure
4. 🔄 New components can use the new hooks and Redux state
5. 🔄 Remove old code once new code is proven stable

## How to Use New Architecture

### For New Features

Use the new architecture:

```typescript
// Component using React Query and Redux
import { useQuestions } from '@/hooks/api'
import { useAppSelector } from '@/store/hooks'

const MyComponent = () => {
  const filters = useAppSelector(state => state.practice.filters)
  const { data, isLoading } = useQuestions(filters)
  
  // ...
}
```

### For Existing Features

Continue using existing code, gradually refactor:

1. Extract business logic into custom hooks
2. Move state to Redux where appropriate
3. Replace API calls with React Query hooks
4. Break down large components into smaller ones

## Component Breakdown Example

**Before** (1,463 lines in Practice.jsx):
- All state in component
- All business logic in component
- All UI in one file

**After** (distributed across files):
- `PracticePage.tsx` (100 lines) - Container
- `usePracticeFilters.ts` (80 lines) - Filter logic
- `useQuestionNavigation.ts` (60 lines) - Navigation logic
- `FilterControls/index.tsx` (120 lines) - Filter UI
- `QuestionList.tsx` (80 lines) - List UI
- Plus smaller sub-components

## Next Steps for Full Migration

### Immediate (Can be done now)
1. Update existing components to use new API hooks instead of direct fetch calls
2. Move filter state from local state to Redux (`practiceSlice`)
3. Use new UI components (`Button`, `Modal`, etc.) in existing pages

### Short-term (1-2 weeks)
1. Migrate Practice page fully to new structure
2. Migrate Tests page fully to new structure
3. Create Dashboard feature folder with new structure
4. Migrate Auth context to use Redux

### Long-term (1 month+)
1. Add comprehensive test coverage
2. Implement performance monitoring
3. Add E2E tests with Playwright/Cypress
4. Set up CI/CD with test

s running
5. Add Sentry for error tracking

## File Organization Guide

### When to create a new feature folder

Create `src/features/[feature-name]/` when:
- Feature has 3+ related components
- Feature has business logic that can be extracted
- Feature has its own types/constants

### What goes in each folder

```
src/features/my-feature/
├── components/          # Feature-specific components
│   ├── FeatureComponent.tsx
│   └── SubComponent/
├── hooks/              # Feature-specific hooks
│   └── useFeatureLogic.ts
├── utils/              # Feature-specific utilities
│   └── helpers.ts
├── types.ts            # Feature-specific types
└── index.ts            # Public API
```

### Shared vs Feature-specific

**Shared** (`src/components/`, `src/hooks/`):
- Used by 2+ features
- Generic/reusable
- No business logic

**Feature-specific** (`src/features/[name]/`):
- Used by one feature only
- Domain-specific
- Contains business logic

## Testing Guide

### Unit Tests

```typescript
// Component test
import { render, screen } from '@/test/test-utils'
import { MyComponent } from './MyComponent'

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})
```

### Hook Tests

```typescript
import { renderHook } from '@testing-library/react'
import { useMyHook } from './useMyHook'

describe('useMyHook', () => {
  it('returns expected value', () => {
    const { result } = renderHook(() => useMyHook())
    expect(result.current.value).toBe(expected)
  })
})
```

## Common Patterns

### Fetching Data

```typescript
// Old way (don't use)
const [data, setData] = useState([])
const [loading, setLoading] = useState(false)

useEffect(() => {
  setLoading(true)
  fetch('/api/data')
    .then(res => res.json())
    .then(setData)
    .finally(() => setLoading(false))
}, [])

// New way (use this)
import { useQuestions } from '@/hooks/api'

const { data, isLoading } = useQuestions(filters)
```

### Managing State

```typescript
// Old way (local state)
const [theme, setTheme] = useState('light')

// New way (Redux for app-wide state)
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { toggleTheme } from '@/store/slices/uiSlice'

const theme = useAppSelector(state => state.ui.theme)
const dispatch = useAppDispatch()
// dispatch(toggleTheme())
```

### Error Handling

```typescript
// Wrap feature-specific code in ErrorBoundary
import { ErrorBoundary } from '@/components/ErrorBoundary'

<ErrorBoundary fallback={<CustomError />}>
  <MyFeature />
</ErrorBoundary>
```

## TypeScript Tips

1. **Use type inference** - Let TypeScript infer types when possible
2. **Avoid `any`** - Use `unknown` if type is truly unknown
3. **Use discriminated unions** - For state with different shapes
4. **Extract common types** - Put in `src/types/`

## Performance Tips

1. **Don't over-memoize** - Only memoize expensive operations
2. **Use React Query** - It handles caching automatically
3. **Code split routes** - Already done in App.tsx
4. **Lazy load heavy components** - Use React.lazy()

## Resources

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [React Query Documentation](https://tanstack.com/query/latest)
- [React Testing Library](https://testing-library.com/react)

## Questions?

If you have questions about the new architecture:
1. Check this guide
2. Look at example implementations in `src/features/practice/`
3. Review the architectural plan in the plan file








