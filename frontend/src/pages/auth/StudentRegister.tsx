import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card, { CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { authAPI } from '../../services/api';

interface StudentRegistrationData {
  // User data
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  first_name: string;
  last_name: string;
  phone: string;
  
  // Student data
  student_id: string;
  major: string;
  year_level: number;
  semester: number;
  academic_year: string;
  gpa: string;
}

const StudentRegister: React.FC = () => {
  const [formData, setFormData] = useState<StudentRegistrationData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    phone: '',
    student_id: '',
    major: 'บรรณารักษ์ศึกษา-ภาษาอังกฤษ',
    year_level: 4,
    semester: 2,
    academic_year: '2567',
    gpa: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateForm = (): boolean => {
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('กรุณากรอกข้อมูลให้ครบถ้วน');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('รหัสผ่านไม่ตรงกัน');
      return false;
    }

    if (formData.password.length < 6) {
      setError('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร');
      return false;
    }

    if (!formData.first_name || !formData.last_name) {
      setError('กรุณากรอกชื่อและนามสกุล');
      return false;
    }

    if (!formData.student_id) {
      setError('กรุณากรอกรหัสนักศึกษา');
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('รูปแบบอีเมลไม่ถูกต้อง');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await authAPI.registerStudent({
        // User data
        username: formData.username,
        email: formData.email,
        password: formData.password,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
        
        // Student data
        student_id: formData.student_id,
        major: formData.major,
        year_level: formData.year_level,
        semester: formData.semester,
        academic_year: formData.academic_year,
        gpa: formData.gpa ? parseFloat(formData.gpa) : null
      });

      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(response.message || 'เกิดข้อผิดพลาดในการสมัครสมาชิก');
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <Card className="shadow-xl">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  สมัครสมาชิกสำเร็จ!
                </h2>
                <p className="text-gray-600 mb-4">
                  บัญชีของคุณถูกสร้างเรียบร้อยแล้ว กรุณาเข้าสู่ระบบ
                </p>
                <p className="text-sm text-gray-500">
                  กำลังนำคุณไปยังหน้าล็อกอิน...
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6z" />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            สมัครสมาชิก
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            สำหรับนักศึกษาที่ต้องการเข้าร่วมการฝึกประสบการณ์วิชาชีพครู
          </p>
        </div>

        {/* Registration Form */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-center text-gray-900">
              ข้อมูลส่วนตัว
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-800">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="ชื่อ"
                  name="first_name"
                  type="text"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                  placeholder="กรอกชื่อ"
                />
                <Input
                  label="นามสกุล"
                  name="last_name"
                  type="text"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                  placeholder="กรอกนามสกุล"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="ชื่อผู้ใช้"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  placeholder="กรอกชื่อผู้ใช้"
                />
                <Input
                  label="อีเมล"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="กรอกอีเมล"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="รหัสผ่าน"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="กรอกรหัสผ่าน (อย่างน้อย 6 ตัวอักษร)"
                />
                <Input
                  label="ยืนยันรหัสผ่าน"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="กรอกรหัสผ่านอีกครั้ง"
                />
              </div>

              <Input
                label="เบอร์โทรศัพท์"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="กรอกเบอร์โทรศัพท์"
              />

              {/* Student Information */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">ข้อมูลนักศึกษา</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="รหัสนักศึกษา"
                    name="student_id"
                    type="text"
                    value={formData.student_id}
                    onChange={handleChange}
                    required
                    placeholder="กรอกรหัสนักศึกษา"
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      สาขาวิชา
                    </label>
                    <select
                      name="major"
                      value={formData.major}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="บรรณารักษ์ศึกษา-ภาษาอังกฤษ">บรรณารักษ์ศึกษา-ภาษาอังกฤษ</option>
                      <option value="คณิตศาสตร์">คณิตศาสตร์</option>
                      <option value="วิทยาศาสตร์">วิทยาศาสตร์</option>
                      <option value="สังคมศึกษา">สังคมศึกษา</option>
                      <option value="ภาษาไทย">ภาษาไทย</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ชั้นปี
                    </label>
                    <select
                      name="year_level"
                      value={formData.year_level}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value={1}>ปี 1</option>
                      <option value={2}>ปี 2</option>
                      <option value={3}>ปี 3</option>
                      <option value={4}>ปี 4</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ภาคเรียน
                    </label>
                    <select
                      name="semester"
                      value={formData.semester}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value={1}>ภาคเรียนที่ 1</option>
                      <option value={2}>ภาคเรียนที่ 2</option>
                    </select>
                  </div>
                  <Input
                    label="ปีการศึกษา"
                    name="academic_year"
                    type="text"
                    value={formData.academic_year}
                    onChange={handleChange}
                    required
                    placeholder="เช่น 2567"
                  />
                </div>

                <Input
                  label="เกรดเฉลี่ย (GPA)"
                  name="gpa"
                  type="number"
                  step="0.01"
                  min="0"
                  max="4"
                  value={formData.gpa}
                  onChange={handleChange}
                  placeholder="เช่น 3.25 (ไม่บังคับ)"
                />
              </div>

              <Button
                type="submit"
                loading={loading}
                fullWidth
                size="lg"
              >
                สมัครสมาชิก
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                มีบัญชีแล้ว?{' '}
                <Link
                  to="/login"
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                >
                  เข้าสู่ระบบ
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentRegister;
