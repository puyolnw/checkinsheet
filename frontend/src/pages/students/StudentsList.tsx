import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { studentsAPI } from '../../services/api';
import type { Student } from '../../types';

const StudentsList: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchStudents();
  }, [currentPage, searchTerm, statusFilter]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await studentsAPI.getAll({
        page: currentPage,
        limit: 10,
        search: searchTerm || undefined,
        status: statusFilter || undefined
      });

      if (response.success) {
        setStudents(response.data);
        setTotalPages(response.pagination?.totalPages || 1);
      } else {
        setError('ไม่สามารถโหลดข้อมูลนักศึกษาได้');
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchStudents();
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      registered: { color: 'bg-gray-100 text-gray-800', text: 'ลงทะเบียนแล้ว' },
      assigned: { color: 'bg-blue-100 text-blue-800', text: 'ได้รับมอบหมาย' },
      in_progress: { color: 'bg-yellow-100 text-yellow-800', text: 'กำลังฝึกปฏิบัติ' },
      completed: { color: 'bg-green-100 text-green-800', text: 'เสร็จสิ้น' },
      failed: { color: 'bg-red-100 text-red-800', text: 'ไม่ผ่าน' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.registered;
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.text}
      </span>
    );
  };


  const handleDelete = async (id: number) => {
    if (window.confirm('คุณแน่ใจหรือไม่ที่จะลบนักศึกษาคนนี้?')) {
      try {
        const response = await studentsAPI.delete(id);
        if (response.success) {
          setError('');
          fetchStudents(); // Refresh the list
        } else {
          setError(response.message || 'ไม่สามารถลบนักศึกษาได้');
        }
      } catch (err) {
        setError('เกิดข้อผิดพลาดในการลบนักศึกษา');
      }
    }
  };

  const getProgressPercentage = (completed: number, required: number) => {
    return Math.min((completed / required) * 100, 100);
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">จัดการนักศึกษา</h1>
            <p className="text-gray-600">จัดการข้อมูลนักศึกษาฝึกประสบการณ์วิชาชีพครู</p>
          </div>
          <Link
            to="/students/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            เพิ่มนักศึกษาใหม่
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="ค้นหาด้วยชื่อ, รหัสนักศึกษา..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">ทุกสถานะ</option>
                <option value="registered">ลงทะเบียนแล้ว</option>
                <option value="assigned">ได้รับมอบหมาย</option>
                <option value="in_progress">กำลังฝึกปฏิบัติ</option>
                <option value="completed">เสร็จสิ้น</option>
                <option value="failed">ไม่ผ่าน</option>
              </select>
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              ค้นหา
            </button>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {/* Students Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    นักศึกษา
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    รหัสนักศึกษา
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    โรงเรียน
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ความก้าวหน้า
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    สถานะ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    การดำเนินการ
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-gray-600 text-sm font-medium">
                            {student.first_name?.charAt(0)}{student.last_name?.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {student.first_name} {student.last_name}
                          </div>
                          <div className="text-sm text-gray-500">{student.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.student_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.school_name || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{
                              width: `${getProgressPercentage(
                                student.practicum_hours_completed,
                                student.practicum_hours_required
                              )}%`
                            }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">
                          {student.practicum_hours_completed}/{student.practicum_hours_required} ชม.
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(student.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link
                          to={`/students/${student.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          ดู
                        </Link>
                        <Link
                          to={`/students/${student.id}/edit`}
                          className="text-green-600 hover:text-green-900"
                        >
                          แก้ไข
                        </Link>
                        <button
                          onClick={() => handleDelete(student.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          ลบ
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  ก่อนหน้า
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  ถัดไป
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    หน้า <span className="font-medium">{currentPage}</span> จาก{' '}
                    <span className="font-medium">{totalPages}</span>
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      ก่อนหน้า
                    </button>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      ถัดไป
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Empty State */}
        {students.length === 0 && !loading && (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">ไม่มีข้อมูลนักศึกษา</h3>
            <p className="mt-1 text-sm text-gray-500">ยังไม่มีข้อมูลนักศึกษาในระบบ</p>
          </div>
        )}
      </div>
  );
};

export default StudentsList;
