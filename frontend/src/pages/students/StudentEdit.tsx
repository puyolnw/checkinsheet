import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { studentsAPI } from '../../services/api';
import type { Student } from '../../types';

const StudentEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [student, setStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState({
    // User data
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    
    // Student data
    student_id: '',
    major: '',
    year_level: 4,
    semester: 2,
    academic_year: '',
    gpa: '',
    status: 'registered'
  });

  useEffect(() => {
    if (id) {
      fetchStudent();
    }
  }, [id]);

  const fetchStudent = async () => {
    try {
      setLoading(true);
      const response = await studentsAPI.getById(parseInt(id!));
      
      if (response.success && response.data) {
        const studentData = response.data;
        setStudent(studentData);
        setFormData({
          username: studentData.username || '',
          email: studentData.email || '',
          first_name: studentData.first_name || '',
          last_name: studentData.last_name || '',
          phone: studentData.phone || '',
          student_id: studentData.student_id || '',
          major: studentData.major || '',
          year_level: studentData.year_level || 4,
          semester: studentData.semester || 2,
          academic_year: studentData.academic_year || '',
          gpa: studentData.gpa?.toString() || '',
          status: studentData.status || 'registered'
        });
      } else {
        setError('ไม่พบข้อมูลนักศึกษา');
      }
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const response = await studentsAPI.update(parseInt(id!), {
        username: formData.username,
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
        student_id: formData.student_id,
        major: formData.major,
        year_level: parseInt(formData.year_level.toString()),
        semester: parseInt(formData.semester.toString()),
        academic_year: formData.academic_year,
        gpa: formData.gpa ? parseFloat(formData.gpa) : null,
        status: formData.status
      });

      if (response.success) {
        navigate('/students');
      } else {
        setError(response.message || 'เกิดข้อผิดพลาดในการอัปเดตนักศึกษา');
      }
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการอัปเดตนักศึกษา');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">ไม่พบข้อมูลนักศึกษา</h3>
        <button
          onClick={() => navigate('/students')}
          className="mt-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          กลับไปรายการนักศึกษา
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900">แก้ไขข้อมูลนักศึกษา</h1>
          <p className="text-sm text-gray-600 mt-1">รหัสนักศึกษา: {student.student_id}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          {/* User Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">ข้อมูลผู้ใช้</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ชื่อผู้ใช้ *
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  อีเมล *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ชื่อ *
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  นามสกุล *
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  เบอร์โทรศัพท์
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Student Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">ข้อมูลนักศึกษา</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  รหัสนักศึกษา *
                </label>
                <input
                  type="text"
                  name="student_id"
                  value={formData.student_id}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  สาขาวิชา *
                </label>
                <select
                  name="major"
                  value={formData.major}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="บรรณารักษ์ศึกษา-ภาษาอังกฤษ">บรรณารักษ์ศึกษา-ภาษาอังกฤษ</option>
                  <option value="คณิตศาสตร์">คณิตศาสตร์</option>
                  <option value="วิทยาศาสตร์">วิทยาศาสตร์</option>
                  <option value="ภาษาไทย">ภาษาไทย</option>
                  <option value="สังคมศึกษา">สังคมศึกษา</option>
                  <option value="ภาษาอังกฤษ">ภาษาอังกฤษ</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ชั้นปี *
                </label>
                <select
                  name="year_level"
                  value={formData.year_level}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ภาคเรียน *
                </label>
                <select
                  name="semester"
                  value={formData.semester}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ปีการศึกษา *
                </label>
                <input
                  type="text"
                  name="academic_year"
                  value={formData.academic_year}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  GPA
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="4"
                  name="gpa"
                  value={formData.gpa}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  สถานะ *
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="registered">ลงทะเบียนแล้ว</option>
                  <option value="assigned">ได้รับมอบหมาย</option>
                  <option value="in_progress">กำลังฝึกปฏิบัติ</option>
                  <option value="completed">เสร็จสิ้น</option>
                  <option value="failed">ไม่ผ่าน</option>
                </select>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/students')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {saving ? 'กำลังบันทึก...' : 'บันทึก'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentEdit;
