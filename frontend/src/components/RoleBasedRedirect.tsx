import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, usePermissions } from '../hooks/useAuth';

const RoleBasedRedirect: React.FC = () => {
  const { user } = useAuth();
  const { isAdmin, isStudent, isMentor, isSupervisor } = usePermissions();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect based on user role
  if (isAdmin) {
    return <Navigate to="/dashboard" replace />;
  } else if (isMentor) {
    return <Navigate to="/mentor-dashboard" replace />;
  } else if (isSupervisor) {
    return <Navigate to="/supervisor-dashboard" replace />;
  } else if (isStudent) {
    return <Navigate to="/dashboard" replace />;
  }

  // Default fallback
  return <Navigate to="/dashboard" replace />;
};

export default RoleBasedRedirect;
