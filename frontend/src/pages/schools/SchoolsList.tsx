import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { schoolsAPI } from '../../services/api';
import type { School } from '../../types';

const SchoolsList: React.FC = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [schoolTypeFilter, setSchoolTypeFilter] = useState('');
  const [provinceFilter, setProvinceFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [provinces, setProvinces] = useState<string[]>([]);
  const [schoolTypes, setSchoolTypes] = useState<string[]>([]);

  useEffect(() => {
    fetchSchools();
    fetchFilters();
  }, [currentPage, searchTerm, schoolTypeFilter, provinceFilter]);

  const fetchSchools = async () => {
    try {
      setLoading(true);
      const response = await schoolsAPI.getAll({
        page: currentPage,
        limit: 10,
        search: searchTerm || undefined,
        school_type: schoolTypeFilter || undefined,
        province: provinceFilter || undefined
      });

      if (response.success) {
        setSchools(response.data);
        setTotalPages(response.pagination?.totalPages || 1);
      } else {
        setError('ไม่สามารถโหลดข้อมูลโรงเรียนได้');
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  const fetchFilters = async () => {
    try {
      const [provincesResponse, typesResponse] = await Promise.all([
        schoolsAPI.getProvinces(),
        schoolsAPI.getSchoolTypes()
      ]);

      if (provincesResponse.success) {
        setProvinces(provincesResponse.data);
      }
      if (typesResponse.success) {
        setSchoolTypes(typesResponse.data);
      }
    } catch (err) {
      console.error('Error fetching filters:', err);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchSchools();
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
    if (window.confirm('คุณแน่ใจหรือไม่ที่จะลบโรงเรียนนี้?')) {
      try {
        const response = await schoolsAPI.delete(id);
        if (response.success) {
          setError('');
          fetchSchools(); // Refresh the list
        } else {
          setError(response.message || 'ไม่สามารถลบโรงเรียนได้');
        }
      } catch (err) {
        setError('เกิดข้อผิดพลาดในการลบโรงเรียน');
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
            <h1 className="text-2xl font-bold text-gray-900">จัดการโรงเรียน</h1>
            <p className="text-gray-600">จัดการข้อมูลโรงเรียนที่เข้าร่วมโครงการฝึกประสบการณ์วิชาชีพครู</p>
          </div>
          <Link
            to="/schools/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            เพิ่มโรงเรียนใหม่
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <input
                type="text"
                placeholder="ค้นหาด้วยชื่อโรงเรียน, ผู้อำนวยการ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <select
                value={schoolTypeFilter}
                onChange={(e) => setSchoolTypeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">ทุกประเภท</option>
                {schoolTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={provinceFilter}
                onChange={(e) => setProvinceFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">ทุกจังหวัด</option>
                {provinces.map((province) => (
                  <option key={province} value={province}>{province}</option>
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

        {/* Schools Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    โรงเรียน
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ประเภท
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ที่อยู่
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ผู้อำนวยการ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    สถิติ
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
                {schools.map((school) => (
                  <tr key={school.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {school.school_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {school.phone && `โทร: ${school.phone}`}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {school.school_type || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="max-w-xs">
                        {school.address && (
                          <div>{school.address}</div>
                        )}
                        {school.district && school.province && (
                          <div className="text-gray-500">
                            {school.district}, {school.province} {school.postal_code}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {school.director_name || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="space-y-1">
                        <div>นักศึกษา: {school.student_count || 0} คน</div>
                        <div>ครูพี่เลี้ยง: {school.mentor_count || 0} คน</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(school.is_active)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link
                          to={`/schools/${school.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          ดู
                        </Link>
                        <Link
                          to={`/schools/${school.id}/edit`}
                          className="text-green-600 hover:text-green-900"
                        >
                          แก้ไข
                        </Link>
                        <button
                          onClick={() => handleDelete(school.id)}
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
        {schools.length === 0 && !loading && (
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
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">ไม่มีข้อมูลโรงเรียน</h3>
            <p className="mt-1 text-sm text-gray-500">เริ่มต้นด้วยการเพิ่มโรงเรียนใหม่</p>
            <div className="mt-6">
              <Link
                to="/schools/create"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                เพิ่มโรงเรียนใหม่
              </Link>
            </div>
          </div>
        )}
      </div>
  );
};

export default SchoolsList;
