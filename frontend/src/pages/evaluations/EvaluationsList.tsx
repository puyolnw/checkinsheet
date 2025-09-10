import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { evaluationsAPI } from '../../services/api';
import type { Evaluation } from '../../types';
import { useAuth } from '../../hooks/useAuth';

const EvaluationsList: React.FC = () => {
  const { user } = useAuth();
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchEvaluations();
  }, [currentPage, searchTerm]);

  const fetchEvaluations = async () => {
    try {
      setLoading(true);
      
      let response;
      
      // กรองข้อมูลตาม role ของผู้ใช้
      if (user?.role_name === 'mentor' || user?.role_name === 'supervisor') {
        // สำหรับครูพี่เลี้ยงและอาจารย์นิเทศ ให้ดูเฉพาะการประเมินที่ตนเองเป็นผู้ประเมิน
        response = await evaluationsAPI.getByEvaluator(user.id.toString(), {
          page: currentPage,
          limit: 10,
          search: searchTerm || undefined
        });
      } else if (user?.role_name === 'admin') {
        // สำหรับแอดมิน ให้ดูทั้งหมด
        response = await evaluationsAPI.getAll({
          page: currentPage,
          limit: 10,
          search: searchTerm || undefined
        });
      } else {
        // สำหรับ role อื่นๆ ให้แสดงข้อความว่าไม่มีสิทธิ์
        setError('คุณไม่มีสิทธิ์เข้าถึงหน้านี้');
        return;
      }

      if (response.success) {
        setEvaluations(response.data);
        setTotalPages(response.pagination?.totalPages || 1);
      } else {
        setError('ไม่สามารถโหลดข้อมูลการประเมินได้');
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
    fetchEvaluations();
  };


  const getScoreBadge = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
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
          <h1 className="text-2xl font-bold text-gray-900">การประเมิน</h1>
          <p className="text-gray-600">จัดการข้อมูลการประเมินนักศึกษาฝึกประสบการณ์วิชาชีพครู</p>
        </div>
        <Link
          to="/evaluations/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          สร้างการประเมินใหม่
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="ค้นหาด้วยชื่อนักศึกษา, ผู้ประเมิน..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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

      {/* Evaluations Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  นักศึกษา
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ผู้ประเมิน
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ประเภทการประเมิน
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  คะแนน
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  วันที่ประเมิน
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  การดำเนินการ
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {evaluations.map((evaluation) => (
                <tr key={evaluation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-sm font-medium">
                          {evaluation.student_name?.charAt(0) || '?'}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {evaluation.student_name || 'ไม่ระบุชื่อ'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {evaluation.student_code || 'ไม่ระบุรหัสนักศึกษา'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <div className="font-medium">
                        {evaluation.evaluator_name || 'ไม่ระบุชื่อผู้ประเมิน'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {evaluation.evaluator_role === 'mentor' ? 'ครูพี่เลี้ยง' : 
                         evaluation.evaluator_role === 'supervisor' ? 'อาจารย์นิเทศ' : 
                         evaluation.evaluator_role || 'ไม่ระบุ'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {evaluation.evaluation_type === 'weekly' ? 'รายสัปดาห์' :
                     evaluation.evaluation_type === 'midterm' ? 'กลางภาค' :
                     evaluation.evaluation_type === 'final' ? 'ปลายภาค' :
                     evaluation.evaluation_type || 'ไม่ระบุ'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {evaluation.total_score ? (
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getScoreBadge(evaluation.total_score)}`}>
                        {evaluation.total_score}/100
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {evaluation.evaluation_date ? new Date(evaluation.evaluation_date).toLocaleDateString('th-TH') : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link
                        to={`/evaluations/${evaluation.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        ดู
                      </Link>
                      <Link
                        to={`/evaluations/${evaluation.id}/edit`}
                        className="text-green-600 hover:text-green-900"
                      >
                        แก้ไข
                      </Link>
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
      {evaluations.length === 0 && !loading && (
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
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">ไม่มีข้อมูลการประเมิน</h3>
          <p className="mt-1 text-sm text-gray-500">เริ่มต้นด้วยการสร้างการประเมินใหม่</p>
          <div className="mt-6">
            <Link
              to="/evaluations/create"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              สร้างการประเมินใหม่
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default EvaluationsList;
