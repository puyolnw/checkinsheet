import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { practicumAPI } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

const PracticumCreate: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    record_date: '',
    start_time: '',
    end_time: '',
    hours_worked: '',
    activities_description: '',
    learning_outcomes: '',
    challenges_faced: '',
    reflections: '',
    status: 'draft'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateHours = () => {
    if (formData.start_time && formData.end_time) {
      const start = new Date(`2000-01-01T${formData.start_time}`);
      const end = new Date(`2000-01-01T${formData.end_time}`);
      const diffMs = end.getTime() - start.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);
      
      if (diffHours > 0) {
        setFormData(prev => ({
          ...prev,
          hours_worked: diffHours.toFixed(1)
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.record_date || !formData.start_time || !formData.end_time || !formData.activities_description) {
      setError('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน');
      return;
    }

    if (parseFloat(formData.hours_worked) <= 0) {
      setError('จำนวนชั่วโมงต้องมากกว่า 0');
      return;
    }

    try {
      setLoading(true);
      const response = await practicumAPI.create({
        student_id: user?.id,
        record_date: formData.record_date,
        start_time: formData.start_time,
        end_time: formData.end_time,
        hours_worked: parseFloat(formData.hours_worked),
        activities_description: formData.activities_description,
        learning_outcomes: formData.learning_outcomes,
        challenges_faced: formData.challenges_faced,
        reflections: formData.reflections,
        status: formData.status
      });

      if (response.success) {
        navigate('/practicum');
      } else {
        setError(response.message || 'เกิดข้อผิดพลาดในการสร้างบันทึกการฝึกปฏิบัติ');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาดในการสร้างบันทึกการฝึกปฏิบัติ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">เพิ่มบันทึกการฝึกปฏิบัติ</h1>
        <p className="text-gray-600">บันทึกกิจกรรมการฝึกประสบการณ์วิชาชีพครู</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {/* Date and Time Information */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">ข้อมูลวันที่และเวลา</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                วันที่ <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="record_date"
                value={formData.record_date}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                เวลาเริ่ม <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                name="start_time"
                value={formData.start_time}
                onChange={handleChange}
                onBlur={calculateHours}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                เวลาสิ้นสุด <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                name="end_time"
                value={formData.end_time}
                onChange={handleChange}
                onBlur={calculateHours}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                จำนวนชั่วโมง
              </label>
              <input
                type="number"
                name="hours_worked"
                value={formData.hours_worked}
                onChange={handleChange}
                step="0.1"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Activities Information */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">ข้อมูลกิจกรรม</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                รายละเอียดกิจกรรม <span className="text-red-500">*</span>
              </label>
              <textarea
                name="activities_description"
                value={formData.activities_description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="อธิบายกิจกรรมที่ทำในวันนี้..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ผลการเรียนรู้ที่ได้รับ
              </label>
              <textarea
                name="learning_outcomes"
                value={formData.learning_outcomes}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="สิ่งที่ได้เรียนรู้จากกิจกรรมนี้..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ปัญหาหรืออุปสรรคที่พบ
              </label>
              <textarea
                name="challenges_faced"
                value={formData.challenges_faced}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ปัญหาหรืออุปสรรคที่พบในการปฏิบัติงาน..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                การสะท้อนความคิด
              </label>
              <textarea
                name="reflections"
                value={formData.reflections}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ความคิดเห็นและข้อเสนอแนะ..."
              />
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">สถานะ</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              สถานะบันทึก
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="draft">ร่าง</option>
              <option value="submitted">ส่งแล้ว</option>
            </select>
            <p className="text-sm text-gray-500 mt-1">
              เลือก "ร่าง" หากยังไม่ต้องการส่ง หรือ "ส่งแล้ว" หากพร้อมให้ครูพี่เลี้ยงตรวจสอบ
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/practicum')}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'กำลังบันทึก...' : 'บันทึกการฝึกปฏิบัติ'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PracticumCreate;
