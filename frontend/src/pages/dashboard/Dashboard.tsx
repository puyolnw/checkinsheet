import React, { useState, useEffect } from 'react';
import { useAuth, usePermissions } from '../../hooks/useAuth';
import { studentsAPI, schoolsAPI, mentorsAPI, supervisorsAPI, practicumAPI, evaluationsAPI } from '../../services/api';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { isAdmin, isStudent } = usePermissions();
  const [stats, setStats] = useState<any>(null);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        if (isAdmin) {
          // Fetch real data for admin
          const [studentsRes, schoolsRes, mentorsRes, supervisorsRes, practicumRes, evaluationsRes] = await Promise.all([
            studentsAPI.getAll({ limit: 1000 }),
            schoolsAPI.getAll({ limit: 1000 }),
            mentorsAPI.getAll({ limit: 1000 }),
            supervisorsAPI.getAll({ limit: 1000 }),
            practicumAPI.getAll({ limit: 1000 }),
            evaluationsAPI.getAll({ limit: 1000 })
          ]);

          const stats = {
            totalStudents: studentsRes.success ? studentsRes.data.length : 0,
            totalSchools: schoolsRes.success ? schoolsRes.data.length : 0,
            totalMentors: mentorsRes.success ? mentorsRes.data.length : 0,
            totalSupervisors: supervisorsRes.success ? supervisorsRes.data.length : 0,
            activePracticums: practicumRes.success ? practicumRes.data.length : 0,
            completedPracticums: practicumRes.success ? practicumRes.data.filter((p: any) => p.total_hours >= 50).length : 0,
            pendingEvaluations: evaluationsRes.success ? evaluationsRes.data.length : 0
          };

          setStats(stats);
        } else if (isStudent) {
          // Fetch data for student
          const [practicumRes, summaryRes] = await Promise.all([
            practicumAPI.getAll({ student_id: user?.id, limit: 1000 }),
            practicumAPI.getStudentPracticumSummary(user?.id?.toString() || '')
          ]);

          const stats = {
            totalPracticumRecords: practicumRes.success ? practicumRes.data.length : 0,
            approvedRecords: practicumRes.success ? practicumRes.data.filter((p: any) => p.status === 'approved').length : 0,
            pendingRecords: practicumRes.success ? practicumRes.data.filter((p: any) => p.status === 'pending' || p.status === 'submitted').length : 0,
            completedHours: summaryRes.success ? summaryRes.data.practicum_hours_completed || 0 : 0,
            requiredHours: summaryRes.success ? summaryRes.data.practicum_hours_required || 50 : 50,
            progressPercentage: summaryRes.success ? Math.round(((summaryRes.data.practicum_hours_completed || 0) / (summaryRes.data.practicum_hours_required || 50)) * 100) : 0
          };

          setStats(stats);
        } else {
          // For other users (mentor, supervisor), use basic stats
          setStats({
            totalStudents: 0,
            totalSchools: 0,
            totalMentors: 0,
            totalSupervisors: 0,
            activePracticums: 0,
            completedPracticums: 0,
            pendingEvaluations: 0
          });
        }

        // Mock activities for now
        const mockActivities = [
          {
            id: 1,
            type: 'practicum_record',
            message: 'สมหญิง เรียนดี ส่งบันทึกการฝึกปฏิบัติประจำวันที่ 15 กุมภาพันธ์ 2568',
            timestamp: '2025-02-15T10:30:00Z'
          },
          {
            id: 2,
            type: 'evaluation',
            message: 'ครูสมศรี สอนดี ประเมินนักศึกษาสมหญิง เรียนดี เรียบร้อยแล้ว',
            timestamp: '2025-02-14T14:20:00Z'
          },
          {
            id: 3,
            type: 'announcement',
            message: 'ประกาศกำหนดการนิเทศการฝึกประสบการณ์ เดือนกุมภาพันธ์ 2568',
            timestamp: '2025-02-13T09:15:00Z'
          }
        ];

        setRecentActivities(mockActivities);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Fallback to mock data on error
        setStats({
          totalStudents: 0,
          totalSchools: 0,
          totalMentors: 0,
          totalSupervisors: 0,
          activePracticums: 0,
          completedPracticums: 0,
          pendingEvaluations: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isAdmin]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'สวัสดีตอนเช้า';
    if (hour < 18) return 'สวัสดีตอนบ่าย';
    return 'สวัสดีตอนเย็น';
  };

  const getRoleDisplayName = (role: string) => {
    const roleNames: { [key: string]: string } = {
      admin: 'ผู้ดูแลระบบ',
      student: 'นักศึกษา',
      mentor: 'ครูพี่เลี้ยง',
      supervisor: 'อาจารย์นิเทศ'
    };
    return roleNames[role] || role;
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
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {getGreeting()}, {user?.first_name} {user?.last_name}
          </h1>
          <p className="text-gray-600 mt-1">
            {getRoleDisplayName(user?.role_name || '')} - ระบบสารสนเทศนักศึกษาฝึกประสบการณ์วิชาชีพครู
          </p>
          <p className="text-sm text-gray-500 mt-2">
            วันที่ {new Date().toLocaleDateString('th-TH', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              weekday: 'long'
            })}
          </p>
        </div>

        {/* Stats Cards */}
        {isAdmin && stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">นักศึกษาทั้งหมด</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalStudents}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">โรงเรียนทั้งหมด</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalSchools}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">ครูพี่เลี้ยง</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalMentors}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">อาจารย์นิเทศ</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalSupervisors}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Student-specific content */}
        {isStudent && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">ความก้าวหน้าการฝึกปฏิบัติ</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>ชั่วโมงที่ฝึกแล้ว</span>
                    <span>0 / 50 ชั่วโมง</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  ยังไม่มีการบันทึกการฝึกปฏิบัติ
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">ข้อมูลการมอบหมาย</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">โรงเรียน:</span>
                  <span className="text-sm font-medium">ยังไม่ได้รับมอบหมาย</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">ครูพี่เลี้ยง:</span>
                  <span className="text-sm font-medium">ยังไม่ได้รับมอบหมาย</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">อาจารย์นิเทศ:</span>
                  <span className="text-sm font-medium">ยังไม่ได้รับมอบหมาย</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">กิจกรรมล่าสุด</h3>
          </div>
          <div className="p-6">
            {recentActivities.length > 0 ? (
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(activity.timestamp).toLocaleString('th-TH')}
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
          <h3 className="text-lg font-semibold text-gray-900 mb-4">การดำเนินการด่วน</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {isStudent && (
              <>
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                  <div className="flex items-center space-x-3">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span className="font-medium">บันทึกการฝึกปฏิบัติ</span>
                  </div>
                </button>
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                  <div className="flex items-center space-x-3">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="font-medium">ส่งแผนการสอน</span>
                  </div>
                </button>
              </>
            )}
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="font-medium">ส่งข้อความ</span>
              </div>
            </button>
          </div>
        </div>
      </div>
  );
};

export default Dashboard;
