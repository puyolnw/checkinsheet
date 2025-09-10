import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card, { CardContent, CardHeader, CardTitle } from '../../components/ui/Card';

const ModernLogin: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Attempting login with:', formData);
      const success = await login(formData);
      console.log('Login result:', success);
      
      if (success) {
        console.log('Login successful, navigating to appropriate dashboard');
        // Use setTimeout to ensure state updates are processed
        setTimeout(() => {
          // Navigate to root, which will redirect to appropriate dashboard based on role
          navigate('/');
        }, 100);
      } else {
        setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ - ตรวจสอบการเชื่อมต่อ API');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            เข้าสู่ระบบ
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            ระบบฝึกประสบการณ์วิชาชีพครู
          </p>
        </div>

        {/* Login Form */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-center text-gray-900">
              ยินดีต้อนรับ
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

              <Input
                label="ชื่อผู้ใช้"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                required
                leftIcon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                }
                placeholder="กรอกชื่อผู้ใช้"
                fullWidth
              />

              <Input
                label="รหัสผ่าน"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                leftIcon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                }
                placeholder="กรอกรหัสผ่าน"
                fullWidth
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    จดจำการเข้าสู่ระบบ
                  </label>
                </div>

                <div className="text-sm">
                  <Link
                    to="/forgot-password"
                    className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                  >
                    ลืมรหัสผ่าน?
                  </Link>
                </div>
              </div>

              <Button
                type="submit"
                loading={loading}
                fullWidth
                size="lg"
              >
                เข้าสู่ระบบ
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">หรือ</span>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  ยังไม่มีบัญชี?{' '}
                  <Link
                    to="/register"
                    className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                  >
                    สมัครสมาชิก
                  </Link>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demo Accounts */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <h3 className="text-sm font-medium text-blue-900 mb-3">
              บัญชีทดสอบ
            </h3>
            <div className="space-y-2 text-xs text-blue-800">
              <div className="flex justify-between">
                <span>แอดมิน:</span>
                <span>admin / 123456</span>
              </div>
              <div className="flex justify-between">
                <span>นักศึกษา:</span>
                <span>student001 / 123456</span>
              </div>
              <div className="flex justify-between">
                <span>ครูพี่เลี้ยง:</span>
                <span>mentor001 / 123456</span>
              </div>
              <div className="flex justify-between">
                <span>อาจารย์นิเทศ:</span>
                <span>supervisor1 / 123456</span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-blue-200">
              <button
                type="button"
                onClick={async () => {
                  try {
                    const response = await fetch('http://localhost:5000/api/auth/login', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ username: 'admin', password: '123456' })
                    });
                    const data = await response.json();
                    console.log('API Test Response:', data);
                    alert(`API Test: ${response.ok ? 'Success' : 'Failed'}\nResponse: ${JSON.stringify(data, null, 2)}`);
                  } catch (err: any) {
                    console.error('API Test Error:', err);
                    alert(`API Test Failed: ${err.message || 'Unknown error'}`);
                  }
                }}
                className="w-full text-xs bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                ทดสอบ API Connection
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ModernLogin;
