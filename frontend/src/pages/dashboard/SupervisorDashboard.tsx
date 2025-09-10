import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { studentsAPI, evaluationsAPI } from '../../services/api';

interface DashboardStats {
  assignedStudents: number;
  totalEvaluations: number;
  averageScore: number;
  completedPracticum: number;
  pendingEvaluations: number;
  totalSchools: number;
}

interface RecentActivity {
  id: string;
  type: 'evaluation' | 'practicum' | 'announcement' | 'report';
  title: string;
  description: string;
  date: string;
  studentName?: string;
  schoolName?: string;
}

const SupervisorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    assignedStudents: 0,
    totalEvaluations: 0,
    averageScore: 0,
    completedPracticum: 0,
    pendingEvaluations: 0,
    totalSchools: 0
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [assignedStudents, setAssignedStudents] = useState<any[]>([]);
  const [schoolStats, setSchoolStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch assigned students
      const studentsResponse = await studentsAPI.getAll({ supervisor_id: user?.id?.toString() });
      if (studentsResponse.success) {
        setAssignedStudents(studentsResponse.data);
        setStats(prev => ({ ...prev, assignedStudents: studentsResponse.data.length }));
      }

      // Fetch evaluation statistics
      const evaluationsResponse = await evaluationsAPI.getByEvaluator(user?.id?.toString() || '');
      if (evaluationsResponse.success) {
        const evaluations = evaluationsResponse.data;
        const totalEvaluations = evaluations.length;
        const averageScore = totalEvaluations > 0 
          ? evaluations.reduce((sum: number, evaluation: any) => sum + (evaluation.total_score || 0), 0) / totalEvaluations 
          : 0;
        
        setStats(prev => ({ 
          ...prev, 
          totalEvaluations, 
          averageScore: Math.round(averageScore * 100) / 100 
        }));
      }

      // Fetch pending evaluations (no status filter since evaluations table doesn't have status)
      setStats(prev => ({ ...prev, pendingEvaluations: 0 }));

      // Fetch school statistics - temporarily disable until reports API is fixed
      setStats(prev => ({ 
        ...prev, 
        totalSchools: 0 
      }));
      setSchoolStats([]);

      // Calculate completed practicum
      const completedPracticum = assignedStudents.filter(student => 
        student.total_hours >= 50
      ).length;
      setStats(prev => ({ ...prev, completedPracticum }));

      // Fetch recent activities
      await fetchRecentActivities();

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentActivities = async () => {
    try {
      const activities: RecentActivity[] = [];

      // Get recent evaluations
      const evaluationsResponse = await evaluationsAPI.getByEvaluator(user?.id?.toString() || '', { limit: 3 });
      if (evaluationsResponse.success) {
        evaluationsResponse.data.forEach((evaluation: any) => {
          activities.push({
            id: evaluation.id,
            type: 'evaluation',
            title: `ประเมิน ${evaluation.student_name || 'ไม่ระบุชื่อ'}`,
            description: `คะแนนรวม: ${evaluation.total_score || 0} คะแนน`,
            date: evaluation.evaluation_date,
            studentName: evaluation.student_name || 'ไม่ระบุชื่อ'
          });
        });
      }

      // Get recent practicum records - temporarily disable until reports API is fixed
      // const practicumResponse = await reportsAPI.getPracticumProgressReport({ limit: 3 });

      // Get recent announcements - temporarily disable until announcements API is available
      // const announcementsResponse = await announcementsAPI.getActive({ limit: 2 });

      // Sort by date and take latest 5
      activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setRecentActivities(activities.slice(0, 5));

    } catch (error) {
      console.error('Error fetching recent activities:', error);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'evaluation':
        return '📊';
      case 'practicum':
        return '🎓';
      case 'announcement':
        return '📢';
      case 'report':
        return '📈';
      default:
        return '📄';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'evaluation':
        return 'bg-blue-100 text-blue-800';
      case 'practicum':
        return 'bg-green-100 text-green-800';
      case 'announcement':
        return 'bg-yellow-100 text-yellow-800';
      case 'report':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard อาจารย์นิเทศ</h1>
          <p className="text-gray-600">ยินดีต้อนรับ {user?.first_name} {user?.last_name}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">นักศึกษาที่ดูแล</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.assignedStudents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">ประเมินทั้งหมด</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalEvaluations}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">คะแนนเฉลี่ย</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.averageScore}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">โรงเรียนทั้งหมด</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalSchools}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Assigned Students */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">นักศึกษาที่ดูแล</h3>
            </div>
            <div className="p-6">
              {assignedStudents.length > 0 ? (
                <div className="space-y-4">
                  {assignedStudents.slice(0, 5).map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-gray-600 text-sm font-medium">
                            {student.first_name?.charAt(0)}{student.last_name?.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900">
                            {student.first_name} {student.last_name}
                          </p>
                          <p className="text-sm text-gray-500">รหัส: {student.student_id}</p>
                          <p className="text-sm text-gray-500">{student.school_name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">ชั่วโมงฝึก</p>
                        <p className="text-sm font-medium text-gray-900">{student.total_hours || 0} ชม.</p>
                        <div className={`text-xs px-2 py-1 rounded-full ${
                          (student.total_hours || 0) >= 50 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {(student.total_hours || 0) >= 50 ? 'เสร็จสิ้น' : 'กำลังฝึก'}
                        </div>
                      </div>
                    </div>
                  ))}
                  {assignedStudents.length > 5 && (
                    <p className="text-sm text-gray-500 text-center">
                      และอีก {assignedStudents.length - 5} คน
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">ยังไม่มีนักศึกษาที่ดูแล</p>
              )}
            </div>
          </div>

          {/* School Distribution */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">การกระจายตามโรงเรียน</h3>
            </div>
            <div className="p-6">
              {schoolStats.length > 0 ? (
                <div className="space-y-4">
                  {schoolStats.slice(0, 5).map((school, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{school.school_name}</p>
                        <p className="text-sm text-gray-500">นักศึกษา: {school.student_count} คน</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">ใช้งาน</p>
                        <p className="text-sm font-medium text-gray-900">{school.active_students} คน</p>
                      </div>
                    </div>
                  ))}
                  {schoolStats.length > 5 && (
                    <p className="text-sm text-gray-500 text-center">
                      และอีก {schoolStats.length - 5} โรงเรียน
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">ไม่มีข้อมูลโรงเรียน</p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">กิจกรรมล่าสุด</h3>
          </div>
          <div className="p-6">
            {recentActivities.length > 0 ? (
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                      <span className="text-sm">{getActivityIcon(activity.type)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-500">{activity.description}</p>
                      {activity.studentName && (
                        <p className="text-xs text-gray-400">นักศึกษา: {activity.studentName}</p>
                      )}
                      {activity.schoolName && (
                        <p className="text-xs text-gray-400">โรงเรียน: {activity.schoolName}</p>
                      )}
                      <p className="text-xs text-gray-400">
                        {new Date(activity.date).toLocaleDateString('th-TH')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">ไม่มีกิจกรรมล่าสุด</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">การดำเนินการด่วน</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="text-center">
                <svg className="w-8 h-8 text-blue-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm font-medium text-gray-900">ประเมินนักศึกษา</p>
              </div>
            </button>
            <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="text-center">
                <svg className="w-8 h-8 text-green-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p className="text-sm font-medium text-gray-900">ดูรายงาน</p>
              </div>
            </button>
            <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="text-center">
                <svg className="w-8 h-8 text-purple-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-sm font-medium text-gray-900">ส่งข้อความ</p>
              </div>
            </button>
            <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="text-center">
                <svg className="w-8 h-8 text-yellow-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <p className="text-sm font-medium text-gray-900">สร้างประกาศ</p>
              </div>
            </button>
          </div>
        </div>
      </div>
  );
};

export default SupervisorDashboard;
