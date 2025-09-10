import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { evaluationsAPI, studentsAPI } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import type { Student } from '../../types';

const EvaluationEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [error, setError] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [formData, setFormData] = useState({
    student_id: '',
    evaluator_id: user?.id || '',
    evaluator_type: user?.role_name === 'mentor' ? 'mentor' : user?.role_name === 'supervisor' ? 'supervisor' : 'admin',
    evaluation_type: 'formative',
    evaluation_date: new Date().toISOString().split('T')[0],
    teaching_skills: '',
    classroom_management: '',
    lesson_planning: '',
    student_interaction: '',
    professional_conduct: '',
    overall_rating: '',
    strengths: '',
    areas_for_improvement: '',
    recommendations: '',
    comments: '',
    status: 'draft'
  });

  useEffect(() => {
    if (id) {
      fetchEvaluation();
    }
    fetchStudents();
  }, [id]);

  const fetchEvaluation = async () => {
    try {
      setLoadingData(true);
      const response = await evaluationsAPI.getById(id!);
      
      if (response.success) {
        const evaluation = response.data;
        setFormData({
          student_id: evaluation.student_id?.toString() || '',
          evaluator_id: evaluation.evaluator_id?.toString() || '',
          evaluator_type: evaluation.evaluator_type || '',
          evaluation_type: evaluation.evaluation_type || 'formative',
          evaluation_date: evaluation.evaluation_date || '',
          teaching_skills: evaluation.teaching_skills?.toString() || '',
          classroom_management: evaluation.classroom_management?.toString() || '',
          lesson_planning: evaluation.lesson_planning?.toString() || '',
          student_interaction: evaluation.student_interaction?.toString() || '',
          professional_conduct: evaluation.professional_conduct?.toString() || '',
          overall_rating: evaluation.overall_rating?.toString() || '',
          strengths: evaluation.strengths || '',
          areas_for_improvement: evaluation.areas_for_improvement || '',
          recommendations: evaluation.recommendations || '',
          comments: evaluation.comments || '',
          status: evaluation.status || 'draft'
        });
      } else {
        setError('ไม่พบข้อมูลการประเมิน');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setLoadingData(false);
    }
  };

  const fetchStudents = async () => {
    try {
      setLoadingStudents(true);
      const response = await studentsAPI.getAll({ limit: 100 });
      if (response.success) {
        setStudents(response.data);
      }
    } catch (err) {
      console.error('Error fetching students:', err);
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.student_id || !formData.evaluation_date || !formData.overall_rating) {
      setError('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน');
      return;
    }

    try {
      setLoading(true);
      const response = await evaluationsAPI.update(id!, {
        student_id: parseInt(formData.student_id),
        evaluator_id: formData.evaluator_id,
        evaluator_type: formData.evaluator_type,
        evaluation_type: formData.evaluation_type,
        evaluation_date: formData.evaluation_date,
        teaching_skills: formData.teaching_skills ? parseInt(formData.teaching_skills) : null,
        classroom_management: formData.classroom_management ? parseInt(formData.classroom_management) : null,
        lesson_planning: formData.lesson_planning ? parseInt(formData.lesson_planning) : null,
        student_interaction: formData.student_interaction ? parseInt(formData.student_interaction) : null,
        professional_conduct: formData.professional_conduct ? parseInt(formData.professional_conduct) : null,
        overall_rating: parseInt(formData.overall_rating),
        strengths: formData.strengths,
        areas_for_improvement: formData.areas_for_improvement,
        recommendations: formData.recommendations,
        comments: formData.comments,
        status: formData.status
      });

      if (response.success) {
        navigate('/evaluations');
      } else {
        setError(response.message || 'เกิดข้อผิดพลาดในการอัปเดตการประเมิน');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาดในการอัปเดตการประเมิน');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData || loadingStudents) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">แก้ไขการประเมิน</h1>
        <p className="text-gray-600">แก้ไขข้อมูลการประเมินผลการฝึกประสบการณ์วิชาชีพครู</p>
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
                นักศึกษา <span className="text-red-500">*</span>
              </label>
              <select
                name="student_id"
                value={formData.student_id}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">เลือกนักศึกษา</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.student_id} - {student.first_name} {student.last_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ประเภทการประเมิน
              </label>
              <select
                name="evaluation_type"
                value={formData.evaluation_type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="formative">ประเมินระหว่างเรียน</option>
                <option value="summative">ประเมินสรุป</option>
                <option value="midterm">ประเมินกลางภาค</option>
                <option value="final">ประเมินปลายภาค</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                วันที่ประเมิน <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="evaluation_date"
                value={formData.evaluation_date}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Rating Scores */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">คะแนนการประเมิน (1-5)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ทักษะการสอน
              </label>
              <select
                name="teaching_skills"
                value={formData.teaching_skills}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">เลือกคะแนน</option>
                <option value="1">1 - ต้องปรับปรุง</option>
                <option value="2">2 - พอใช้</option>
                <option value="3">3 - ดี</option>
                <option value="4">4 - ดีมาก</option>
                <option value="5">5 - ดีเยี่ยม</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                การจัดการชั้นเรียน
              </label>
              <select
                name="classroom_management"
                value={formData.classroom_management}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">เลือกคะแนน</option>
                <option value="1">1 - ต้องปรับปรุง</option>
                <option value="2">2 - พอใช้</option>
                <option value="3">3 - ดี</option>
                <option value="4">4 - ดีมาก</option>
                <option value="5">5 - ดีเยี่ยม</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                การวางแผนการสอน
              </label>
              <select
                name="lesson_planning"
                value={formData.lesson_planning}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">เลือกคะแนน</option>
                <option value="1">1 - ต้องปรับปรุง</option>
                <option value="2">2 - พอใช้</option>
                <option value="3">3 - ดี</option>
                <option value="4">4 - ดีมาก</option>
                <option value="5">5 - ดีเยี่ยม</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                การปฏิสัมพันธ์กับนักเรียน
              </label>
              <select
                name="student_interaction"
                value={formData.student_interaction}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">เลือกคะแนน</option>
                <option value="1">1 - ต้องปรับปรุง</option>
                <option value="2">2 - พอใช้</option>
                <option value="3">3 - ดี</option>
                <option value="4">4 - ดีมาก</option>
                <option value="5">5 - ดีเยี่ยม</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                จรรยาบรรณวิชาชีพ
              </label>
              <select
                name="professional_conduct"
                value={formData.professional_conduct}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">เลือกคะแนน</option>
                <option value="1">1 - ต้องปรับปรุง</option>
                <option value="2">2 - พอใช้</option>
                <option value="3">3 - ดี</option>
                <option value="4">4 - ดีมาก</option>
                <option value="5">5 - ดีเยี่ยม</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                คะแนนรวม <span className="text-red-500">*</span>
              </label>
              <select
                name="overall_rating"
                value={formData.overall_rating}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">เลือกคะแนนรวม</option>
                <option value="1">1 - ต้องปรับปรุง</option>
                <option value="2">2 - พอใช้</option>
                <option value="3">3 - ดี</option>
                <option value="4">4 - ดีมาก</option>
                <option value="5">5 - ดีเยี่ยม</option>
              </select>
            </div>
          </div>
        </div>

        {/* Comments */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">ความคิดเห็นและข้อเสนอแนะ</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                จุดเด่น
              </label>
              <textarea
                name="strengths"
                value={formData.strengths}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="จุดเด่นของนักศึกษา..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                จุดที่ควรปรับปรุง
              </label>
              <textarea
                name="areas_for_improvement"
                value={formData.areas_for_improvement}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="จุดที่ควรปรับปรุง..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ข้อเสนอแนะ
              </label>
              <textarea
                name="recommendations"
                value={formData.recommendations}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ข้อเสนอแนะสำหรับการพัฒนาต่อไป..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ความคิดเห็นเพิ่มเติม
              </label>
              <textarea
                name="comments"
                value={formData.comments}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ความคิดเห็นเพิ่มเติม..."
              />
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">สถานะ</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              สถานะการประเมิน
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
              เลือก "ร่าง" หากยังไม่ต้องการส่ง หรือ "ส่งแล้ว" หากพร้อมส่งการประเมิน
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/evaluations')}
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

export default EvaluationEdit;
