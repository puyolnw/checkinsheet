import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { schoolsAPI } from '../../services/api';

const SchoolEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    school_name: '',
    school_type: '',
    address: '',
    district: '',
    province: '',
    postal_code: '',
    phone: '',
    email: '',
    director_name: '',
    director_phone: '',
    is_active: true
  });

  useEffect(() => {
    if (id) {
      fetchSchool();
    }
  }, [id]);

  const fetchSchool = async () => {
    try {
      setLoadingData(true);
      const response = await schoolsAPI.getById(parseInt(id!));
      
      if (response.success) {
        const school = response.data;
        setFormData({
          school_name: school.school_name || '',
          school_type: school.school_type || '',
          address: school.address || '',
          district: school.district || '',
          province: school.province || '',
          postal_code: school.postal_code || '',
          phone: school.phone || '',
          email: school.email || '',
          director_name: school.director_name || '',
          director_phone: school.director_phone || '',
          is_active: school.is_active !== false
        });
      } else {
        setError('ไม่พบข้อมูลโรงเรียน');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setLoadingData(false);
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

    if (!formData.school_name || !formData.school_type) {
      setError('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน');
      return;
    }

    try {
      setLoading(true);
      const response = await schoolsAPI.update(parseInt(id!), formData);

      if (response.success) {
        navigate('/schools');
      } else {
        setError(response.message || 'เกิดข้อผิดพลาดในการอัปเดตโรงเรียน');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาดในการอัปเดตโรงเรียน');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">แก้ไขข้อมูลโรงเรียน</h1>
        <p className="text-gray-600">แก้ไขข้อมูลโรงเรียน</p>
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
                ชื่อโรงเรียน <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="school_name"
                value={formData.school_name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ประเภทโรงเรียน <span className="text-red-500">*</span>
              </label>
              <select
                name="school_type"
                value={formData.school_type}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">เลือกประเภทโรงเรียน</option>
                <option value="โรงเรียนประถมศึกษา">โรงเรียนประถมศึกษา</option>
                <option value="โรงเรียนมัธยมศึกษา">โรงเรียนมัธยมศึกษา</option>
                <option value="โรงเรียนขยายโอกาส">โรงเรียนขยายโอกาส</option>
                <option value="โรงเรียนเอกชน">โรงเรียนเอกชน</option>
                <option value="โรงเรียนนานาชาติ">โรงเรียนนานาชาติ</option>
              </select>
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                อีเมล
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">ข้อมูลที่อยู่</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ที่อยู่
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ที่อยู่ของโรงเรียน..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ตำบล/แขวง
              </label>
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                จังหวัด
              </label>
              <input
                type="text"
                name="province"
                value={formData.province}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                รหัสไปรษณีย์
              </label>
              <input
                type="text"
                name="postal_code"
                value={formData.postal_code}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Director Information */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">ข้อมูลผู้อำนวยการ</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ชื่อผู้อำนวยการ
              </label>
              <input
                type="text"
                name="director_name"
                value={formData.director_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                เบอร์โทรศัพท์ผู้อำนวยการ
              </label>
              <input
                type="tel"
                name="director_phone"
                value={formData.director_phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
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
            onClick={() => navigate('/schools')}
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

export default SchoolEdit;
