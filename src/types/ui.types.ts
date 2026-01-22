// UI and application state types
export interface UIState {
  theme: 'light' | 'dark'
  sidebarOpen: boolean
  modals: ModalState
  toasts: Toast[]
  loading: LoadingState
}

export interface ModalState {
  newTestModal: boolean
  profileModal: boolean
  settingsModal: boolean
  [key: string]: boolean
}

export interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  duration?: number
}

export interface LoadingState {
  global: boolean
  [key: string]: boolean
}

export interface PracticeState {
  filters: {
    subject: 1 | 2
    difficulty: number | string
    topic: string
    subtopic: string
    hide_solved: boolean
    incorrect: boolean
    is_bookmarked: number
    is_bluebook: number
    sort_dir: 'asc' | 'desc'
  }
  selectedTopics: string[]
  currentPage: number
  activeFilter: 'incorrect' | 'solved' | null
}

export interface TestState {
  activeTest: any | null
  testInProgress: boolean
  reviewingTest: any | null
  selectedTestType: 'official' | 'custom' | 'adaptive'
}








