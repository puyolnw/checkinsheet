import React, { useState, useEffect } from 'react';
import { reportsAPI } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

const ReportsDashboard: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [systemOverview, setSystemOverview] = useState<any>(null);
  const [reportFilters, setReportFilters] = useState({
    startDate: '',
    endDate: '',
    studentId: '',
    schoolId: '',
    mentorId: '',
    supervisorId: ''
  });
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportData, setReportData] = useState<any>(null);

  useEffect(() => {
    if (user?.role_name === 'admin') {
      fetchSystemOverview();
    }
  }, [user]);

  const fetchSystemOverview = async () => {
    try {
      setLoading(true);
      const response = await reportsAPI.getSystemOverview();
      if (response.success) {
        setSystemOverview(response.data);
      }
    } catch (err) {
      setError('ไม่สามารถโหลดข้อมูลภาพรวมระบบได้');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setReportFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateReport = async (reportType: string) => {
    try {
      setLoading(true);
      setError('');
      
      const params = {
        ...reportFilters,
        format: 'json'
      };

      let response;
      switch (reportType) {
        case 'practicum-progress':
          response = await reportsAPI.getPracticumProgressReport(params);
          break;
        case 'evaluation-summary':
          response = await reportsAPI.getEvaluationSummaryReport(params);
          break;
        case 'student-performance':
          if (!reportFilters.studentId) {
            setError('กรุณาเลือกนักศึกษา');
            return;
          }
          response = await reportsAPI.getStudentPerformanceReport(reportFilters.studentId, params);
          break;
        default:
          setError('ประเภทรายงานไม่ถูกต้อง');
          return;
      }

      if (response.success) {
        // แสดงผลรายงานใน modal
        setReportData({
          type: reportType,
          data: response.data,
          filters: reportFilters
        });
        setShowReportModal(true);
      } else {
        setError(response.message || 'ไม่สามารถสร้างรายงานได้');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาดในการสร้างรายงาน');
    } finally {
      setLoading(false);
    }
  };

  const exportReport = async (reportType: string, format: 'pdf' | 'excel') => {
    try {
      setLoading(true);
      setError('');
      
      // สร้างข้อมูลสำหรับ export
      let exportData = '';
      let filename = '';
      
      if (reportData) {
        switch (reportType) {
          case 'practicum-progress':
            filename = `practicum-progress-${new Date().toISOString().split('T')[0]}`;
            exportData = JSON.stringify(reportData.data, null, 2);
            break;
          case 'evaluation-summary':
            filename = `evaluation-summary-${new Date().toISOString().split('T')[0]}`;
            exportData = JSON.stringify(reportData.data, null, 2);
            break;
          case 'student-performance':
            filename = `student-performance-${new Date().toISOString().split('T')[0]}`;
            exportData = JSON.stringify(reportData.data, null, 2);
            break;
        }
      } else {
        setError('ไม่มีข้อมูลสำหรับส่งออก');
        return;
      }
      
      // สร้างไฟล์และดาวน์โหลด
      const blob = new Blob([exportData], { 
        type: format === 'pdf' ? 'application/pdf' : 'application/json' 
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.${format === 'pdf' ? 'pdf' : 'json'}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
    } catch (err: any) {
      setError('เกิดข้อผิดพลาดในการส่งออกรายงาน');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !systemOverview) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">รายงานระบบ</h1>
        <p className="text-gray-600">สร้างและส่งออกรายงานต่างๆ ของระบบฝึกประสบการณ์วิชาชีพครู</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* System Overview (Admin only) */}
      {user?.role_name === 'admin' && systemOverview && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">ภาพรวมระบบ</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{systemOverview.totalStudents}</div>
              <div className="text-sm text-gray-600">นักศึกษาทั้งหมด</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{systemOverview.totalSchools}</div>
              <div className="text-sm text-gray-600">โรงเรียน</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{systemOverview.totalMentors}</div>
              <div className="text-sm text-gray-600">ครูพี่เลี้ยง</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{systemOverview.totalSupervisors}</div>
              <div className="text-sm text-gray-600">อาจารย์นิเทศ</div>
            </div>
          </div>
        </div>
      )}

      {/* Report Filters */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">ตัวกรองรายงาน</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              วันที่เริ่มต้น
            </label>
            <input
              type="date"
              name="startDate"
              value={reportFilters.startDate}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              วันที่สิ้นสุด
            </label>
            <input
              type="date"
              name="endDate"
              value={reportFilters.endDate}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              รหัสนักศึกษา
            </label>
            <input
              type="text"
              name="studentId"
              value={reportFilters.studentId}
              onChange={handleFilterChange}
              placeholder="เช่น 64010101"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Report Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Practicum Progress Report */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">รายงานความก้าวหน้าการฝึกปฏิบัติ</h3>
          <p className="text-gray-600 text-sm mb-4">
            รายงานความก้าวหน้าและกิจกรรมการฝึกประสบการณ์วิชาชีพของนักศึกษา
          </p>
          <div className="space-y-2">
            <button
              onClick={() => generateReport('practicum-progress')}
              disabled={loading}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'กำลังสร้าง...' : 'สร้างรายงาน'}
            </button>
            <div className="flex space-x-2">
              <button
                onClick={() => exportReport('practicum-progress', 'pdf')}
                disabled={loading}
                className="flex-1 bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors text-sm"
              >
                PDF
              </button>
              <button
                onClick={() => exportReport('practicum-progress', 'excel')}
                disabled={loading}
                className="flex-1 bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors text-sm"
              >
                Excel
              </button>
            </div>
          </div>
        </div>

        {/* Evaluation Summary Report */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">รายงานสรุปการประเมิน</h3>
          <p className="text-gray-600 text-sm mb-4">
            รายงานสรุปผลการประเมินการฝึกประสบการณ์วิชาชีพของนักศึกษา
          </p>
          <div className="space-y-2">
            <button
              onClick={() => generateReport('evaluation-summary')}
              disabled={loading}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'กำลังสร้าง...' : 'สร้างรายงาน'}
            </button>
            <div className="flex space-x-2">
              <button
                onClick={() => exportReport('evaluation-summary', 'pdf')}
                disabled={loading}
                className="flex-1 bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors text-sm"
              >
                PDF
              </button>
              <button
                onClick={() => exportReport('evaluation-summary', 'excel')}
                disabled={loading}
                className="flex-1 bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors text-sm"
              >
                Excel
              </button>
            </div>
          </div>
        </div>

        {/* Student Performance Report */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">รายงานผลการปฏิบัติงานนักศึกษา</h3>
          <p className="text-gray-600 text-sm mb-4">
            รายงานผลการปฏิบัติงานและพัฒนาการของนักศึกษาแต่ละคน
          </p>
          <div className="space-y-2">
            <button
              onClick={() => generateReport('student-performance')}
              disabled={loading}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'กำลังสร้าง...' : 'สร้างรายงาน'}
            </button>
            <div className="flex space-x-2">
              <button
                onClick={() => exportReport('student-performance', 'pdf')}
                disabled={loading}
                className="flex-1 bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors text-sm"
              >
                PDF
              </button>
              <button
                onClick={() => exportReport('student-performance', 'excel')}
                disabled={loading}
                className="flex-1 bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors text-sm"
              >
                Excel
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      {systemOverview && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">สถิติด่วน</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{systemOverview.activePracticumRecords}</div>
              <div className="text-sm text-gray-600">บันทึกการฝึกปฏิบัติ</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{systemOverview.completedEvaluations}</div>
              <div className="text-sm text-gray-600">การประเมินที่เสร็จสิ้น</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{systemOverview.averageRating}</div>
              <div className="text-sm text-gray-600">คะแนนเฉลี่ย</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{systemOverview.totalHours}</div>
              <div className="text-sm text-gray-600">ชั่วโมงฝึกปฏิบัติ</div>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && reportData && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  รายงาน{reportData.type === 'practicum-progress' ? 'ความก้าวหน้าการฝึกปฏิบัติ' : 
                         reportData.type === 'evaluation-summary' ? 'สรุปการประเมิน' : 
                         'ผลการปฏิบัติงานนักศึกษา'}
                </h3>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {reportData.type === 'practicum-progress' && (
                  <div>
                    <h4 className="font-semibold mb-2">ข้อมูลการฝึกปฏิบัติ</h4>
                    <div className="space-y-2">
                      {reportData.data.records?.map((record: any, index: number) => (
                        <div key={index} className="border p-3 rounded">
                          <p><strong>วันที่:</strong> {record.activity_date}</p>
                          <p><strong>กิจกรรม:</strong> {record.activity_description}</p>
                          <p><strong>ชั่วโมง:</strong> {record.duration_hours}</p>
                          <p><strong>สถานะ:</strong> {record.status}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {reportData.type === 'evaluation-summary' && (
                  <div>
                    <h4 className="font-semibold mb-2">สรุปการประเมิน</h4>
                    <div className="space-y-2">
                      {reportData.data.evaluations?.map((evaluation: any, index: number) => (
                        <div key={index} className="border p-3 rounded">
                          <p><strong>นักศึกษา:</strong> {evaluation.student_name}</p>
                          <p><strong>คะแนนรวม:</strong> {evaluation.total_score}</p>
                          <p><strong>วันที่ประเมิน:</strong> {evaluation.evaluation_date}</p>
                          <p><strong>ผู้ประเมิน:</strong> {evaluation.evaluator_name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {reportData.type === 'student-performance' && (
                  <div>
                    <h4 className="font-semibold mb-2">ผลการปฏิบัติงานนักศึกษา</h4>
                    <div className="space-y-2">
                      <p><strong>รหัสนักศึกษา:</strong> {reportData.data.student_id}</p>
                      <p><strong>ชื่อ:</strong> {reportData.data.student_name}</p>
                      <p><strong>คะแนนเฉลี่ย:</strong> {reportData.data.average_score}</p>
                      <p><strong>จำนวนการประเมิน:</strong> {reportData.data.total_evaluations}</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-3 mt-4 pt-4 border-t">
                <button
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  ปิด
                </button>
                <button
                  onClick={() => exportReport(reportData.type, 'pdf')}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                >
                  ส่งออก PDF
                </button>
                <button
                  onClick={() => exportReport(reportData.type, 'excel')}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                >
                  ส่งออก Excel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsDashboard;
