import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supervisorsAPI } from '../../services/api';
import type { Supervisor } from '../../types';

const SupervisorsList: React.FC = () => {
  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [rankFilter, setRankFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [departments, setDepartments] = useState<string[]>([]);
  const [ranks, setRanks] = useState<string[]>([]);

  useEffect(() => {
    fetchSupervisors();
    fetchFilters();
  }, [currentPage, searchTerm, departmentFilter, rankFilter]);

  const fetchSupervisors = async () => {
    try {
      setLoading(true);
      const response = await supervisorsAPI.getAll({
        page: currentPage,
        limit: 10,
        search: searchTerm || undefined,
        department: departmentFilter || undefined,
        academic_rank: rankFilter || undefined
      });

      if (response.success) {
        setSupervisors(response.data);
        setTotalPages(response.pagination?.totalPages || 1);
      } else {
        setError('ไม่สามารถโหลดข้อมูลอาจารย์นิเทศได้');
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  const fetchFilters = async () => {
    try {
      const [departmentsResponse, ranksResponse] = await Promise.all([
        supervisorsAPI.getDepartments(),
        supervisorsAPI.getAcademicRanks()
      ]);

      if (departmentsResponse.success) {
        setDepartments(departmentsResponse.data);
      }
      if (ranksResponse.success) {
        setRanks(ranksResponse.data);
      }
    } catch (err) {
      console.error('Error fetching filters:', err);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchSupervisors();
  };

  const getStatusBadge = (isActive: boolean) => {
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
        isActive 
          ? 'bg-green-100 text-green-800' 
          : 'bg-red-100 text-red-800'
      }`}>
        {isActive ? 'ใช้งาน' : 'ไม่ใช้งาน'}
      </span>
    );
  };


  const handleDelete = async (id: number) => {
    if (window.confirm('คุณแน่ใจหรือไม่ที่จะลบอาจารย์นิเทศคนนี้?')) {
      try {
        const response = await supervisorsAPI.delete(id);
        if (response.success) {
          setError('');
          fetchSupervisors(); // Refresh the list
        } else {
          setError(response.message || 'ไม่สามารถลบอาจารย์นิเทศได้');
        }
      } catch (err) {
        setError('เกิดข้อผิดพลาดในการลบอาจารย์นิเทศ');
      }
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">จัดการอาจารย์นิเทศ</h1>
            <p className="text-gray-600">จัดการข้อมูลอาจารย์นิเทศที่รับผิดชอบดูแลนักศึกษาฝึกประสบการณ์วิชาชีพครู</p>
          </div>
          <Link
            to="/supervisors/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            เพิ่มอาจารย์นิเทศใหม่
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <input
                type="text"
                placeholder="ค้นหาด้วยชื่อ, รหัสพนักงาน..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">ทุกคณะ</option>
                {departments.map((department) => (
                  <option key={department} value={department}>{department}</option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={rankFilter}
                onChange={(e) => setRankFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">ทุกระดับ</option>
                {ranks.map((rank) => (
                  <option key={rank} value={rank}>{rank}</option>
                ))}
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

        {/* Supervisors Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    อาจารย์นิเทศ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    รหัสพนักงาน
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    คณะ/หน่วยงาน
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ระดับ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    วิชาเฉพาะ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    นักศึกษา
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
                {supervisors.map((supervisor) => (
                  <tr key={supervisor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-gray-600 text-sm font-medium">
                            {supervisor.first_name?.charAt(0)}{supervisor.last_name?.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {supervisor.first_name} {supervisor.last_name}
                          </div>
                          <div className="text-sm text-gray-500">{supervisor.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {supervisor.employee_id || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div>{supervisor.department}</div>
                        <div className="text-gray-500 text-xs">{supervisor.faculty}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {supervisor.academic_rank || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {supervisor.subject_specialty || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {supervisor.student_count || 0} คน
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(supervisor.is_active)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link
                          to={`/supervisors/${supervisor.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          ดู
                        </Link>
                        <Link
                          to={`/supervisors/${supervisor.id}/edit`}
                          className="text-green-600 hover:text-green-900"
                        >
                          แก้ไข
                        </Link>
                        <button
                          onClick={() => handleDelete(supervisor.id)}
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
        {supervisors.length === 0 && !loading && (
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
            <h3 className="mt-2 text-sm font-medium text-gray-900">ไม่มีข้อมูลอาจารย์นิเทศ</h3>
            <p className="mt-1 text-sm text-gray-500">เริ่มต้นด้วยการเพิ่มอาจารย์นิเทศใหม่</p>
            <div className="mt-6">
              <Link
                to="/supervisors/create"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                เพิ่มอาจารย์นิเทศใหม่
              </Link>
            </div>
          </div>
        )}
      </div>
  );
};

export default SupervisorsList;
