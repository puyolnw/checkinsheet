import React from 'react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';

interface GuestLayoutProps {
  children: ReactNode;
}

const ModernGuestLayout: React.FC<GuestLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">ระบบฝึกประสบการณ์</h1>
                <p className="text-xs text-gray-500">วิชาชีพครู</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  เข้าสู่ระบบ
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">
                  สมัครสมาชิก
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">ระบบฝึกประสบการณ์</h3>
                  <p className="text-sm text-gray-500">วิชาชีพครู</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                ระบบสารสนเทศสำหรับการจัดการการฝึกประสบการณ์วิชาชีพครู 
                ที่ช่วยให้นักศึกษา ครูพี่เลี้ยง และอาจารย์นิเทศสามารถทำงานร่วมกันได้อย่างมีประสิทธิภาพ
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                ระบบหลัก
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/dashboard" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                    แดชบอร์ด
                  </Link>
                </li>
                <li>
                  <Link to="/practicum" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                    บันทึกการฝึกปฏิบัติ
                  </Link>
                </li>
                <li>
                  <Link to="/evaluations" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                    การประเมิน
                  </Link>
                </li>
                <li>
                  <Link to="/reports" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                    รายงาน
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                การสนับสนุน
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/help" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                    คู่มือการใช้งาน
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                    ติดต่อเรา
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                    คำถามที่พบบ่อย
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                    นโยบายความเป็นส่วนตัว
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-gray-500">
                © 2024 ระบบฝึกประสบการณ์วิชาชีพครู. สงวนลิขสิทธิ์.
              </p>
              <div className="flex items-center space-x-6 mt-4 md:mt-0">
                <Link to="/terms" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                  เงื่อนไขการใช้งาน
                </Link>
                <Link to="/privacy" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                  นโยบายความเป็นส่วนตัว
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ModernGuestLayout;
