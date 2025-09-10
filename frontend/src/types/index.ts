// User and Authentication Types
export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role_id: number;
  role_name: string;
  role: string; // Add role property
  is_active: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface LoginRequest {
  username: string;
  password: string;
}

// Student Types
export interface Student {
  id: number;
  user_id: number;
  student_id: string;
  major: string;
  year_level: number;
  semester: number;
  academic_year: string;
  gpa?: number;
  assigned_school_id?: number;
  assigned_mentor_id?: number;
  assigned_supervisor_id?: number;
  practicum_hours_completed: number;
  practicum_hours_required: number;
  status: 'registered' | 'assigned' | 'in_progress' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
  // Joined data
  school_name?: string;
  mentor_first_name?: string;
  mentor_last_name?: string;
  supervisor_first_name?: string;
  supervisor_last_name?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  total_hours?: number;
}

// School Types
export interface School {
  id: number;
  school_name: string;
  school_type?: string;
  address?: string;
  district?: string;
  province?: string;
  postal_code?: string;
  phone?: string;
  email?: string;
  director_name?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Joined data
  student_count?: number;
  mentor_count?: number;
}

// Mentor Teacher Types
export interface MentorTeacher {
  id: number;
  user_id: number;
  teacher_id?: string;
  school_id: number;
  subject_specialty?: string;
  teaching_experience?: number;
  education_level?: string;
  position?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Joined data
  school_name?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  student_count?: number;
}

// Supervisor Types
export interface Supervisor {
  id: number;
  user_id: number;
  employee_id?: string;
  department: string;
  faculty: string;
  subject_specialty?: string;
  academic_rank?: string;
  education_level?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Joined data
  first_name?: string;
  last_name?: string;
  email?: string;
  student_count?: number;
}

// Practicum Record Types
export interface PracticumRecord {
  id: number;
  student_id: number;
  record_date: string;
  start_time: string;
  end_time: string;
  hours_worked: number;
  activities_description: string;
  learning_outcomes?: string;
  challenges_faced?: string;
  reflections?: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  mentor_feedback?: string;
  mentor_approved_at?: string;
  supervisor_feedback?: string;
  supervisor_approved_at?: string;
  created_at: string;
  updated_at: string;
}

// Evaluation Types
export interface Evaluation {
  id: number;
  student_id: number;
  evaluator_id: number;
  evaluator_type: 'mentor' | 'supervisor';
  evaluation_type: 'weekly' | 'midterm' | 'final';
  evaluation_date: string;
  teaching_preparation?: number;
  classroom_management?: number;
  content_knowledge?: number;
  teaching_methods?: number;
  student_interaction?: number;
  assessment_evaluation?: number;
  professional_ethics?: number;
  punctuality_attendance?: number;
  communication_skills?: number;
  adaptability?: number;
  total_score?: number;
  grade?: string;
  strengths?: string;
  weaknesses?: string;
  recommendations?: string;
  overall_feedback?: string;
  created_at: string;
  updated_at: string;
  // Joined data
  student_name?: string;
  student_code?: string;
  evaluator_name?: string;
  evaluator_role?: string;
}

// Lesson Plan Types
export interface LessonPlan {
  id: number;
  student_id: number;
  title: string;
  subject: string;
  grade_level: string;
  lesson_duration: number;
  learning_objectives: string;
  teaching_materials?: string;
  teaching_methods?: string;
  assessment_methods?: string;
  file_path?: string;
  file_name?: string;
  file_size?: number;
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'revision_required';
  mentor_feedback?: string;
  supervisor_feedback?: string;
  approved_by_mentor?: number;
  approved_by_supervisor?: number;
  approved_at?: string;
  created_at: string;
  updated_at: string;
}

// Announcement Types
export interface Announcement {
  id: number;
  title: string;
  content: string;
  announcement_type: 'news' | 'announcement' | 'urgent' | 'general';
  target_audience: 'all' | 'students' | 'mentors' | 'supervisors' | 'admin';
  is_published: boolean;
  publish_date?: string;
  expiry_date?: string;
  created_by: number;
  attachment_file?: string;
  view_count: number;
  created_at: string;
  updated_at: string;
}

// Message Types
export interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  subject?: string;
  message_content: string;
  message_type: 'general' | 'urgent' | 'feedback' | 'question';
  is_read: boolean;
  read_at?: string;
  reply_to_id?: number;
  attachment_file?: string;
  created_at: string;
  // Joined data
  sender_name?: string;
  receiver_name?: string;
}

// Notification Types
export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  notification_type?: string;
  related_table?: string;
  related_id?: number;
  is_read: boolean;
  read_at?: string;
  created_at: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form Types
export interface LoginForm {
  username: string;
  password: string;
}

export interface ChangePasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Dashboard Types
export interface DashboardStats {
  totalStudents: number;
  totalSchools: number;
  totalMentors: number;
  totalSupervisors: number;
  activePracticums: number;
  completedPracticums: number;
  pendingEvaluations: number;
  recentActivities: any[];
}

// Role Types
export type UserRole = 'admin' | 'student' | 'mentor' | 'supervisor';

export interface RolePermissions {
  canViewStudents: boolean;
  canEditStudents: boolean;
  canViewSchools: boolean;
  canEditSchools: boolean;
  canViewMentors: boolean;
  canEditMentors: boolean;
  canViewSupervisors: boolean;
  canEditSupervisors: boolean;
  canViewPracticumRecords: boolean;
  canEditPracticumRecords: boolean;
  canViewEvaluations: boolean;
  canEditEvaluations: boolean;
  canViewAnnouncements: boolean;
  canEditAnnouncements: boolean;
  canViewMessages: boolean;
  canSendMessages: boolean;
  canViewReports: boolean;
  canExportData: boolean;
}
