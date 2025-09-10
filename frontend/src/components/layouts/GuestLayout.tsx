import React from 'react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface GuestLayoutProps {
  children: ReactNode;
}

const GuestLayout: React.FC<GuestLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Brand */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">SP</span>
                </div>
                <span className="text-xl font-semibold text-gray-900">
                  ระบบสารสนเทศนักศึกษาฝึกประสบการณ์วิชาชีพครู
                </span>
              </Link>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                หน้าแรก
              </Link>
              <Link
                to="/about"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                เกี่ยวกับระบบ
              </Link>
              <Link
                to="/contact"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                ติดต่อเรา
              </Link>
            </div>

            {/* Login Button */}
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                เข้าสู่ระบบ
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                type="button"
                className="text-gray-600 hover:text-gray-900 focus:outline-none focus:text-gray-900"
                aria-label="Open menu"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            <Link
              to="/"
              className="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
            >
              หน้าแรก
            </Link>
            <Link
              to="/about"
              className="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
            >
              เกี่ยวกับระบบ
            </Link>
            <Link
              to="/contact"
              className="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
            >
              ติดต่อเรา
            </Link>
            <Link
              to="/login"
              className="bg-blue-600 text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700"
            >
              เข้าสู่ระบบ
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* System Info */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                ระบบสารสนเทศนักศึกษาฝึกประสบการณ์วิชาชีพครู
              </h3>
              <p className="text-gray-600 text-sm">
                ระบบจัดการการฝึกประสบการณ์วิชาชีพครูสำหรับนักศึกษา
                สาขาบรรณารักษ์ศึกษา-ภาษาอังกฤษ คณะครุศาสตร์
                มหาวิทยาลัยราชภัฏมหาสารคาม
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                ลิงก์ด่วน
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-gray-600 hover:text-gray-900 text-sm">
                    หน้าแรก
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="text-gray-600 hover:text-gray-900 text-sm">
                    เข้าสู่ระบบ
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-gray-600 hover:text-gray-900 text-sm">
                    เกี่ยวกับระบบ
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                ข้อมูลติดต่อ
              </h3>
              <div className="text-gray-600 text-sm space-y-2">
                <p>คณะครุศาสตร์</p>
                <p>มหาวิทยาลัยราชภัฏมหาสารคาม</p>
                <p>โทร: 043-754321</p>
                <p>อีเมล: info@rmu.ac.th</p>
              </div>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center">
            <p className="text-gray-500 text-sm">
              © 2025 มหาวิทยาลัยราชภัฏมหาสารคาม. สงวนลิขสิทธิ์.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default GuestLayout;
