// Firebase 관련 상수
export const FIREBASE_COLLECTIONS = {
  USERS: 'users',
  TIME_SLOTS: 'timeSlots',
  APPOINTMENTS: 'appointments'
} as const;

// 시간 관련 상수
export const TIME_CONSTANTS = {
  MIN_TIME: '09:00',
  MAX_TIME: '18:00',
  TIME_INTERVAL: 30, // 분 단위
  DEFAULT_COLOR: '#ff6b6b'
} as const;

// 색상 옵션
export const COLOR_OPTIONS = [
  '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3',
  '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43', '#10ac84', '#ee5a24'
] as const;

// 유효성 검사 규칙
export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 6,
  NICKNAME_MIN_LENGTH: 2,
  NICKNAME_MAX_LENGTH: 20,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
} as const;

// 라우트 경로
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  CALENDAR: '/calendar'
} as const;
