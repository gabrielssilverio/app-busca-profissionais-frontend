import axios from 'axios'
import { useAuthStore } from '../store/authStore'

export const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth
export const authApi = {
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data).then(r => r.data.data),
  register: (data: { name: string; email: string; password: string; phone?: string; role: string }) =>
    api.post('/auth/register', data).then(r => r.data.data),
  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }).then(r => r.data),
  resetPassword: (token: string, newPassword: string) =>
    api.post('/auth/reset-password', { token, newPassword }).then(r => r.data),
}

// Salons
export const salonApi = {
  search: (params: { city?: string; category?: string; query?: string; page?: number; size?: number }) =>
    api.get('/salons/search', { params }).then(r => r.data.data),
  getHighlighted: () =>
    api.get('/salons/highlighted').then(r => r.data.data),
  getNearby: (lat: number, lng: number, radius?: number) =>
    api.get('/salons/nearby', { params: { lat, lng, radius } }).then(r => r.data.data),
  getById: (id: string) =>
    api.get(`/salons/public/${id}`).then(r => r.data.data),
  getMine: () =>
    api.get('/salons/manage/mine').then(r => r.data.data),
  create: (data: object) =>
    api.post('/salons/manage', data).then(r => r.data.data),
  update: (id: string, data: object) =>
    api.put(`/salons/manage/${id}`, data).then(r => r.data.data),
}

// Services
export const serviceApi = {
  getBySalon: (salonId: string) =>
    api.get(`/salons/${salonId}/services`).then(r => r.data.data),
  create: (salonId: string, data: object) =>
    api.post(`/salons/${salonId}/services`, data).then(r => r.data.data),
  update: (salonId: string, serviceId: string, data: object) =>
    api.put(`/salons/${salonId}/services/${serviceId}`, data).then(r => r.data.data),
  delete: (salonId: string, serviceId: string) =>
    api.delete(`/salons/${salonId}/services/${serviceId}`).then(r => r.data),
}

// Professionals
export const professionalApi = {
  getBySalon: (salonId: string) =>
    api.get(`/professionals/salon/${salonId}`).then(r => r.data.data),
  getMyProfile: () =>
    api.get('/professionals/profile').then(r => r.data.data),
  updateProfile: (data: object) =>
    api.put('/professionals/profile', data).then(r => r.data.data),
  joinSalon: (salonId: string) =>
    api.post(`/professionals/salon/${salonId}/join`).then(r => r.data),
  leaveSalon: (salonId: string) =>
    api.delete(`/professionals/salon/${salonId}/leave`).then(r => r.data),
}

// Appointments
export const appointmentApi = {
  create: (data: { salonId: string; professionalId: string; serviceId: string; scheduledAt: string; notes?: string }) =>
    api.post('/appointments', data).then(r => r.data.data),
  getMine: () =>
    api.get('/appointments/mine').then(r => r.data.data),
  getBySalon: (salonId: string) =>
    api.get(`/appointments/salon/${salonId}`).then(r => r.data.data),
  confirm: (id: string) =>
    api.patch(`/appointments/${id}/confirm`).then(r => r.data.data),
  complete: (id: string) =>
    api.patch(`/appointments/${id}/complete`).then(r => r.data.data),
  cancel: (id: string) =>
    api.patch(`/appointments/${id}/cancel`).then(r => r.data.data),
}

// Reviews
export const reviewApi = {
  getBySalon: (salonId: string) =>
    api.get(`/reviews/salon/${salonId}`).then(r => r.data.data),
  create: (data: { appointmentId: string; rating: number; comment?: string }) =>
    api.post('/reviews', data).then(r => r.data.data),
}

// Highlights
export const highlightApi = {
  request: (data: { salonId: string; startsAt: string; days: number }) =>
    api.post('/highlights', data).then(r => r.data.data),
}

// Admin
export const adminApi = {
  getDashboard: () =>
    api.get('/admin/dashboard').then(r => r.data.data),
  getUsers: (page = 0, size = 20) =>
    api.get('/admin/users', { params: { page, size } }).then(r => r.data.data),
  getSalons: (page = 0, size = 20) =>
    api.get('/admin/salons', { params: { page, size } }).then(r => r.data.data),
  getReviews: () =>
    api.get('/admin/reviews').then(r => r.data.data),
  banUser: (id: string) =>
    api.patch(`/admin/users/${id}/ban`).then(r => r.data),
  unbanUser: (id: string) =>
    api.patch(`/admin/users/${id}/unban`).then(r => r.data),
  flagReview: (id: string) =>
    api.patch(`/admin/reviews/${id}/flag`).then(r => r.data),
  impersonateUser: (id: string) =>
    api.post(`/admin/users/${id}/impersonate`).then(r => r.data.data),
}

// User
export const userApi = {
  getMe: () =>
    api.get('/users/me').then(r => r.data.data),
  updateMe: (data: { name?: string; phone?: string; profileImage?: string }) =>
    api.patch('/users/me', data).then(r => r.data.data),
  changePassword: (currentPassword: string, newPassword: string) =>
    api.post('/users/me/change-password', { currentPassword, newPassword }).then(r => r.data),
  getPayments: () =>
    api.get('/users/me/payments').then(r => r.data.data),
}
