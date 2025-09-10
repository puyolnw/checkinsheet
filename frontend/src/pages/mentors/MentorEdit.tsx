import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { mentorsAPI, schoolsAPI } from '../../services/api';
import type { School } from '../../types';

const MentorEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [loadingSchools, setLoadingSchools] = useState(true);
  const [error, setError] = useState('');
  const [schools, setSchools] = useState<School[]>([]);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    teacher_id: '',
    school_id: '',
    subject_specialty: '',
    teaching_experience: '',
    education_level: '',
    is_active: true
  });

  useEffect(() => {
    if (id) {
      fetchMentor();
    }
    fetchSchools();
  }, [id]);

  const fetchMentor = async () => {
    try {
      setLoadingData(true);
      const response = await mentorsAPI.getById(id!);
      
      if (response.success) {
        const mentor = response.data;
        setFormData({
          first_name: mentor.first_name || '',
          last_name: mentor.last_name || '',
          email: mentor.email || '',
          phone: mentor.phone || '',
          teacher_id: mentor.teacher_id || '',
          school_id: mentor.school_id?.toString() || '',
          subject_specialty: mentor.subject_specialty || '',
          teaching_experience: mentor.teaching_experience?.toString() || '',
          education_level: mentor.education_level || '',
          is_active: mentor.is_active !== false
        });
      } else {
        setError('ไม่พบข้อมูลครูพี่เลี้ยง');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setLoadingData(false);
    }
  };

  const fetchSchools = async () => {
    try {
      setLoadingSchools(true);
      const response = await schoolsAPI.getAll({ limit: 100 });
      if (response.success) {
        setSchools(response.data);
      }
    } catch (err) {
      console.error('Error fetching schools:', err);
    } finally {
      setLoadingSchools(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.first_name || !formData.last_name || !formData.email || !formData.teacher_id || !formData.school_id) {
      setError('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน');
      return;
    }

    try {
      setLoading(true);
      const response = await mentorsAPI.update(id!, {
        ...formData,
        school_id: parseInt(formData.school_id),
        teaching_experience: formData.teaching_experience ? parseInt(formData.teaching_experience) : null
      });

      if (response.success) {
        navigate('/mentors');
      } else {
        setError(response.message || 'เกิดข้อผิดพลาดในการอัปเดตครูพี่เลี้ยง');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาดในการอัปเดตครูพี่เลี้ยง');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData || loadingSchools) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">แก้ไขข้อมูลครูพี่เลี้ยง</h1>
        <p className="text-gray-600">แก้ไขข้อมูลครูพี่เลี้ยง</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {/* Basic Information */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">ข้อมูลพื้นฐาน</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ชื่อ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                นามสกุล <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                อีเมล <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
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
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Professional Information */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">ข้อมูลวิชาชีพ</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                รหัสครู <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="teacher_id"
                value={formData.teacher_id}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                โรงเรียน <span className="text-red-500">*</span>
              </label>
              <select
                name="school_id"
                value={formData.school_id}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">เลือกโรงเรียน</option>
                {schools.map((school) => (
                  <option key={school.id} value={school.id}>
                    {school.school_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                วิชาเฉพาะ
              </label>
              <input
                type="text"
                name="subject_specialty"
                value={formData.subject_specialty}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ประสบการณ์การสอน (ปี)
              </label>
              <input
                type="number"
                name="teaching_experience"
                value={formData.teaching_experience}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ระดับการศึกษา
              </label>
              <select
                name="education_level"
                value={formData.education_level}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">เลือกระดับการศึกษา</option>
                <option value="ปริญญาเอก">ปริญญาเอก</option>
                <option value="ปริญญาโท">ปริญญาโท</option>
                <option value="ปริญญาตรี">ปริญญาตรี</option>
                <option value="ประกาศนียบัตร">ประกาศนียบัตร</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">ใช้งาน</span>
              </label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/mentors')}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MentorEdit;
