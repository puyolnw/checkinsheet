import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { mentorsAPI, schoolsAPI } from '../../services/api';
import type { MentorTeacher, School } from '../../types';

const MentorsList: React.FC = () => {
  const [mentors, setMentors] = useState<MentorTeacher[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [schoolFilter, setSchoolFilter] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [specialties, setSpecialties] = useState<string[]>([]);

  useEffect(() => {
    fetchMentors();
    fetchSchools();
    fetchSpecialties();
  }, [currentPage, searchTerm, schoolFilter, specialtyFilter]);

  const fetchMentors = async () => {
    try {
      setLoading(true);
      const response = await mentorsAPI.getAll({
        page: currentPage,
        limit: 10,
        search: searchTerm || undefined,
        school_id: schoolFilter || undefined,
        subject_specialty: specialtyFilter || undefined
      });

      if (response.success) {
        setMentors(response.data);
        setTotalPages(response.pagination?.totalPages || 1);
      } else {
        setError('ไม่สามารถโหลดข้อมูลครูพี่เลี้ยงได้');
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  const fetchSchools = async () => {
    try {
      const response = await schoolsAPI.getAll({ limit: 100 });
      if (response.success) {
        setSchools(response.data);
      }
    } catch (err) {
      console.error('Error fetching schools:', err);
    }
  };

  const fetchSpecialties = async () => {
    try {
      const response = await mentorsAPI.getSubjectSpecialties();
      if (response.success) {
        setSpecialties(response.data);
      }
    } catch (err) {
      console.error('Error fetching specialties:', err);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchMentors();
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
    if (window.confirm('คุณแน่ใจหรือไม่ที่จะลบครูพี่เลี้ยงคนนี้?')) {
      try {
        const response = await mentorsAPI.delete(id);
        if (response.success) {
          setError('');
          fetchMentors(); // Refresh the list
        } else {
          setError(response.message || 'ไม่สามารถลบครูพี่เลี้ยงได้');
        }
      } catch (err) {
        setError('เกิดข้อผิดพลาดในการลบครูพี่เลี้ยง');
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
            <h1 className="text-2xl font-bold text-gray-900">จัดการครูพี่เลี้ยง</h1>
            <p className="text-gray-600">จัดการข้อมูลครูพี่เลี้ยงที่เข้าร่วมโครงการฝึกประสบการณ์วิชาชีพครู</p>
          </div>
          <Link
            to="/mentors/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            เพิ่มครูพี่เลี้ยงใหม่
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <input
                type="text"
                placeholder="ค้นหาด้วยชื่อ, รหัสครู..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <select
                value={schoolFilter}
                onChange={(e) => setSchoolFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">ทุกโรงเรียน</option>
                {schools.map((school) => (
                  <option key={school.id} value={school.id}>{school.school_name}</option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={specialtyFilter}
                onChange={(e) => setSpecialtyFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">ทุกวิชา</option>
                {specialties.map((specialty) => (
                  <option key={specialty} value={specialty}>{specialty}</option>
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

        {/* Mentors Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ครูพี่เลี้ยง
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    รหัสครู
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    โรงเรียน
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    วิชาเฉพาะ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ประสบการณ์
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
                {mentors.map((mentor) => (
                  <tr key={mentor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-gray-600 text-sm font-medium">
                            {mentor.first_name?.charAt(0)}{mentor.last_name?.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {mentor.first_name} {mentor.last_name}
                          </div>
                          <div className="text-sm text-gray-500">{mentor.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {mentor.teacher_id || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {mentor.school_name || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {mentor.subject_specialty || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {mentor.teaching_experience ? `${mentor.teaching_experience} ปี` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {mentor.student_count || 0} คน
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(mentor.is_active)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link
                          to={`/mentors/${mentor.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          ดู
                        </Link>
                        <Link
                          to={`/mentors/${mentor.id}/edit`}
                          className="text-green-600 hover:text-green-900"
                        >
                          แก้ไข
                        </Link>
                        <button
                          onClick={() => handleDelete(mentor.id)}
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
        {mentors.length === 0 && !loading && (
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
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">ไม่มีข้อมูลครูพี่เลี้ยง</h3>
            <p className="mt-1 text-sm text-gray-500">เริ่มต้นด้วยการเพิ่มครูพี่เลี้ยงใหม่</p>
            <div className="mt-6">
              <Link
                to="/mentors/create"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                เพิ่มครูพี่เลี้ยงใหม่
              </Link>
            </div>
          </div>
        )}
      </div>
  );
};

export default MentorsList;
