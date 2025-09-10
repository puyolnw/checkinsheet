import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';
import type { ApiResponse, AuthResponse, LoginRequest } from '../types';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data, error.message);
    
    if (error.response?.status === 401) {
      console.log('401 Unauthorized - clearing auth data and redirecting to login');
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Only redirect if not already on login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    try {
      console.log('Sending login request to:', api.defaults.baseURL + '/auth/login');
      console.log('Credentials:', credentials);
      
      const response = await api.post('/auth/login', credentials);
      console.log('Login response:', response.data);
      
      return response.data;
    } catch (error: any) {
      console.error('Login API error:', error);
      
      if (error.response) {
        // Server responded with error status
        console.error('Error response:', error.response.data);
        throw new Error(error.response.data?.message || 'Server error');
      } else if (error.request) {
        // Request was made but no response received
        console.error('No response received:', error.request);
        throw new Error('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ - ตรวจสอบว่า backend server รันอยู่หรือไม่');
      } else {
        // Something else happened
        console.error('Request setup error:', error.message);
        throw new Error('เกิดข้อผิดพลาดในการส่งคำขอ');
      }
    }
  },

  getProfile: async (): Promise<ApiResponse> => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  logout: async (): Promise<ApiResponse> => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  changePassword: async (data: { currentPassword: string; newPassword: string }): Promise<ApiResponse> => {
    const response = await api.put('/auth/change-password', data);
    return response.data;
  },

  registerStudent: async (data: any): Promise<ApiResponse> => {
    const response = await api.post('/auth/register-student', data);
    return response.data;
  },
};

// Students API
export const studentsAPI = {
  getAll: async (params?: any): Promise<ApiResponse> => {
    const response = await api.get('/students', { params });
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse> => {
    const response = await api.get(`/students/${id}`);
    return response.data;
  },

  create: async (data: any): Promise<ApiResponse> => {
    const response = await api.post('/students', data);
    return response.data;
  },

  update: async (id: number, data: any): Promise<ApiResponse> => {
    const response = await api.put(`/students/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse> => {
    const response = await api.delete(`/students/${id}`);
    return response.data;
  },

  assignSchool: async (id: number, schoolId: number): Promise<ApiResponse> => {
    const response = await api.put(`/students/${id}/assign-school`, { schoolId });
    return response.data;
  },

  assignMentor: async (id: number, mentorId: number): Promise<ApiResponse> => {
    const response = await api.put(`/students/${id}/assign-mentor`, { mentorId });
    return response.data;
  },

  assignSupervisor: async (id: number, supervisorId: number): Promise<ApiResponse> => {
    const response = await api.put(`/students/${id}/assign-supervisor`, { supervisorId });
    return response.data;
  },

  getByMentor: async (mentorId: string, params?: any): Promise<ApiResponse> => {
    const response = await api.get(`/students/mentor/${mentorId}`, { params });
    return response.data;
  },

  getBySupervisor: async (supervisorId: string, params?: any): Promise<ApiResponse> => {
    const response = await api.get(`/students/supervisor/${supervisorId}`, { params });
    return response.data;
  },
};

// Schools API
export const schoolsAPI = {
  getAll: async (params?: any): Promise<ApiResponse> => {
    const response = await api.get('/schools', { params });
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse> => {
    const response = await api.get(`/schools/${id}`);
    return response.data;
  },

  create: async (data: any): Promise<ApiResponse> => {
    const response = await api.post('/schools', data);
    return response.data;
  },

  update: async (id: number, data: any): Promise<ApiResponse> => {
    const response = await api.put(`/schools/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse> => {
    const response = await api.delete(`/schools/${id}`);
    return response.data;
  },

  getProvinces: async (): Promise<ApiResponse> => {
    const response = await api.get('/schools/filters/provinces');
    return response.data;
  },

  getSchoolTypes: async (): Promise<ApiResponse> => {
    const response = await api.get('/schools/filters/types');
    return response.data;
  },
};

// Mentors API
export const mentorsAPI = {
  getAll: async (params?: any): Promise<ApiResponse> => {
    const response = await api.get('/mentors', { params });
    return response.data;
  },

  getById: async (id: string | number): Promise<ApiResponse> => {
    const response = await api.get(`/mentors/${id}`);
    return response.data;
  },

  create: async (data: any): Promise<ApiResponse> => {
    const response = await api.post('/mentors', data);
    return response.data;
  },

  update: async (id: string | number, data: any): Promise<ApiResponse> => {
    const response = await api.put(`/mentors/${id}`, data);
    return response.data;
  },

  delete: async (id: string | number): Promise<ApiResponse> => {
    const response = await api.delete(`/mentors/${id}`);
    return response.data;
  },

  getSubjectSpecialties: async (): Promise<ApiResponse> => {
    const response = await api.get('/mentors/filters/specialties');
    return response.data;
  },
};

// Supervisors API
export const supervisorsAPI = {
  getAll: async (params?: any): Promise<ApiResponse> => {
    const response = await api.get('/supervisors', { params });
    return response.data;
  },

  getById: async (id: string | number): Promise<ApiResponse> => {
    const response = await api.get(`/supervisors/${id}`);
    return response.data;
  },

  create: async (data: any): Promise<ApiResponse> => {
    const response = await api.post('/supervisors', data);
    return response.data;
  },

  update: async (id: string | number, data: any): Promise<ApiResponse> => {
    const response = await api.put(`/supervisors/${id}`, data);
    return response.data;
  },

  delete: async (id: string | number): Promise<ApiResponse> => {
    const response = await api.delete(`/supervisors/${id}`);
    return response.data;
  },

  getDepartments: async (): Promise<ApiResponse> => {
    const response = await api.get('/supervisors/filters/departments');
    return response.data;
  },

  getAcademicRanks: async (): Promise<ApiResponse> => {
    const response = await api.get('/supervisors/filters/ranks');
    return response.data;
  },
};

// Practicum Records API
export const practicumAPI = {
  getAll: async (params?: any): Promise<ApiResponse> => {
    const response = await api.get('/practicum-records', { params });
    return response.data;
  },

  getById: async (id: string | number): Promise<ApiResponse> => {
    const response = await api.get(`/practicum-records/${id}`);
    return response.data;
  },

  create: async (data: any): Promise<ApiResponse> => {
    const response = await api.post('/practicum-records', data);
    return response.data;
  },

  update: async (id: string | number, data: any): Promise<ApiResponse> => {
    const response = await api.put(`/practicum-records/${id}`, data);
    return response.data;
  },

  delete: async (id: string | number): Promise<ApiResponse> => {
    const response = await api.delete(`/practicum-records/${id}`);
    return response.data;
  },

  approve: async (id: number, feedback?: string): Promise<ApiResponse> => {
    const response = await api.put(`/practicum-records/${id}/approve`, { feedback });
    return response.data;
  },

  reject: async (id: number, feedback: string): Promise<ApiResponse> => {
    const response = await api.put(`/practicum-records/${id}/reject`, { feedback });
    return response.data;
  },

  getStudentPracticumSummary: async (studentId: string): Promise<ApiResponse> => {
    const response = await api.get(`/practicum-records/summary/${studentId}`);
    return response.data;
  },
};

// Evaluations API
export const evaluationsAPI = {
  getAll: async (params?: any): Promise<ApiResponse> => {
    const response = await api.get('/evaluations', { params });
    return response.data;
  },

  getById: async (id: string | number): Promise<ApiResponse> => {
    const response = await api.get(`/evaluations/${id}`);
    return response.data;
  },

  create: async (data: any): Promise<ApiResponse> => {
    const response = await api.post('/evaluations', data);
    return response.data;
  },

  update: async (id: string | number, data: any): Promise<ApiResponse> => {
    const response = await api.put(`/evaluations/${id}`, data);
    return response.data;
  },

  delete: async (id: string | number): Promise<ApiResponse> => {
    const response = await api.delete(`/evaluations/${id}`);
    return response.data;
  },

  getByEvaluator: async (evaluatorId: string, params?: any): Promise<ApiResponse> => {
    const response = await api.get(`/evaluations/evaluator/${evaluatorId}`, { params });
    return response.data;
  },
};

// Announcements API
export const announcementsAPI = {
  getAll: async (params?: any): Promise<ApiResponse> => {
    const response = await api.get('/announcements', { params });
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse> => {
    const response = await api.get(`/announcements/${id}`);
    return response.data;
  },

  create: async (data: any): Promise<ApiResponse> => {
    const response = await api.post('/announcements', data);
    return response.data;
  },

  update: async (id: number, data: any): Promise<ApiResponse> => {
    const response = await api.put(`/announcements/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse> => {
    const response = await api.delete(`/announcements/${id}`);
    return response.data;
  },

  publish: async (id: number): Promise<ApiResponse> => {
    const response = await api.put(`/announcements/${id}/publish`);
    return response.data;
  },

  getActive: async (params?: any): Promise<ApiResponse> => {
    const response = await api.get('/announcements/active', { params });
    return response.data;
  },
};

// Messages API
export const messagesAPI = {
  getAll: async (params?: any): Promise<ApiResponse> => {
    const response = await api.get('/messages', { params });
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse> => {
    const response = await api.get(`/messages/${id}`);
    return response.data;
  },

  create: async (data: any): Promise<ApiResponse> => {
    const response = await api.post('/messages', data);
    return response.data;
  },

  markAsRead: async (id: number): Promise<ApiResponse> => {
    const response = await api.put(`/messages/${id}/read`);
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse> => {
    const response = await api.delete(`/messages/${id}`);
    return response.data;
  },
};

// Notifications API
export const notificationsAPI = {
  getAll: async (params?: any): Promise<ApiResponse> => {
    const response = await api.get('/notifications', { params });
    return response.data;
  },

  markAsRead: async (id: number): Promise<ApiResponse> => {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async (): Promise<ApiResponse> => {
    const response = await api.put('/notifications/read-all');
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse> => {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  },
};

// Dashboard API
export const dashboardAPI = {
  getStats: async (): Promise<ApiResponse> => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },

  getRecentActivities: async (): Promise<ApiResponse> => {
    const response = await api.get('/dashboard/activities');
    return response.data;
  },
};

// Lesson Plans API
export const lessonPlansAPI = {
  getAll: async (params?: any): Promise<ApiResponse> => {
    const response = await api.get('/lesson-plans', { params });
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse> => {
    const response = await api.get(`/lesson-plans/${id}`);
    return response.data;
  },

  create: async (data: any): Promise<ApiResponse> => {
    const response = await api.post('/lesson-plans', data);
    return response.data;
  },

  update: async (id: number, data: any): Promise<ApiResponse> => {
    const response = await api.put(`/lesson-plans/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse> => {
    const response = await api.delete(`/lesson-plans/${id}`);
    return response.data;
  },

  submit: async (id: number): Promise<ApiResponse> => {
    const response = await api.put(`/lesson-plans/${id}/submit`);
    return response.data;
  },

  approve: async (id: number, feedback?: string): Promise<ApiResponse> => {
    const response = await api.put(`/lesson-plans/${id}/approve`, { feedback });
    return response.data;
  },

  reject: async (id: number, feedback: string): Promise<ApiResponse> => {
    const response = await api.put(`/lesson-plans/${id}/reject`, { feedback });
    return response.data;
  },

  getByMentor: async (mentorId: string, params?: any): Promise<ApiResponse> => {
    const response = await api.get(`/lesson-plans/mentor/${mentorId}`, { params });
    return response.data;
  },
};

// Reports API
export const reportsAPI = {
  getPracticumProgressReport: async (params?: any): Promise<ApiResponse> => {
    const response = await api.get('/reports/practicum-progress', { params });
    return response.data;
  },

  getEvaluationSummaryReport: async (params?: any): Promise<ApiResponse> => {
    const response = await api.get('/reports/evaluation-summary', { params });
    return response.data;
  },

  getStudentPerformanceReport: async (studentId: string, params?: any): Promise<ApiResponse> => {
    const response = await api.get(`/reports/student-performance/${studentId}`, { params });
    return response.data;
  },

  getSystemOverview: async (): Promise<ApiResponse> => {
    const response = await api.get('/reports/system-overview');
    return response.data;
  },

  exportReport: async (reportType: string, params?: any): Promise<ApiResponse> => {
    const response = await api.get('/reports/export', { 
      params: { ...params, reportType },
      responseType: 'blob'
    });
    return response.data;
  },
};

export default api;
