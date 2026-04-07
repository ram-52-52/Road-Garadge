export const BASE_URL = 'https://road-garadge.onrender.com/api/v1';

export const END_POINTS = {
  AUTH: {
    REQUEST_OTP: '/auth/request-otp',
    VERIFY_OTP: '/auth/verify-otp',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    REGISTER: '/auth/register',
    ME: '/auth/me',
    COMPLETE_PROFILE: '/auth/complete-profile'
  },
  GARAGE: {
    NEARBY: '/garages/nearby',
    BASE: '/garages',
    DETAIL: (id: string) => `/garages/${id}`,
    JOBS: (id: string) => `/garages/${id}/jobs`,
    EARNINGS: (id: string) => `/garages/${id}/earnings`
  },
  JOB: {
    BASE: '/jobs',
    DETAIL: (id: string) => `/jobs/${id}`,
    ACCEPT: (id: string) => `/jobs/${id}/accept`,
    START: (id: string) => `/jobs/${id}/start`,
    COMPLETE: (id: string) => `/jobs/${id}/complete`,
    CANCEL: (id: string) => `/jobs/${id}/cancel`,
    TRACK: (id: string) => `/jobs/${id}/track`
  },
  PAYMENT: {
    CREATE_ORDER: '/payments/order',
    VERIFY: '/payments/verify'
  },
  ADMIN: {
    GARAGES: '/admin/garages',
    VERIFY_GARAGE: (id: string) => `/admin/garages/${id}/verify`,
    JOBS: '/admin/jobs',
    STATS: '/admin/stats',
    ANALYTICS: '/admin/analytics'
  }
};
