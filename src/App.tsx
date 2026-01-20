import { useState, useEffect, lazy, Suspense } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom'
import { Provider } from 'react-redux'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import './App.css'
import './index.css'
import 'katex/dist/katex.min.css'

import { store } from './store'
import { queryClient } from './lib/react-query'
import { AuthProvider } from './context/AuthContext'
import { ErrorBoundary } from './components/ErrorBoundary'
import { PageLoader } from './components/ui'
import Navbar from './components/NavBar/Navbar'

// Lazy load pages for code splitting
const Dashboard = lazy(() => import('./pages/DashboardPage/Dashboard'))
const LoginPage = lazy(() => import('./pages/LoginPage/LoginPage'))
const Courses = lazy(() => import('./pages/CoursesPage/Courses'))
const Tests = lazy(() => import('./pages/TestsPage/Tests'))
const Practice = lazy(() => import('./pages/PracticePage/Practice'))
const LabPage = lazy(() => import('./pages/LabPage/LabPage'))
const LessonPage = lazy(() => import('./pages/LessonPage/LessonPage'))

// Create a wrapper component to handle the navbar visibility logic
const AppContent = () => {
  const location = useLocation()
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Get initial theme from localStorage or system preference
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      return savedTheme === 'dark'
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  // Check if current route is lesson page or login page
  const isLessonPage =
    location.pathname.includes('/course/') &&
    location.pathname.includes('/lesson/')
  const isLoginPage = location.pathname === '/login'

  useEffect(() => {
    // Update data-theme attribute and localStorage when theme changes
    document.documentElement.setAttribute(
      'data-theme',
      isDarkMode ? 'dark' : 'light'
    )
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode)
  }

  // Don't show navbar on login page
  if (isLoginPage) {
    return (
      <div className="app login-app">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </Suspense>
      </div>
    )
  }

  return (
    <div className={`app ${isLessonPage ? 'lesson-page-active' : ''}`}>
      <div className="sidebar-container">
        {isLessonPage && (
          <div className="lesson-back-button">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M19 12H5m7 7l-7-7 7-7" />
            </svg>
          </div>
        )}
        <Navbar isDarkMode={isDarkMode} onThemeToggle={toggleTheme} />
      </div>

      <div className="content">
        <ErrorBoundary>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/tests" element={<Tests />} />
              <Route path="/practice" element={<Practice />} />
              <Route path="/lab" element={<LabPage />} />
              <Route
                path="/course/:courseId/lesson/:lessonId"
                element={<LessonPage />}
              />
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  )
}

const App = () => {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Router>
            <AuthProvider>
              <AppContent />
            </AuthProvider>
          </Router>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </Provider>
    </ErrorBoundary>
  )
}

export default App

