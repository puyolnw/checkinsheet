import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { practicumAPI } from '../../services/api';
import type { PracticumRecord } from '../../types';
import { useAuth } from '../../hooks/useAuth';

const PracticumRecords: React.FC = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState<PracticumRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    fetchRecords();
    fetchSummary();
  }, [currentPage]);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      // สำหรับ student ให้ใช้ user ID (backend จะจัดการหา student ID เอง)
      const response = await practicumAPI.getAll({
        page: currentPage,
        limit: 10,
        student_id: user?.id // For students, filter by their own records
      });

      if (response.success) {
        setRecords(response.data);
        setTotalPages(response.pagination?.totalPages || 1);
      } else {
        setError('ไม่สามารถโหลดข้อมูลบันทึกการฝึกปฏิบัติได้');
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      if (user?.id) {
        // ส่ง user ID ไป backend จะจัดการหา student ID เอง
        const response = await practicumAPI.getStudentPracticumSummary(user.id.toString());
        console.log('Summary response:', response);
        if (response.success) {
          console.log('Summary data:', response.data);
          setSummary(response.data);
        }
      }
    } catch (err) {
      console.error('Error fetching summary:', err);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { color: 'bg-gray-100 text-gray-800', text: 'ร่าง' },
      submitted: { color: 'bg-blue-100 text-blue-800', text: 'ส่งแล้ว' },
      approved: { color: 'bg-green-100 text-green-800', text: 'อนุมัติแล้ว' },
      rejected: { color: 'bg-red-100 text-red-800', text: 'ปฏิเสธ' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('th-TH', {
      hour: '2-digit',
      minute: '2-digit'
    });
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
            <h1 className="text-2xl font-bold text-gray-900">บันทึกการฝึกปฏิบัติ</h1>
            <p className="text-gray-600">บันทึกกิจกรรมและความก้าวหน้าการฝึกประสบการณ์วิชาชีพครู</p>
          </div>
          <Link
            to="/practicum/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            เพิ่มบันทึกใหม่
          </Link>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">ชั่วโมงที่ฝึกแล้ว</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {summary.practicum_hours_completed || 0}
                  </p>
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
                  <p className="text-sm font-medium text-gray-600">บันทึกที่อนุมัติ</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {summary.approved_records || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">รอการอนุมัติ</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {summary.pending_records || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">บันทึกทั้งหมด</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {summary.total_records || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        {summary && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">ความก้าวหน้าการฝึกปฏิบัติ</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>ชั่วโมงที่ฝึกแล้ว</span>
                  <span>{summary.practicum_hours_completed || 0} / {summary.practicum_hours_required || 50} ชั่วโมง</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(
                        ((summary.practicum_hours_completed || 0) / (summary.practicum_hours_required || 50)) * 100,
                        100
                      )}%`
                    }}
                  ></div>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                เป้าหมาย: {summary.practicum_hours_required || 50} ชั่วโมง
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {/* Records Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    วันที่
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    เวลา
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ชั่วโมง
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    กิจกรรม
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
                {records.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(record.record_date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatTime(record.start_time)} - {formatTime(record.end_time)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.hours_worked} ชม.
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="max-w-xs truncate">
                        {record.activities_description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(record.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link
                          to={`/practicum/${record.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          ดู
                        </Link>
                        {record.status === 'draft' && (
                          <Link
                            to={`/practicum/${record.id}/edit`}
                            className="text-green-600 hover:text-green-900"
                          >
                            แก้ไข
                          </Link>
                        )}
                        {record.status === 'draft' && (
                          <button
                            onClick={() => {
                              // Handle submit logic
                              console.log('Submit record:', record.id);
                            }}
                            className="text-purple-600 hover:text-purple-900"
                          >
                            ส่ง
                          </button>
                        )}
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
        {records.length === 0 && !loading && (
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
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">ไม่มีบันทึกการฝึกปฏิบัติ</h3>
            <p className="mt-1 text-sm text-gray-500">เริ่มต้นด้วยการเพิ่มบันทึกการฝึกปฏิบัติใหม่</p>
            <div className="mt-6">
              <Link
                to="/practicum/create"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                เพิ่มบันทึกใหม่
              </Link>
            </div>
          </div>
        )}
      </div>
  );
};

export default PracticumRecords;
