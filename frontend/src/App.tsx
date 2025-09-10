import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';

// Pages
import ModernLanding from './pages/ModernLanding';
import ModernLogin from './pages/auth/ModernLogin';
import StudentRegister from './pages/auth/StudentRegister';
import Dashboard from './pages/dashboard/Dashboard';
import StudentsList from './pages/students/StudentsList';
import StudentCreate from './pages/students/StudentCreate';
import StudentEdit from './pages/students/StudentEdit';
import StudentView from './pages/students/StudentView';
import PracticumRecords from './pages/practicum/PracticumRecords';
import PracticumCreate from './pages/practicum/PracticumCreate';
import PracticumEdit from './pages/practicum/PracticumEdit';
import SchoolsList from './pages/schools/SchoolsList';
import SchoolCreate from './pages/schools/SchoolCreate';
import SchoolEdit from './pages/schools/SchoolEdit';
import SchoolView from './pages/schools/SchoolView';
import MentorsList from './pages/mentors/MentorsList';
import MentorCreate from './pages/mentors/MentorCreate';
import MentorEdit from './pages/mentors/MentorEdit';
import MentorView from './pages/mentors/MentorView';
import SupervisorsList from './pages/supervisors/SupervisorsList';
import SupervisorCreate from './pages/supervisors/SupervisorCreate';
import SupervisorEdit from './pages/supervisors/SupervisorEdit';
import SupervisorView from './pages/supervisors/SupervisorView';
import EvaluationsList from './pages/evaluations/EvaluationsList';
import EvaluationCreate from './pages/evaluations/EvaluationCreate';
import EvaluationEdit from './pages/evaluations/EvaluationEdit';
import ReportsDashboard from './pages/reports/ReportsDashboard';
import MentorDashboard from './pages/dashboard/MentorDashboard';
import SupervisorDashboard from './pages/dashboard/SupervisorDashboard';

// Layouts
import ModernGuestLayout from './components/layouts/ModernGuestLayout';
import ModernAuthenticatedLayout from './components/layouts/ModernAuthenticatedLayout';

// Components
import RoleBasedRedirect from './components/RoleBasedRedirect';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return isAuthenticated ? <ModernAuthenticatedLayout>{children}</ModernAuthenticatedLayout> : <Navigate to="/login" replace />;
};

// Public Route Component (redirect to appropriate dashboard if already authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return isAuthenticated ? <RoleBasedRedirect /> : <ModernGuestLayout>{children}</ModernGuestLayout>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route 
              path="/" 
              element={
                <PublicRoute>
                  <ModernLanding />
                </PublicRoute>
              } 
            />
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <ModernLogin />
                </PublicRoute>
              } 
            />
            <Route 
              path="/register" 
              element={
                <PublicRoute>
                  <StudentRegister />
                </PublicRoute>
              } 
            />

            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/mentor-dashboard" 
              element={
                <ProtectedRoute>
                  <MentorDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/supervisor-dashboard" 
              element={
                <ProtectedRoute>
                  <SupervisorDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/students" 
              element={
                <ProtectedRoute>
                  <StudentsList />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/students/create" 
              element={
                <ProtectedRoute>
                  <StudentCreate />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/students/:id" 
              element={
                <ProtectedRoute>
                  <StudentView />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/students/:id/edit" 
              element={
                <ProtectedRoute>
                  <StudentEdit />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/practicum" 
              element={
                <ProtectedRoute>
                  <PracticumRecords />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/practicum/create" 
              element={
                <ProtectedRoute>
                  <PracticumCreate />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/practicum/:id/edit" 
              element={
                <ProtectedRoute>
                  <PracticumEdit />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/schools" 
              element={
                <ProtectedRoute>
                  <SchoolsList />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/schools/create" 
              element={
                <ProtectedRoute>
                  <SchoolCreate />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/schools/:id" 
              element={
                <ProtectedRoute>
                  <SchoolView />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/schools/:id/edit" 
              element={
                <ProtectedRoute>
                  <SchoolEdit />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/mentors" 
              element={
                <ProtectedRoute>
                  <MentorsList />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/mentors/create" 
              element={
                <ProtectedRoute>
                  <MentorCreate />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/mentors/:id" 
              element={
                <ProtectedRoute>
                  <MentorView />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/mentors/:id/edit" 
              element={
                <ProtectedRoute>
                  <MentorEdit />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/supervisors" 
              element={
                <ProtectedRoute>
                  <SupervisorsList />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/supervisors/create" 
              element={
                <ProtectedRoute>
                  <SupervisorCreate />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/supervisors/:id" 
              element={
                <ProtectedRoute>
                  <SupervisorView />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/supervisors/:id/edit" 
              element={
                <ProtectedRoute>
                  <SupervisorEdit />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/evaluations" 
              element={
                <ProtectedRoute>
                  <EvaluationsList />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/evaluations/create" 
              element={
                <ProtectedRoute>
                  <EvaluationCreate />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/evaluations/:id/edit" 
              element={
                <ProtectedRoute>
                  <EvaluationEdit />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/reports" 
              element={
                <ProtectedRoute>
                  <ReportsDashboard />
                </ProtectedRoute>
              } 
            />

            {/* Catch all route - redirect to dashboard if authenticated, otherwise to landing */}
            <Route 
              path="*" 
              element={<Navigate to="/" replace />} 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;